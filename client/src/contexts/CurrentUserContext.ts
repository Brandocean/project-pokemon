import { createContext, useContext } from 'react'
import type { UserProfile } from '../types/types'

export interface CurrentUserContextValue {
  currentUser: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: UserProfile, token: string) => void
  logout: () => void
}

export const CurrentUserContext =
  createContext<CurrentUserContextValue | null>(null)

export function useCurrentUser() {
  const context = useContext(CurrentUserContext)
  if (!context) {
    throw new Error('useCurrentUser debe usarse dentro de CurrentUserProvider')
  }

  return context
}
