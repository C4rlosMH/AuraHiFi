const LIDARR_URL = process.env.EXPO_PUBLIC_LIDARR_URL;
const API_KEY = process.env.EXPO_PUBLIC_LIDARR_API_KEY;

// 1. MOTOR BASE DE PETICIONES
const fetchFromLidarr = async (endpoint: string, options: RequestInit = {}) => {
    if (!LIDARR_URL || !API_KEY) {
        throw new Error("Faltan las credenciales de Lidarr en el archivo .env");
    }

    const url = `${LIDARR_URL}${endpoint}`;
    
    const defaultHeaders = {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        }
    });

    const text = await response.text();

    if (!response.ok) {
        console.error(`Error de Lidarr en ${endpoint}:`, text);
        throw new Error(`Lidarr API Error: ${response.status}`);
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
};

// 2. SERVICIO DE CONTROL
export const lidarrService = {
    
    // Configuraciones fijas extraidas de tu servidor
    QUALITY_PROFILE_ID: 2, // Lossless
    METADATA_PROFILE_ID: 1, // Standard
    ROOT_FOLDER: '/music',

    // Utilidad: Verificar si el servidor esta en linea
    getSystemStatus: async () => {
        try {
            const data = await fetchFromLidarr('/api/v1/system/status');
            console.log("Lidarr Conectado. Version:", data.version);
            return true;
        } catch (error) {
            console.error("Fallo la conexion con Lidarr");
            return false;
        }
    },

    // Funcion Principal: Enviar orden de busqueda e inyeccion a qBittorrent
    addAndMonitor: async (searchTerm: string, specificAlbumTitle?: string): Promise<{ success: boolean; message: string }> => {
        try {
            console.log(`Buscando a "${searchTerm}" en Lidarr...`);
            
            // 1. REVISION LOCAL: Verificamos si el artista ya existe en tu servidor
            const existingArtists = await fetchFromLidarr('/api/v1/artist');
            let artist = existingArtists.find((a: any) => 
                a.artistName.toLowerCase() === searchTerm.toLowerCase()
            );

            let isNewArtist = false;

            // 2. REVISION EXTERNA: Si no existe, buscamos en MusicBrainz
            if (!artist) {
                console.log(`El artista no esta localmente. Buscando en MusicBrainz...`);
                const lookupData = await fetchFromLidarr(`/api/v1/artist/lookup?term=${encodeURIComponent(searchTerm)}`);

                if (!lookupData || !Array.isArray(lookupData) || lookupData.length === 0) {
                    return { success: false, message: "Lidarr no encontro resultados para este artista." };
                }

                // Forzamos la coincidencia exacta por nombre para evitar falsos positivos. 
                // Si no hay exacta, tomamos el primero como ultimo recurso.
                artist = lookupData.find((a: any) => a.artistName.toLowerCase() === searchTerm.toLowerCase()) || lookupData[0];
                isNewArtist = !artist.id;
            } else {
                console.log(`Artista encontrado en tu base de datos local: ${artist.artistName}`);
            }

            // 3. SI EL ARTISTA ES NUEVO, LO AGREGAMOS
            if (isNewArtist) {
                artist.qualityProfileId = lidarrService.QUALITY_PROFILE_ID;
                artist.metadataProfileId = lidarrService.METADATA_PROFILE_ID;
                artist.rootFolderPath = lidarrService.ROOT_FOLDER;
                
                // Si piden un album especifico, NO monitoreamos al artista completo
                artist.monitored = specificAlbumTitle ? false : true;
                artist.addOptions = { 
                    searchForMissingAlbums: specificAlbumTitle ? false : true 
                };

                console.log(`Agregando artista: ${artist.artistName}...`);
                artist = await fetchFromLidarr('/api/v1/artist', {
                    method: 'POST',
                    body: JSON.stringify(artist)
                });

                if (!artist.id) {
                    return { success: false, message: "Lidarr rechazo la peticion de guardado del artista." };
                }
            }

            // 4. SI SOLO QUERIAN AL ARTISTA, TERMINAMOS AQUI
            if (!specificAlbumTitle) {
                if (!isNewArtist) {
                    return { success: true, message: "Este artista ya esta en tu servidor." };
                }
                return { success: true, message: `Buscando discografia de ${artist.artistName}...` };
            }

            // 5. LOGICA PARA UN ALBUM ESPECIFICO
            console.log(`Buscando el album "${specificAlbumTitle}" en la base de Lidarr...`);
            
            const albums = await fetchFromLidarr(`/api/v1/album?artistId=${artist.id}`);

            // Buscamos el album que coincida
            const targetAlbum = albums.find((a: any) => 
                a.title.toLowerCase().includes(specificAlbumTitle.toLowerCase()) ||
                specificAlbumTitle.toLowerCase().includes(a.title.toLowerCase())
            );

            if (!targetAlbum) {
                return { success: false, message: `Lidarr no encontro el album "${specificAlbumTitle}" en el perfil de ${artist.artistName}.` };
            }

            // Marcamos el album especifico para ser monitoreado
            if (!targetAlbum.monitored) {
                targetAlbum.monitored = true;
                await fetchFromLidarr(`/api/v1/album/${targetAlbum.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(targetAlbum)
                });
            }

            // Disparamos la busqueda especifica a qBittorrent
            console.log(`Mandando orden para descargar unicamente: ${targetAlbum.title}`);
            await fetchFromLidarr('/api/v1/command', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'AlbumSearch',
                    albumIds: [targetAlbum.id]
                })
            });

            return { success: true, message: `Buscando el album: ${targetAlbum.title}` };

        } catch (error) {
            console.error("Error al procesar orden en Lidarr:", error);
            return { success: false, message: "Fallo de conexion con el servidor de descargas." };
        }
    }
};