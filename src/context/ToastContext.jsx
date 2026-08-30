import { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)
let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const icons = { success: CheckCircle2, error: XCircle, info: Info }
  const colors = {
    success: 'border-green-500/30 text-green-400',
    error: 'border-red-500/30 text-red-400',
    info: 'border-cyan-500/30 text-cyan-400',
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type] || Info
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-2 bg-[#14141c] border ${colors[t.type]} rounded-xl px-4 py-3 shadow-2xl min-w-[240px] max-w-sm`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-sm text-white flex-1">{t.message}</span>
                <button onClick={() => dismissToast(t.id)} className="text-gray-500 hover:text-gray-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}