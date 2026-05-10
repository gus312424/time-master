'use client'

import { useState, useMemo } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Event {
  id: number
  title: string
  time: string
  duration: string
  type: 'lecture' | 'practice' | 'exam' | 'deadline'
  room: string
  instructor: string
}

interface DayEvents {
  [key: string]: Event[]
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [events, setEvents] = useState<DayEvents>({
    '2026-01-19': [
      { id: 1, title: 'Математический анализ', time: '09:00', duration: '90 мин', type: 'lecture', room: 'Ауд. 301', instructor: 'Иванов И.И.' },
      { id: 2, title: 'Программирование', time: '10:45', duration: '90 мин', type: 'practice', room: 'Лаб. 2', instructor: 'Петров П.П.' },
    ],
    '2026-01-20': [
      { id: 3, title: 'Сдача презентации', time: '14:00', duration: '30 мин', type: 'deadline', room: 'Онлайн', instructor: 'Сидоров С.С.' },
    ],
    '2026-01-21': [
      { id: 4, title: 'Физика', time: '09:00', duration: '90 мин', type: 'lecture', room: 'Ауд. 105', instructor: 'Кузнецов К.К.' },
      { id: 5, title: 'Английский язык', time: '12:30', duration: '90 мин', type: 'practice', room: 'Ауд. 215', instructor: 'White A.' },
    ],
    '2026-01-23': [
      { id: 6, title: 'Контрольная по математике', time: '10:00', duration: '120 мин', type: 'exam', room: 'Ауд. 301', instructor: 'Иванов И.И.' },
    ],
  })

  const [formData, setFormData] = useState({
    title: '',
    time: '09:00',
    duration: '90 мин',
    type: 'lecture' as 'lecture' | 'practice' | 'exam' | 'deadline',
    room: '',
    instructor: ''
  })

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    let startDay = firstDayOfMonth.getDay() - 1
    if (startDay === -1) startDay = 6
    
    const days = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, month: month - 1, year, isCurrentMonth: false })
    }
    
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({ day: i, month, year, isCurrentMonth: true })
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, month: month + 1, year, isCurrentMonth: false })
    }
    
    return days
  }, [currentDate])

  const formatKey = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day)
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
  }

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date()
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
  }

  const isSelected = (year: number, month: number, day: number) => {
    return selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const selectedDateKey = formatKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
  const selectedDateEvents = events[selectedDateKey] || []

  const openModal = () => {
    setFormData({ title: '', time: '09:00', duration: '90 мин', type: 'lecture', room: '', instructor: '' })
    setShowModal(true)
  }

  const closeModal = () => setShowModal(false)

  const handleSave = () => {
    if (!formData.title || !formData.room) return

    const newEvent: Event = {
      id: Date.now(),
      ...formData
    }

    setEvents(prev => ({
      ...prev,
      [selectedDateKey]: [...(prev[selectedDateKey] || []), newEvent]
    }))
    closeModal()
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Календарь</h1>
          <p className="text-gray-500 dark:text-zinc-400">Учебный план и события</p>
        </div>
        <button 
          onClick={openModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Добавить событие
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white min-w-[180px]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-lg">
                <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all">
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-md transition-all">
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => {
                const now = new Date()
                setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
                setSelectedDate(now)
              }}
              className="px-4 py-2 text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all"
            >
              Сегодня
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-50 dark:border-zinc-800/50">
            {dayNames.map(day => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              const key = formatKey(date.year, date.month, date.day)
              const dayEvents = events[key] || []
              const active = isSelected(date.year, date.month, date.day)
              const today = isToday(date.year, date.month, date.day)

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(new Date(date.year, date.month, date.day))}
                  className={cn(
                    "min-h-[100px] p-2 border-r border-b border-gray-50 dark:border-zinc-800/50 transition-all cursor-pointer",
                    !date.isCurrentMonth && "opacity-30",
                    active ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-zinc-800/30",
                    (index + 1) % 7 === 0 && "border-r-0"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
                      today ? "bg-blue-600 text-white" : active ? "text-blue-600" : "text-gray-700 dark:text-gray-400"
                    )}>
                      {date.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium truncate",
                          event.type === 'lecture' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                          event.type === 'practice' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" :
                          "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                        )}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] font-medium text-gray-400 px-1">+{dayEvents.length - 2}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="xl:col-span-1 space-y-4">
          <div className="bg-zinc-900 dark:bg-zinc-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </h3>
                <p className="text-zinc-400 text-xs font-medium uppercase">
                  {selectedDate.toLocaleDateString('ru-RU', { weekday: 'long' })}
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      event.type === 'lecture' ? "bg-blue-500/20 text-blue-400" :
                      event.type === 'practice' ? "bg-emerald-500/20 text-emerald-400" :
                      "bg-rose-500/20 text-rose-400"
                    )}>
                      {event.type === 'lecture' ? 'Лекция' : event.type === 'practice' ? 'Практика' : event.type === 'exam' ? 'Экзамен' : 'Дедлайн'}
                    </span>
                    <h4 className="font-semibold mt-2 mb-3">{event.title}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.room}
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <Users className="w-3.5 h-3.5" />
                        {event.instructor}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-500">
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Событий нет</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={openModal}
              className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 transition-all"
            >
              <Plus className="w-5 h-5" />
              Добавить план
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
            <h4 className="font-semibold text-xs uppercase text-gray-400 dark:text-zinc-500 mb-4">Категории</h4>
            <div className="space-y-3">
              {[
                { label: 'Лекции', color: 'bg-blue-500' },
                { label: 'Практики', color: 'bg-emerald-500' },
                { label: 'Экзамены', color: 'bg-rose-500' },
              ].map(cat => (
                <div key={cat.label} className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full", cat.color)} />
                  <span className="text-sm text-gray-700 dark:text-zinc-300">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Новое событие на {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Название</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                  placeholder="Математический анализ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Время</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Длительность</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                  >
                    <option value="30 мин">30 мин</option>
                    <option value="45 мин">45 мин</option>
                    <option value="60 мин">60 мин</option>
                    <option value="90 мин">90 мин</option>
                    <option value="120 мин">120 мин</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Тип</label>
                <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                  {([
                    { key: 'lecture', label: 'Лекция' },
                    { key: 'practice', label: 'Практика' },
                    { key: 'exam', label: 'Экзамен' },
                    { key: 'deadline', label: 'Дедлайн' }
                  ] as const).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: t.key })}
                      className={cn(
                        "flex-1 py-2 rounded-lg font-medium text-xs transition-all",
                        formData.type === t.key 
                          ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" 
                          : "text-gray-500 dark:text-zinc-400"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Аудитория</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                    placeholder="Ауд. 301"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Преподаватель</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                    placeholder="Иванов И.И."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
