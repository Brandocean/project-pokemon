import { API_URL } from '../config/constants';

type JsonRecord = Record<string, unknown>;

const isJsonRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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
