// ===== TimeMaster Storage Module =====
// Uses localStorage with in-memory fallback for restricted environments

let MEMORY_FALLBACK = null;
let LOCAL_STORAGE_OK = false;

try {
  const testKey = '__timemaster_test__';
  localStorage.setItem(testKey, '1');
  localStorage.removeItem(testKey);
  LOCAL_STORAGE_OK = true;
} catch (e) {
  console.warn('localStorage not available, using memory fallback');
  LOCAL_STORAGE_OK = false;
}

function lsGet(key) {
  if (LOCAL_STORAGE_OK) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  return MEMORY_FALLBACK ? MEMORY_FALLBACK[key] : null;
}

function lsSet(key, value) {
  if (LOCAL_STORAGE_OK) {
    try { localStorage.setItem(key, value); } catch (e) {}
  } else {
    if (!MEMORY_FALLBACK) MEMORY_FALLBACK = {};
    MEMORY_FALLBACK[key] = value;
  }
}

const STORAGE_KEY = 'timemaster_data';

const DEFAULT_DAILY_TASKS = [
  { title: 'Прочитать 10 страниц учебника', subject: 'Чтение' },
  { title: 'Решить 5 задач', subject: 'Математика' },
  { title: 'Выучить 10 новых слов', subject: 'Английский' },
  { title: 'Сделать конспект лекции', subject: 'Общее' },
  { title: 'Повторить пройденный материал', subject: 'Общее' },
  { title: 'Написать диктант', subject: 'Русский язык' },
  { title: 'Подготовить доклад', subject: 'История' },
];

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function generateDailyTasks(date) {
  const dayOfYear = Math.floor((new Date(date) - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const shuffled = [...DEFAULT_DAILY_TASKS].sort(() => Math.sin(dayOfYear) * 0.5);
  return shuffled.slice(0, 3).map((task, i) => ({
    id: Date.now() + i,
    title: task.title,
    subject: task.subject,
    completed: false,
    date
  }));
}

function getDefaultData() {
  const today = getTodayKey();
  return {
    tasks: [
      { id: 1, title: 'Подготовить презентацию по маркетингу', subject: 'Маркетинг', deadline: today, priority: 'high', completed: false, description: 'Слайды о digital-маркетинге', createdAt: today },
      { id: 2, title: 'Решить задачи из учебника (глава 5)', subject: 'Математика', deadline: today, priority: 'medium', completed: false, description: 'Интегралы и производные', createdAt: today },
      { id: 3, title: 'Написать эссе на тему "Смысл жизни"', subject: 'Философия', deadline: today, priority: 'low', completed: true, createdAt: today },
      { id: 4, title: 'Лабораторная работа №3', subject: 'Физика', deadline: today, priority: 'high', completed: false, description: 'Электромагнитные волны', createdAt: today },
    ],
    events: {
      [today]: [
        { id: 1, title: 'Математический анализ', time: '09:00', duration: '90 мин', type: 'lecture', room: 'Ауд. 301', instructor: 'Иванов И.И.' },
        { id: 2, title: 'Программирование', time: '10:45', duration: '90 мин', type: 'practice', room: 'Комп. класс 2', instructor: 'Петров П.П.' },
        { id: 3, title: 'Английский язык', time: '12:30', duration: '90 мин', type: 'practice', room: 'Ауд. 215', instructor: 'White A.' },
        { id: 4, title: 'Физика', time: '14:15', duration: '90 мин', type: 'lecture', room: 'Лаб. 105', instructor: 'Кузнецов К.К.' },
      ]
    },
    dailyTasks: generateDailyTasks(today),
    timerSettings: { work: 25, shortBreak: 5, longBreak: 15 },
    userSettings: { name: 'Студент', email: 'student@school.ru', notifications: true, soundEnabled: true },
    streakDates: [today],
    timerStats: { sessionsCompleted: 0, focusMinutesToday: 0, lastFocusDate: today }
  };
}

function getData() {
  try {
    const raw = lsGet(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const today = getTodayKey();
      
      if (!data.tasks) data.tasks = [];
      if (!data.events) data.events = {};
      if (!data.dailyTasks) data.dailyTasks = [];
      if (!data.timerSettings) data.timerSettings = { work: 25, shortBreak: 5, longBreak: 15 };
      if (!data.userSettings) data.userSettings = { name: 'Студент', email: 'student@school.ru', notifications: true, soundEnabled: true };
      if (!data.streakDates) data.streakDates = [];
      if (!data.timerStats) data.timerStats = { sessionsCompleted: 0, focusMinutesToday: 0, lastFocusDate: today };
      
      // Check daily tasks
      const lastDailyDate = data.dailyTasks && data.dailyTasks[0] ? data.dailyTasks[0].date : null;
      if (lastDailyDate !== today) {
        data.dailyTasks = generateDailyTasks(today);
      }
      
      // Check streak
      if (!data.streakDates.includes(today)) {
        const yesterday = getYesterdayKey();
        const hasYesterday = data.streakDates.includes(yesterday);
        const isFirstDay = data.streakDates.length === 0;
        if (hasYesterday || isFirstDay) {
          data.streakDates.push(today);
        }
      }
      
      data.streakDates = [...new Set(data.streakDates)].sort();
      
      // Reset focus time if new day
      if (data.timerStats.lastFocusDate !== today) {
        data.timerStats.focusMinutesToday = 0;
        data.timerStats.lastFocusDate = today;
      }
      
      saveData(data);
      return data;
    }
  } catch (e) {
    console.error('Storage error:', e);
  }
  
  const defaultData = getDefaultData();
  saveData(defaultData);
  return defaultData;
}

function saveData(data) {
  try {
    lsSet(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Save error:', e);
  }
}

function updateStreak() {
  const data = getData();
  const today = getTodayKey();
  if (!data.streakDates.includes(today)) {
    data.streakDates.push(today);
    saveData(data);
  }
}

function getStreakCount() {
  const data = getData();
  if (data.streakDates.length === 0) return 0;
  
  const dates = [...data.streakDates].sort();
  const today = getTodayKey();
  
  if (!dates.includes(today)) {
    const yesterday = getYesterdayKey();
    if (!dates.includes(yesterday)) return 0;
  }
  
  let count = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const curr = new Date(dates[i]);
    const prev = new Date(dates[i - 1]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      count++;
    } else {
      break;
    }
  }
  
  return count;
}

function addTimerSession(minutes) {
  const data = getData();
  const today = getTodayKey();
  data.timerStats.sessionsCompleted += 1;
  data.timerStats.focusMinutesToday += minutes;
  data.timerStats.lastFocusDate = today;
  updateStreak();
  saveData(data);
}

// Export for use in other files
window.TimeMasterStorage = {
  getData,
  saveData,
  getDefaultData,
  getTodayKey,
  getStreakCount,
  updateStreak,
  addTimerSession,
  generateDailyTasks
};

console.log('TimeMaster storage loaded, localStorage OK:', LOCAL_STORAGE_OK);
