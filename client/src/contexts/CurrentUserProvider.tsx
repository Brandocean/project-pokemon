import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { TOKEN_STORAGE_KEY } from '../config/constants'
import type { UserProfile } from '../types/types'
import { getCurrentUser } from '../utils/auth'
import { CurrentUserContext } from './CurrentUserContext'

interface CurrentUserProviderProps {
  children: ReactNode
}

export function CurrentUserProvider({
  children,
}: CurrentUserProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY)
      if (!token) {
        if (isActive) {
          setIsLoading(false)
        }
        return
      }

      try {
        const user = await getCurrentUser(token)
        if (
          isActive &&
          localStorage.getItem(TOKEN_STORAGE_KEY) === token
        ) {
          setCurrentUser(user)
        }
      } catch (error) {
        if (
          isActive &&
          localStorage.getItem(TOKEN_STORAGE_KEY) === token
        ) {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          setCurrentUser(null)
          console.warn('Se cerró la sesión porque no se pudo validar el token:', error)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()
    return () => {
      isActive = false
    }
  }, [])

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
