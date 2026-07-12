'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastItem = { id: number; message: string; type: 'success' | 'error' }

type ToastContext = {
  show: (message: string, type?: 'success' | 'error') => void
}

const Ctx = createContext<ToastContext>({ show: () => {} })

export const useToast = () => useContext(Ctx)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <Ctx value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            onClick={() => remove(t.id)}
            className={`animate-slide-up cursor-pointer rounded-2xl border px-5 py-3 text-sm font-semibold shadow-xl backdrop-blur transition hover:opacity-80 ${
              t.type === 'success'
                ? 'border-emerald-600/30 bg-emerald-600/20 text-[color:var(--fg)]'
                : 'border-red-600/30 bg-red-600/20 text-[color:var(--fg)]'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx>
  )
}
