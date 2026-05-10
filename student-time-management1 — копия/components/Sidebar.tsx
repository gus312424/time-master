'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Timer, 
  BarChart3, 
  Settings,
  GraduationCap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/calendar', label: 'Календарь', icon: Calendar },
  { href: '/tasks', label: 'Задачи', icon: CheckSquare },
  { href: '/timer', label: 'Таймер', icon: Timer },
  { href: '/stats', label: 'Статистика', icon: BarChart3 },
  { href: '/settings', label: 'Настройки', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col z-50 transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TimeMaster</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Для студентов</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 dark:text-zinc-500")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/20">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Совет дня</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Разбивай большие задачи на маленькие шаги для большей продуктивности
          </p>
        </div>
      </div>
    </aside>
  )
}
