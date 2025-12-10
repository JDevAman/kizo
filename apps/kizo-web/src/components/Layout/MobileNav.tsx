import { Button } from "../Button/Button"
import { Menu, Zap } from "lucide-react"

interface MobileNavProps {
  onMenuClick: () => void
}

export function MobileNav({ onMenuClick }: MobileNavProps) {
  return (
    <div className="lg:hidden bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-bold text-white">KinzokuPay</span>
        </div>

        <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-2">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>
    </div>
  )
}
