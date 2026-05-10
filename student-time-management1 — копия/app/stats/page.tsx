'use client'

import { BarChart3, Clock, CheckSquare, Target, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StatsPage() {
  const weeklyData = [
    { day: 'Пн', hours: 4 },
    { day: 'Вт', hours: 6 },
    { day: 'Ср', hours: 5 },
    { day: 'Чт', hours: 7 },
    { day: 'Пт', hours: 3 },
    { day: 'Сб', hours: 2 },
    { day: 'Вс', hours: 1 },
  ]

  const subjectStats = [
    { subject: 'Математика', hours: 12, color: 'bg-blue-500' },
    { subject: 'Программирование', hours: 10, color: 'bg-indigo-500' },
    { subject: 'Физика', hours: 8, color: 'bg-emerald-500' },
    { subject: 'Английский', hours: 6, color: 'bg-amber-500' },
    { subject: 'История', hours: 4, color: 'bg-rose-500' },
  ]

  const maxHours = Math.max(...weeklyData.map(d => d.hours))
  const totalHours = weeklyData.reduce((acc, d) => acc + d.hours, 0)

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Статистика</h1>
        <p className="text-gray-500 dark:text-zinc-400">Твой прогресс и продуктивность</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Часов за неделю', value: `${totalHours}ч`, icon: <Clock className="w-5 h-5" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
          { label: 'Задач выполнено', value: '30', icon: <CheckSquare className="w-5 h-5" />, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' },
          { label: 'Концентрация', value: '85%', icon: <Target className="w-5 h-5" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
          { label: 'Дней подряд', value: '7', icon: <Flame className="w-5 h-5" />, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.color)}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-400 font-semibold uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Активность по дням
            </h2>
            <select className="bg-gray-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-1.5 text-sm font-medium outline-none">
              <option>Эта неделя</option>
              <option>Прошлая неделя</option>
            </select>
          </div>
          
          <div className="flex items-end justify-between h-48 gap-3">
            {weeklyData.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                  <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all group-hover:opacity-80"
                    style={{ height: `${(day.hours / maxHours) * 100}%` }}
                  />
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-bold">
                    {day.hours}ч
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-400 mt-3">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">По предметам</h2>
          
          <div className="space-y-5">
            {subjectStats.map(stat => (
              <div key={stat.subject}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{stat.subject}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{stat.hours}ч</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2">
                  <div className={cn(stat.color, "h-full rounded-full")} style={{ width: `${(stat.hours / 12) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Отличная работа!</h3>
        <p className="opacity-90">Ты в топ 15% студентов по продуктивности на этой неделе. Концентрация выросла на 12%.</p>
      </div>
    </div>
  )
}
