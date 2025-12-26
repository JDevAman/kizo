import type { ReactNode } from "react"

interface AuthCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 shadow-2xl">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && <h2 className="text-2xl font-semibold text-white mb-2">{title}</h2>}
            {subtitle && <p className="text-slate-400">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
