import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import ToastContainer from '../components/ui/ToastContainer'
import type { Toast, ToastType } from '../types'
import { ToastContext } from './toastContext'

const TOAST_LIFETIME = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string) => {
      const id = nextId.current++
      setToasts((current) => [...current.slice(-2), { id, type, message }])
      setTimeout(() => dismissToast(id), TOAST_LIFETIME)
    },
    [dismissToast],
  )

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
