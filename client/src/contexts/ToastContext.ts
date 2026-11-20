import { createContext, useContext } from 'react'

export type ToastType = 'success' | 'error'

export interface ToastMessage {
  id: number
  type: ToastType
  message: string
}

export interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void
  dismiss: () => void
  toast: ToastMessage | null
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }

  return context
}
