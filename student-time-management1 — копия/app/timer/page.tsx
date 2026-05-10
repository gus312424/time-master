'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Settings, Coffee, Brain, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

export default function TimerPage() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({ work: 25, shortBreak: 5, longBreak: 15 })
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setIsRunning(false)
        if (timerRef.current) clearInterval(timerRef.current)
        if (mode === 'work') setSessionsCompleted(s => s + 1)
        return 0
      }
      return prev - 1
    })
  }, [mode])

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(tick, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning, tick])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => setIsRunning(!isRunning)
  const resetTimer = () => { setIsRunning(false); setTimeLeft(settings[mode] * 60) }

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode)
    setIsRunning(false)
    setTimeLeft(settings[newMode] * 60)
  }

  const adjustTime = (amount: number) => {
    setTimeLeft(prev => Math.max(0, prev + amount))
  }

  const progress = ((settings[mode] * 60 - timeLeft) / (settings[mode] * 60)) * 100

  const modeConfig = {
    work: { color: 'from-blue-600 to-indigo-600', label: 'Фокус', icon: <Brain className="w-5 h-5" /> },
    shortBreak: { color: 'from-emerald-500 to-teal-500', label: 'Перерыв', icon: <Coffee className="w-5 h-5" /> },
    longBreak: { color: 'from-purple-500 to-violet-500', label: 'Отдых', icon: <Coffee className="w-5 h-5" /> },
  }

  if (!mounted) return null

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Таймер</h1>
          <p className="text-gray-500 dark:text-zinc-400">Концентрация на учёбе</p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
        </button>
      </div>

      <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-8">
        {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={cn(
              "flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all",
              mode === m ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-zinc-400"
            )}
          >
            {m === 'work' ? 'Фокус' : m === 'shortBreak' ? 'Короткий' : 'Длинный'}
          </button>
        ))}
      </div>

      <div className={cn("relative rounded-3xl overflow-hidden bg-gradient-to-br p-8 md:p-12 text-white", modeConfig[mode].color)}>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
            {modeConfig[mode].icon}
            <span className="font-semibold text-sm">{modeConfig[mode].label}</span>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <button onClick={() => adjustTime(-60)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl font-bold">−</button>
            <div className="text-7xl md:text-8xl font-bold tabular-nums tracking-tight">{formatTime(timeLeft)}</div>
            <button onClick={() => adjustTime(60)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl font-bold">+</button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={resetTimer} className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={toggleTimer}
              className="p-6 bg-white text-gray-900 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-lg"
            >
              {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20">
          <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
          <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Сессий сегодня</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{sessionsCompleted}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
          <p className="text-gray-400 text-xs font-semibold uppercase mb-1">Время в фокусе</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{sessionsCompleted * settings.work} мин</p>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Настройки интервалов</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Фокус (мин)', key: 'work' as const },
                { label: 'Короткий перерыв (мин)', key: 'shortBreak' as const },
                { label: 'Длинный перерыв (мин)', key: 'longBreak' as const },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">{item.label}</label>
                  <input
                    type="number"
                    value={settings[item.key]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      setSettings({ ...settings, [item.key]: val })
                      if (mode === item.key) setTimeLeft(val * 60)
                    }}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
