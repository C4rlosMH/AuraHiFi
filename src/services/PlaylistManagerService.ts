// src/services/PlaylistManagerService.ts

import { buildUrl, fetchFromNavidrome } from './navidromeApi';

/**
 * Servicio dedicado exclusivamente a la creación y modificación de Playlists
 * en el servidor Navidrome/Subsonic.
 */
export class PlaylistManagerService {
  
  /**
   * Crea una nueva playlist en el servidor.
   * @param name El nombre de la nueva playlist
   * @param trackIds Un arreglo con los IDs de las canciones
   */
  static async createPlaylist(name: string, trackIds: string[]): Promise<void> {
    try {
      // 1. Generamos la URL base con el nombre
      let url = buildUrl('createPlaylist', { name });
      
      // 2. La API de Subsonic requiere que enviemos los IDs apilados de esta forma: &songId=1&songId=2...
      // Como nuestro buildUrl inyecta un objeto, lo agregamos de forma manual a la cadena.
      if (trackIds && trackIds.length > 0) {
        trackIds.forEach(id => {
          url += `&songId=${encodeURIComponent(id)}`;
        });
      }

      // 3. Ejecutamos la petición
      await fetchFromNavidrome(url);
      console.log(`✅ Playlist "${name}" creada exitosamente en el servidor con ${trackIds.length} tracks.`);
      
    } catch (error) {
      console.error(`🚨 Error al intentar crear la playlist "${name}":`, error);
      throw new Error('No se pudo crear la playlist en el servidor.');
    }
  }

  /**
   * Elimina una playlist existente del servidor.
   * @param playlistId El ID de la playlist a borrar
   */
  static async deletePlaylist(playlistId: string): Promise<void> {
    try {
      const url = buildUrl('deletePlaylist', { id: playlistId });
      await fetchFromNavidrome(url);
      console.log(`🗑️ Playlist ${playlistId} eliminada exitosamente.`);
    } catch (error) {
      console.error(`🚨 Error al eliminar la playlist ${playlistId}:`, error);
      throw new Error('No se pudo eliminar la playlist del servidor.');
    }
  }

  /**
   * Agrega canciones a una playlist existente usando el endpoint updatePlaylist.
   * @param playlistId El ID de la playlist a modificar
   * @param trackIds Arreglo con los IDs de las canciones que queremos agregar
   */
  static async addTracksToPlaylist(playlistId: string, trackIds: string[]): Promise<void> {
    if (!trackIds || trackIds.length === 0) return;

    try {
      let url = buildUrl('updatePlaylist', { playlistId });
      
      // La API requiere concatenar los IDs así: &songIdToAdd=1&songIdToAdd=2...
      trackIds.forEach(id => {
        url += `&songIdToAdd=${encodeURIComponent(id)}`;
      });

      await fetchFromNavidrome(url);
      console.log(`✅ ${trackIds.length} canciones agregadas a la playlist ${playlistId}.`);
    } catch (error) {
      console.error(`🚨 Error al intentar agregar canciones a la playlist ${playlistId}:`, error);
      throw new Error('No se pudo actualizar la playlist en el servidor.');
    }
  }

  /**
   * Elimina una canción de una playlist existente usando su índice.
   * @param playlistId El ID de la playlist a modificar
   * @param songIndex El índice (posición) de la canción en la playlist (empezando en 0)
   */
  static async removeTrackFromPlaylist(playlistId: string, songIndex: number): Promise<void> {
    try {
      const url = buildUrl('updatePlaylist', { playlistId, songIndexToRemove: songIndex });
      await fetchFromNavidrome(url);
      console.log(`✅ Canción en el índice ${songIndex} eliminada de la playlist ${playlistId}.`);
    } catch (error) {
      console.error(`🚨 Error al intentar eliminar canción de la playlist ${playlistId}:`, error);
      throw new Error('No se pudo eliminar la canción del servidor.');
    }
  }
}