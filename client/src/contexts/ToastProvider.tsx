import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './ToastContext'
import type { ToastMessage, ToastType } from './ToastContext'

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setToast(null)
  }, [])

  const notify = useCallback((message: string, type: ToastType = 'success') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setToast({ id: Date.now(), type, message })
    timeoutRef.current = setTimeout(() => {
      setToast(null)
      timeoutRef.current = null
    }, 4000)
  }, [])

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ notify, dismiss, toast }}>
      {children}
    </ToastContext.Provider>
  )
}
