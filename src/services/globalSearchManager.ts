import { spotifyService } from './spotifyService';
import { lastfmService } from './lastfmService';
import { VirtualLibraryService } from './VirtualLibraryService';
import { navidromeApi, buildUrl } from './navidromeApi';

export type SearchSource = 'local' | 'nas' | 'global';
export type ResultType = 'album' | 'artist' | 'track';

export interface UnifiedSearchItem {
    id: string;
    title: string;
    subtitle: string;
    coverArtUrl: string;
    source: SearchSource;
    type: ResultType;
    mbid?: string | null;
    isSaved?: boolean; // Propiedad para saber si ya está en la biblioteca
}
export const globalSearchManager = {
    
    // BÚSQUEDA EN EL SERVIDOR NAS
    searchNas: async (query: string): Promise<UnifiedSearchItem[]> => {
        if (!query.trim()) return [];
        
        try {
            const nasData = await navidromeApi.searchUnified(query);
            // Obtenemos los IDs de los álbumes que ya tienes en tu biblioteca virtual
            const savedAlbumIds = await VirtualLibraryService.getSavedAlbumIds();
            
            const processedResults: UnifiedSearchItem[] = [];

            // 1. Artistas del NAS
            nasData.artists.forEach((artist: any) => {
                processedResults.push({
                    id: artist.id,
                    title: artist.name,
                    subtitle: 'Artista (Servidor)',
                    coverArtUrl: artist.artistImageUrl || '',
                    source: 'nas',
                    type: 'artist'
                });
            });

            // 2. Álbumes del NAS
            nasData.albums.forEach((album: any) => {
                processedResults.push({
                    id: album.id,
                    title: album.name || album.title,
                    subtitle: album.artist,
                    coverArtUrl: buildUrl('getCoverArt', { id: album.id, size: 300 }),
                    source: 'nas',
                    type: 'album',
                    // Comparamos el ID del álbum con tu registro local
                    isSaved: savedAlbumIds.includes(album.id) 
                });
            });

            // 3. Canciones del NAS
            nasData.tracks.forEach((track: any) => {
                processedResults.push({
                    id: track.id,
                    title: track.title,
                    subtitle: `${track.artist} • Canción`,
                    coverArtUrl: buildUrl('getCoverArt', { id: track.coverArt || track.albumId || track.id, size: 300 }),
                    source: 'nas',
                    type: 'track'
                });
            });

            return processedResults;
        } catch (error) {
            console.error("Error en la busqueda del servidor NAS:", error);
            return [];
        }
    },

    // BÚSQUEDA GLOBAL (Spotify + Last.fm - Se mantiene idéntica)
    searchGlobal: async (query: string): Promise<UnifiedSearchItem[]> => {
        if (!query.trim()) return [];

        try {
            const [spotifyArtists, spotifyAlbums] = await Promise.all([
                spotifyService.search(query, 'artist'),
                spotifyService.search(query, 'album')
            ]);

            const processedResults: UnifiedSearchItem[] = [];

            for (const item of spotifyArtists.slice(0, 2)) {
                const mbid = await lastfmService.getArtistMBID(item.name);
                processedResults.push({
                    id: item.id,
                    title: item.name,
                    subtitle: 'Artista',
                    coverArtUrl: item.images?.[0]?.url || '',
                    source: 'global',
                    type: 'artist',
                    mbid: mbid
                });
            }

            for (const item of spotifyAlbums) {
                const artistName = item.artists?.[0]?.name || 'Desconocido';
                const albumName = item.name;
                const mbid = await lastfmService.getAlbumMBID(artistName, albumName);

                processedResults.push({
                    id: item.id,
                    title: albumName,
                    subtitle: artistName,
                    coverArtUrl: item.images?.[0]?.url || '',
                    source: 'global',
                    type: 'album',
                    mbid: mbid
                });
            }

            return processedResults;
        } catch (error) {
            console.error("Error en la cadena de busqueda global:", error);
            return [];
        }
    }
};