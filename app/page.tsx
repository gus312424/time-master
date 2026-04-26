'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Clock, 
  Calendar, 
  CheckSquare, 
  BookOpen,
  ArrowRight,
  Flame
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: number
  title: string
  subject: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

interface ScheduleItem {
  id: number
  time: string
  subject: string
  type: string
  room: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Подготовить презентацию', subject: 'Маркетинг', priority: 'high', completed: false },
    { id: 2, title: 'Решить задачи', subject: 'Математика', priority: 'medium', completed: false },
    { id: 3, title: 'Написать эссе', subject: 'Философия', priority: 'low', completed: true },
    { id: 4, title: 'Лабораторная работа', subject: 'Физика', priority: 'high', completed: false },
  ])

  const todaySchedule: ScheduleItem[] = [
    { id: 1, time: '09:00', subject: 'Математический анализ', type: 'Лекция', room: 'Ауд. 301' },
    { id: 2, time: '10:45', subject: 'Программирование', type: 'Практика', room: 'Комп. класс 2' },
    { id: 3, time: '12:30', subject: 'Английский язык', type: 'Семинар', room: 'Ауд. 215' },
    { id: 4, time: '14:15', subject: 'Физика', type: 'Лабораторная', room: 'Лаб. 105' },
  ]

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
      setCurrentDate(now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const progressPercent = Math.round((completedTasks / totalTasks) * 100)

  if (!mounted) return null

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Привет, Студент!</h1>
          <p className="text-gray-500 dark:text-zinc-400 capitalize">
            {currentDate} · <span className="font-semibold text-gray-700 dark:text-white">{currentTime}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl">
          <Flame className="w-5 h-5 text-amber-600" />
          <span className="font-bold text-amber-700 dark:text-amber-400">7 дней подряд</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckSquare className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{progressPercent}%</span>
          </div>
          <p className="font-medium opacity-90">Прогресс дня</p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-3">
            <div className="bg-white h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-sm opacity-75 mt-2">{completedTasks} из {totalTasks} задач</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Следующая пара</p>
              <p className="font-bold text-gray-900 dark:text-white">Программирование</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-zinc-400">10:45 - 12:15</span>
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-1 rounded text-xs font-semibold">Комп. класс 2</span>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Сегодня</p>
              <p className="font-bold text-gray-900 dark:text-white">4 занятия</p>
            </div>
          </div>
          <Link href="/calendar" className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline">
            Открыть календарь <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Расписание</h2>
            <Link href="/calendar" className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">Все</Link>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 divide-y divide-gray-50 dark:divide-zinc-800">
            {todaySchedule.map((item, index) => (
              <div key={item.id} className={cn("p-4 flex items-center gap-4", index === 1 && "bg-blue-50 dark:bg-blue-900/10")}>
                <div className="text-center min-w-[50px]">
                  <p className="font-bold text-gray-900 dark:text-white">{item.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{item.subject}</p>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{item.type} · {item.room}</p>
                </div>
                {index === 1 && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Задачи</h2>
            <Link href="/tasks" className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">Все</Link>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 divide-y divide-gray-50 dark:divide-zinc-800">
            {tasks.map(task => (
              <div key={task.id} className={cn("p-4 flex items-center gap-4", task.completed && "opacity-50")}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0",
                    task.completed ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 dark:border-zinc-600"
                  )}
                >
                  {task.completed && <CheckSquare className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-semibold truncate", task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white")}>
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-zinc-400">{task.subject}</p>
                </div>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-semibold",
                  task.priority === 'high' ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600" :
                  task.priority === 'medium' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
                  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                )}>
                  {task.priority === 'high' ? 'Срочно' : task.priority === 'medium' ? 'Важно' : 'Норм'}
                </span>
              </div>
            ))}
          </div>

          <Link 
            href="/timer"
            className="mt-4 flex items-center justify-between p-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl group"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <p className="font-bold">Таймер Помодоро</p>
                <p className="text-sm opacity-70">25 мин фокус + 5 мин отдых</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </div>
    </div>
  )
}
