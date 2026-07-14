import AsyncStorage from '@react-native-async-storage/async-storage';
import { navidromeApi } from './navidromeApi';
import { PlaylistManagerService } from './PlaylistManagerService';

const VIRTUAL_LIBRARY_KEY = '@aura_virtual_library_albums';
const HIDDEN_PLAYLIST_NAME = '__aura_system_library__';

export const VirtualLibraryService = {
    
    // 1. LEER LOS ÁLBUMES GUARDADOS (Desde el disco local)
    getSavedAlbumIds: async (): Promise<string[]> => {
        try {
            const data = await AsyncStorage.getItem(VIRTUAL_LIBRARY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error leyendo la biblioteca virtual local:", error);
            return [];
        }
    },

    // 2. SABER SI UN ÁLBUM ESPECÍFICO ESTÁ GUARDADO
    isAlbumSaved: async (albumId: string): Promise<boolean> => {
        const savedIds = await VirtualLibraryService.getSavedAlbumIds();
        return savedIds.includes(albumId);
    },

    // 3. SINCRONIZACIÓN MAESTRA (Se ejecuta al iniciar sesión en otro dispositivo)
    syncLibraryFromCloud: async (): Promise<void> => {
        try {
            console.log("☁️ Iniciando sincronización de biblioteca con Navidrome...");
            
            const playlists = await navidromeApi.getPlaylists();
            let hiddenPlaylist = playlists.find(p => p.title === HIDDEN_PLAYLIST_NAME);

            if (!hiddenPlaylist) {
                console.log("☁️ Biblioteca virgen. Creando mochila oculta...");
                await PlaylistManagerService.createPlaylist(HIDDEN_PLAYLIST_NAME, []);
                await AsyncStorage.setItem(VIRTUAL_LIBRARY_KEY, JSON.stringify([]));
                return;
            }

            const details = await navidromeApi.getPlaylistDetails(hiddenPlaylist.id);
            const albumIds = details.tracks
                .map((track: any) => track.albumId)
                .filter((id: any): id is string => !!id);

            const uniqueAlbumIds = [...new Set(albumIds)];
            await AsyncStorage.setItem(VIRTUAL_LIBRARY_KEY, JSON.stringify(uniqueAlbumIds));
            
            console.log(`☁️ Sincronización completa: ${uniqueAlbumIds.length} álbumes recuperados.`);
        } catch (error) {
            console.error("Error sincronizando la biblioteca virtual:", error);
        }
    },

    // 4. GUARDAR / ELIMINAR ÁLBUM (Usando tu PlaylistManagerService)
    toggleAlbumInLibrary: async (albumId: string, trackIdToRepresentAlbum: string): Promise<boolean> => {
        try {
            let savedIds = await VirtualLibraryService.getSavedAlbumIds();
            const isCurrentlySaved = savedIds.includes(albumId);

            const playlists = await navidromeApi.getPlaylists();
            let hiddenPlaylist = playlists.find(p => p.title === HIDDEN_PLAYLIST_NAME);
            
            // Si la mochila fue borrada por accidente, la recreamos
            if (!hiddenPlaylist) {
                const newId = await PlaylistManagerService.createPlaylist(HIDDEN_PLAYLIST_NAME, []);
                hiddenPlaylist = { id: newId, title: HIDDEN_PLAYLIST_NAME, coverArtUrl: '' };
            }

            if (isCurrentlySaved) {
                // 🔴 ELIMINAR EL ÁLBUM
                const details = await navidromeApi.getPlaylistDetails(hiddenPlaylist.id);
                const trackIndex = details.tracks.findIndex((t: any) => t.albumId === albumId);

                if (trackIndex !== -1) {
                    await PlaylistManagerService.removeTrackFromPlaylist(hiddenPlaylist.id, trackIndex);
                }
                savedIds = savedIds.filter(id => id !== albumId);
            } else {
                // 🟢 GUARDAR EL ÁLBUM
                await PlaylistManagerService.addTracksToPlaylist(hiddenPlaylist.id, [trackIdToRepresentAlbum]);
                savedIds = [albumId, ...savedIds];
            }

            await AsyncStorage.setItem(VIRTUAL_LIBRARY_KEY, JSON.stringify(savedIds));
            
            return !isCurrentlySaved;
        } catch (error) {
            console.error("Error al alternar álbum en la biblioteca virtual:", error);
            throw error;
        }
    }
};