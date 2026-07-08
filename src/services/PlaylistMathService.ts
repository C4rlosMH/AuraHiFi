// src/services/PlaylistMathService.ts

import { navidromeApi, Track } from './navidromeApi';

/**
 * Servicio Matemático para Teoría de Conjuntos en Playlists de Aura Hi-Fi.
 * Diseñado con estructuras Set (O(1)) para procesamiento instantáneo y
 * métodos asíncronos para interactuar directamente con Navidrome.
 */
export class PlaylistMathService {
  
  // ============================================================================
  // 🧠 MOTOR MATEMÁTICO PURO (Trabaja con objetos Track)
  // ============================================================================

  /**
   * 1. UNIÓN (A ∪ B ∪ C...)
   * Combina múltiples listas en una sola, eliminando las canciones duplicadas.
   */
  static union(...playlists: Track[][]): Track[] {
    const seenIds = new Set<string>();
    const result: Track[] = [];

    for (const playlist of playlists) {
      for (const track of playlist) {
        if (!seenIds.has(track.id)) {
          seenIds.add(track.id);
          result.push(track);
        }
      }
    }
    return result;
  }

  /**
   * 2. INTERSECCIÓN (A ∩ B ∩ C...)
   * Devuelve ÚNICAMENTE las canciones que están presentes en TODAS las listas seleccionadas.
   */
  static intersection(...playlists: Track[][]): Track[] {
    if (playlists.length === 0) return [];
    if (playlists.length === 1) return playlists[0];

    const [basePlaylist, ...otherPlaylists] = playlists;
    
    // Convertimos a Sets para búsquedas ultrarrápidas
    const otherSets = otherPlaylists.map(
      playlist => new Set(playlist.map(track => track.id))
    );

    // Sobrevive solo si el ID de la canción existe en todas las demás playlists
    return basePlaylist.filter(track => 
      otherSets.every(set => set.has(track.id))
    );
  }

  /**
   * 3. DIFERENCIA (A - B - C...)
   * Toma una playlist principal (Base) y le RESTA las canciones de las secundarias.
   */
  static difference(basePlaylist: Track[], ...playlistsToSubtract: Track[][]): Track[] {
    if (!basePlaylist || basePlaylist.length === 0) return [];
    
    const idsToSubtract = new Set<string>();
    for (const playlist of playlistsToSubtract) {
      for (const track of playlist) {
        idsToSubtract.add(track.id);
      }
    }

    // Filtramos excluyendo los IDs castigados
    return basePlaylist.filter(track => !idsToSubtract.has(track.id));
  }


  // ============================================================================
  // 🚀 MÉTODOS MÁGICOS CONECTADOS A NAVIDROME (Para la Interfaz)
  // ============================================================================

  /**
   * Descarga múltiples playlists en paralelo y devuelve la Fusión (Unión)
   */
  static async getUnionFromIds(...playlistIds: string[]): Promise<Track[]> {
    // Promise.all descarga todas las listas al mismo tiempo a latencia cero
    const playlists = await Promise.all(
      playlistIds.map(id => navidromeApi.getPlaylistTracks(id))
    );
    return this.union(...playlists);
  }

  /**
   * Descarga múltiples playlists en paralelo y devuelve las Coincidencias (Intersección)
   */
  static async getIntersectionFromIds(...playlistIds: string[]): Promise<Track[]> {
    const playlists = await Promise.all(
      playlistIds.map(id => navidromeApi.getPlaylistTracks(id))
    );
    return this.intersection(...playlists);
  }

  /**
   * Descarga la base y las restas en paralelo y devuelve la Diferencia
   * @param basePlaylistId El ID de la playlist a la que se le restarán las demás
   * @param playlistIdsToSubtract Los IDs de las playlists que queremos excluir
   */
  static async getDifferenceFromIds(
    basePlaylistId: string, 
    ...playlistIdsToSubtract: string[]
  ): Promise<Track[]> {
    
    // El primer ID es la Base, los demás son los que vamos a restar
    const [basePlaylist, ...playlistsToSubtract] = await Promise.all([
      navidromeApi.getPlaylistTracks(basePlaylistId),
      ...playlistIdsToSubtract.map(id => navidromeApi.getPlaylistTracks(id))
    ]);
    
    return this.difference(basePlaylist, ...playlistsToSubtract);
  }
}