'use client'

import { useState } from 'react'
import { 
  Plus, 
  CheckSquare,
  Trash2,
  Edit2,
  Calendar,
  Search,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Task {
  id: number
  title: string
  subject: string
  deadline: string
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  description?: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Подготовить презентацию по маркетингу', subject: 'Маркетинг', deadline: '2026-01-20', priority: 'high', completed: false, description: 'Слайды о digital-маркетинге' },
    { id: 2, title: 'Решить задачи из учебника (глава 5)', subject: 'Математика', deadline: '2026-01-21', priority: 'medium', completed: false, description: 'Интегралы и производные' },
    { id: 3, title: 'Написать эссе на тему "Смысл жизни"', subject: 'Философия', deadline: '2026-01-22', priority: 'low', completed: true },
    { id: 4, title: 'Лабораторная работа №3', subject: 'Физика', deadline: '2026-01-23', priority: 'high', completed: false, description: 'Электромагнитные волны' },
    { id: 5, title: 'Перевод текста', subject: 'Английский язык', deadline: '2026-01-24', priority: 'medium', completed: false },
    { id: 6, title: 'Подготовка к тесту', subject: 'История', deadline: '2026-01-25', priority: 'low', completed: false },
  ])

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    deadline: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    description: ''
  })

  const openAddModal = () => {
    setEditingTask(null)
    setFormData({ title: '', subject: '', deadline: '', priority: 'medium', description: '' })
    setShowModal(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      subject: task.subject,
      deadline: task.deadline,
      priority: task.priority,
      description: task.description || ''
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingTask(null)
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleSave = () => {
    if (!formData.title || !formData.subject || !formData.deadline) return

    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...formData }
          : task
      ))
    } else {
      setTasks([{
        id: Date.now(),
        ...formData,
        completed: false
      }, ...tasks])
    }
    closeModal()
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'active' ? !task.completed : filter === 'completed' ? task.completed : true
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Задачи</h1>
          <p className="text-gray-500 dark:text-zinc-400">Управляй учебным процессом</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all font-semibold"
        >
          <Plus className="w-5 h-5" />
          Новая задача
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
          <p className="text-gray-400 dark:text-zinc-500 text-xs font-semibold uppercase mb-1">Всего</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
          <p className="text-gray-400 dark:text-zinc-500 text-xs font-semibold uppercase mb-1">Выполнено</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-gray-100 dark:border-zinc-800">
          <p className="text-gray-400 dark:text-zinc-500 text-xs font-semibold uppercase mb-1">В работе</p>
          <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
          />
        </div>
        <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                filter === f 
                  ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" 
                  : "text-gray-500 dark:text-zinc-400"
              )}
            >
              {f === 'all' ? 'Все' : f === 'active' ? 'Активные' : 'Готово'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            className={cn(
              "bg-white dark:bg-zinc-900 rounded-2xl p-5 border transition-all flex items-center gap-4",
              task.completed 
                ? "border-transparent opacity-50" 
                : "border-gray-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-zinc-700"
            )}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={cn(
                "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                task.completed
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-300 dark:border-zinc-700 hover:border-blue-500"
              )}
            >
              {task.completed && <CheckSquare className="w-4 h-4" />}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn(
                  "font-semibold truncate",
                  task.completed ? "text-gray-400 line-through" : "text-gray-900 dark:text-white"
                )}>
                  {task.title}
                </h3>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0",
                  task.priority === 'high' ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600" :
                  task.priority === 'medium' ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600" :
                  "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                )}>
                  {task.priority === 'high' ? 'Срочно' : task.priority === 'medium' ? 'Важно' : 'Норм'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-zinc-400">{task.subject}</p>
            </div>

            <div className="hidden md:flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">
                  {new Date(task.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => openEditModal(task)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-semibold">Задач не найдено</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingTask ? 'Редактировать задачу' : 'Новая задача'}
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
                  placeholder="Что нужно сделать?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Предмет</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                    placeholder="Маркетинг"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Дедлайн</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Приоритет</label>
                <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={cn(
                        "flex-1 py-2 rounded-lg font-medium text-sm transition-all",
                        formData.priority === p 
                          ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm" 
                          : "text-gray-500 dark:text-zinc-400"
                      )}
                    >
                      {p === 'low' ? 'Норм' : p === 'medium' ? 'Важно' : 'Срочно'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white outline-none resize-none"
                  rows={3}
                  placeholder="Подробности..."
                />
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
                {editingTask ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
