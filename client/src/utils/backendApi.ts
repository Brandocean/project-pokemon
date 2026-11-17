import { TOKEN_STORAGE_KEY } from '../config/constants';
import type { FavoriteData } from '../types/types';
import { apiRequest } from './apiRequest';

type NewFavorite = Omit<FavoriteData, '_id'>;

function getAuthorizationHeader(): string {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    throw new Error('Se requiere una sesión iniciada para gestionar favoritos.');
  }

  return `Bearer ${token}`;
}

function requestWithAuth<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Authorization', getAuthorizationHeader());

  return apiRequest<T>(path, {
    ...options,
    headers,
  });
}

export function getFavorites(): Promise<FavoriteData[]> {
  return requestWithAuth<FavoriteData[]>('favorites');
}

export function addFavorite(favorite: NewFavorite): Promise<FavoriteData> {
  return requestWithAuth<FavoriteData>('favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorite),
  });
}

export function removeFavorite(id: string): Promise<FavoriteData> {
  return requestWithAuth<FavoriteData>(`favorites/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
