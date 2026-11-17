import type { AuthResponse, UserProfile } from '../types/types';
import { apiRequest } from './apiRequest';

export function registerUser(
  userData: Pick<UserProfile, 'email' | 'name'> & { password: string },
): Promise<UserProfile> {
  return apiRequest<UserProfile>('signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
}

export function loginUser(
  credentials: Pick<UserProfile, 'email'> & { password: string },
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser(token: string): Promise<UserProfile> {
  return apiRequest<UserProfile>('users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
