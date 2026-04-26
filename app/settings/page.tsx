'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { User, Bell, Moon, Sun, Clock, Volume2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    name: 'Студент',
    email: 'student@university.ru',
    notifications: true,
    pomodoroWork: 25,
    pomodoroBreak: 5,
    soundEnabled: true
  })

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleSave = () => {
    const el = document.createElement('div')
    el.className = 'fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg font-semibold z-50'
    el.innerText = 'Настройки сохранены!'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 2000)
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Настройки</h1>
        <p className="text-gray-500 dark:text-zinc-400">Персонализируй приложение</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Профиль</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Имя</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Moon className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Внешний вид</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <span className="font-medium text-gray-900 dark:text-white">Тёмная тема</span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={cn("w-12 h-7 rounded-full transition-all flex items-center px-1", theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300')}
            >
              <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform", theme === 'dark' ? 'translate-x-5' : 'translate-x-0')} />
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-rose-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Помодоро</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Работа (мин)</label>
              <input
                type="number"
                value={settings.pomodoroWork}
                onChange={(e) => setSettings({ ...settings, pomodoroWork: parseInt(e.target.value) || 25 })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Отдых (мин)</label>
              <input
                type="number"
                value={settings.pomodoroBreak}
                onChange={(e) => setSettings({ ...settings, pomodoroBreak: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Уведомления</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <span className="font-medium text-gray-900 dark:text-white">Push-уведомления</span>
              <button
                onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                className={cn("w-12 h-7 rounded-full transition-all flex items-center px-1", settings.notifications ? 'bg-amber-500' : 'bg-gray-300 dark:bg-zinc-700')}
              >
                <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform", settings.notifications ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-gray-900 dark:text-white">Звуки</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className={cn("w-12 h-7 rounded-full transition-all flex items-center px-1", settings.soundEnabled ? 'bg-amber-500' : 'bg-gray-300 dark:bg-zinc-700')}
              >
                <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-transform", settings.soundEnabled ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Сохранить изменения
        </button>
      </div>
    </div>
  )
}
