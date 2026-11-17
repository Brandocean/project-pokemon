import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { TOKEN_STORAGE_KEY } from '../config/constants'
import type { UserProfile } from '../types/types'
import { CurrentUserContext } from './CurrentUserContext'

interface CurrentUserProviderProps {
  children: ReactNode
}

export function CurrentUserProvider({
  children,
}: CurrentUserProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback((user: UserProfile, token: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    setCurrentUser(user)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setCurrentUser(null)
    setIsLoading(false)
  }, [])

  const contextValue = useMemo(
    () => ({
      currentUser,
      isAuthenticated: currentUser !== null,
      isLoading,
      login,
      logout,
    }),
    [currentUser, isLoading, login, logout],
  )

  return (
    <CurrentUserContext.Provider value={contextValue}>
      {children}
    </CurrentUserContext.Provider>
  )
}
