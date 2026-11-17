import { API_URL } from '../config/constants';
import type { AuthResponse, UserProfile } from '../types/types';

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = `${API_URL.replace(/\/+$/, '')}/`;
  const url = new URL(path.replace(/^\/+/, ''), baseUrl);
  const response = await fetch(url, options);

  if (!response.ok) {
    let message = `La solicitud falló con el estado ${response.status}`;
    if (response.headers.get('content-type')?.includes('application/json')) {
      const body: unknown = await response.json();
      if (isJsonRecord(body) && typeof body.message === 'string') {
        message = body.message;
      }
    }

    throw new Error(message);
  }

  return await response.json() as T;
}

export function registerUser(
  userData: Pick<UserProfile, 'email' | 'name'> & { password: string },
): Promise<UserProfile> {
  return request<UserProfile>('signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
}

export function loginUser(
  credentials: Pick<UserProfile, 'email'> & { password: string },
): Promise<AuthResponse> {
  return request<AuthResponse>('signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser(token: string): Promise<UserProfile> {
  return request<UserProfile>('users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
