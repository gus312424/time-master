/* ===== Sidebar ===== */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show');
}

/* ===== Home Page ===== */
function initHome() {
  console.log('initHome called');
  const data = window.TimeMasterStorage.getData();
  console.log('Loaded data:', data);
  
  // Date & time
  updateDateTime();
  setInterval(updateDateTime, 60000);
  
  // Streak
  const streak = window.TimeMasterStorage.getStreakCount();
  const streakEl = document.getElementById('streakCount');
  if (streakEl) streakEl.textContent = streak + ' дней подряд';
  
  // Progress
  const completed = data.tasks.filter(t => t.completed).length;
  const total = data.tasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const tasksCount = document.getElementById('tasksCount');
  if (progressPercent) progressPercent.textContent = percent + '%';
  if (progressBar) progressBar.style.width = percent + '%';
  if (tasksCount) tasksCount.textContent = completed + ' из ' + total + ' задач';
  
  // Schedule
  const todayKey = window.TimeMasterStorage.getTodayKey();
  const schedule = data.events[todayKey] || [];
  const lessonsCount = document.getElementById('lessonsCount');
  if (lessonsCount) lessonsCount.textContent = schedule.length;
  
  // Next lesson
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextLesson = schedule.find(item => {
    const [h, m] = item.time.split(':').map(Number);
    return h * 60 + m > currentMinutes;
  });
  
  const nextLessonEl = document.getElementById('nextLesson');
  const nextLessonTime = document.getElementById('nextLessonTime');
  if (nextLesson) {
    if (nextLessonEl) nextLessonEl.textContent = nextLesson.title;
    if (nextLessonTime) {
      nextLessonTime.style.display = 'flex';
      const timeText = document.getElementById('nextLessonTimeText');
      const roomText = document.getElementById('nextLessonRoom');
      if (timeText) timeText.textContent = nextLesson.time;
      if (roomText) roomText.textContent = nextLesson.room;
    }
  } else {
    if (nextLessonEl) nextLessonEl.textContent = schedule.length > 0 ? 'Все занятия завершены' : 'Нет занятий';
    if (nextLessonTime) nextLessonTime.style.display = 'none';
  }
  
  renderSchedule(schedule);
  renderDailyTasks(data.dailyTasks);
  renderHomeTasks(data.tasks.slice(0, 4));
  
  // Setup delegated event listeners for dynamic elements
  setupHomeListeners();
  console.log('initHome complete');
}

function setupHomeListeners() {
  // Burger button
  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', toggleSidebar);
  
  // Overlay
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', toggleSidebar);
  
  // Delegated clicks for checkboxes in home page
  const tasksList = document.getElementById('tasksList');
  if (tasksList) {
    tasksList.addEventListener('click', function(e) {
      const btn = e.target.closest('.checkbox-btn');
      if (btn) {
        const id = parseInt(btn.dataset.id);
        if (id) toggleHomeTask(id);
      }
    });
  }
  
  const dailyList = document.getElementById('dailyTasksList');
  if (dailyList) {
    dailyList.addEventListener('click', function(e) {
      const btn = e.target.closest('.checkbox-btn');
      if (btn) {
        const id = parseInt(btn.dataset.id);
        if (id) toggleDailyTask(id);
      }
    });
  }
}

function updateDateTime() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const el = document.getElementById('currentDateTime');
  if (el) el.textContent = dateStr + ' · ' + timeStr;
}

function renderSchedule(schedule) {
  const container = document.getElementById('scheduleList');
  if (!container) return;
  
  if (schedule.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        <p>На сегодня занятий нет</p>
      </div>`;
    return;
  }
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  container.innerHTML = schedule.map((item, index) => {
    const [h, m] = item.time.split(':').map(Number);
    const itemMinutes = h * 60 + m;
    const isActive = itemMinutes <= currentMinutes && (index === schedule.length - 1 || (schedule[index+1] && schedule[index+1].time.split(':').map(Number)[0] * 60 + schedule[index+1].time.split(':').map(Number)[1] > currentMinutes));
    const isNext = !isActive && itemMinutes > currentMinutes;
    
    return `
      <div class="list-item ${isNext ? 'active' : ''}">
        <div class="list-time">${item.time}</div>
        <div class="list-content">
          <div class="list-title">${item.title}</div>
          <div class="list-subtitle">${item.type} · ${item.room}</div>
        </div>
        ${isNext ? '<div class="list-dot"></div>' : ''}
      </div>
    `;
  }).join('');
}

function renderDailyTasks(tasks) {
  const container = document.getElementById('dailyTasksList');
  if (!container) return;
  
  container.innerHTML = tasks.map(task => `
    <div class="list-item ${task.completed ? 'task-completed' : ''}">
      <button class="checkbox-btn ${task.completed ? 'checked' : ''}" data-id="${task.id}">
        ${task.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>' : ''}
      </button>
      <div class="list-content">
        <div class="list-title">${task.title}</div>
        <div class="list-subtitle">${task.subject}</div>
      </div>
    </div>
  `).join('');
}

function toggleDailyTask(id) {
  const data = window.TimeMasterStorage.getData();
  const updated = data.dailyTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  data.dailyTasks = updated;
  window.TimeMasterStorage.saveData(data);
  renderDailyTasks(updated);
  window.TimeMasterStorage.updateStreak();
}

function renderHomeTasks(tasks) {
  const container = document.getElementById('tasksList');
  if (!container) return;
  
  container.innerHTML = tasks.map(task => `
    <div class="list-item ${task.completed ? 'task-completed' : ''}">
      <button class="checkbox-btn ${task.completed ? 'checked' : ''}" data-id="${task.id}">
        ${task.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>' : ''}
      </button>
      <div class="list-content">
        <div class="list-title">${task.title}</div>
        <div class="list-subtitle">${task.subject}</div>
      </div>
      <span class="badge badge-${task.priority}">
        ${task.priority === 'high' ? 'Срочно' : task.priority === 'medium' ? 'Важно' : 'Норм'}
      </span>
    </div>
  `).join('');
}

function toggleHomeTask(id) {
  const data = window.TimeMasterStorage.getData();
  const updated = data.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  data.tasks = updated;
  window.TimeMasterStorage.saveData(data);
  renderHomeTasks(updated.slice(0, 4));
  
  const completed = updated.filter(t => t.completed).length;
  const total = updated.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const progressPercent = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  const tasksCount = document.getElementById('tasksCount');
  if (progressPercent) progressPercent.textContent = percent + '%';
  if (progressBar) progressBar.style.width = percent + '%';
  if (tasksCount) tasksCount.textContent = completed + ' из ' + total + ' задач';
  window.TimeMasterStorage.updateStreak();
}

/* ===== Calendar Page ===== */
let currentMonth = new Date();
let selectedDate = new Date();
let calendarEvents = {};

function initCalendar() {
  console.log('initCalendar called');
  const data = window.TimeMasterStorage.getData();
  calendarEvents = data.events;
  renderCalendar();
  renderEventPanel();
  setupCalendarListeners();
}

function setupCalendarListeners() {
  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', toggleSidebar);
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', toggleSidebar);
  
  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');
  const todayBtn = document.getElementById('todayBtn');
  const addEventBtn = document.getElementById('addEventBtn');
  const addEventPanelBtn = document.getElementById('addEventPanelBtn');
  const saveEventBtn = document.getElementById('saveEventBtn');
  const cancelEventBtn = document.getElementById('cancelEventBtn');
  const closeEventBtn = document.getElementById('closeEventBtn');
  
  if (prevBtn) prevBtn.addEventListener('click', function() { changeMonth(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { changeMonth(1); });
  if (todayBtn) todayBtn.addEventListener('click', goToToday);
  if (addEventBtn) addEventBtn.addEventListener('click', openEventModal);
  if (addEventPanelBtn) addEventPanelBtn.addEventListener('click', openEventModal);
  if (saveEventBtn) saveEventBtn.addEventListener('click', saveEvent);
  if (cancelEventBtn) cancelEventBtn.addEventListener('click', closeEventModal);
  if (closeEventBtn) closeEventBtn.addEventListener('click', closeEventModal);
  
  // Event list delegation for delete
  const eventList = document.getElementById('eventList');
  if (eventList) {
    eventList.addEventListener('click', function(e) {
      const btn = e.target.closest('.delete-event-btn');
      if (btn) {
        const id = parseInt(btn.dataset.id);
        if (id) deleteEvent(id);
      }
    });
  }
  
  // Calendar grid delegation
  const calendarGrid = document.getElementById('calendarGrid');
  if (calendarGrid) {
    calendarGrid.addEventListener('click', function(e) {
      const cell = e.target.closest('.calendar-cell');
      if (cell && cell.dataset.year) {
        selectCalendarDate(parseInt(cell.dataset.year), parseInt(cell.dataset.month), parseInt(cell.dataset.day));
      }
    });
  }
}

function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  let startDay = firstDay.getDay() - 1;
  if (startDay === -1) startDay = 6;
  
  const monthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const monthEl = document.getElementById('calendarMonth');
  if (monthEl) monthEl.textContent = monthNames[month] + ' ' + year;
  
  const days = [];
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, month: month - 1, year, current: false });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ day: i, month, year, current: true });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, month: month + 1, year, current: false });
  }
  
  const grid = document.getElementById('calendarGrid');
  if (!grid) return;
  const today = new Date();
  
  grid.innerHTML = days.map((d, i) => {
    const key = `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
    const dayEvents = calendarEvents[key] || [];
    const isToday = today.getFullYear() === d.year && today.getMonth() === d.month && today.getDate() === d.day;
    const isSelected = selectedDate.getFullYear() === d.year && selectedDate.getMonth() === d.month && selectedDate.getDate() === d.day;
    
    return `
      <div class="calendar-cell ${isSelected ? 'active' : ''} ${!d.current ? 'other-month' : ''}" data-year="${d.year}" data-month="${d.month}" data-day="${d.day}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;">
          <span class="calendar-day-num ${isToday ? 'today' : ''} ${isSelected ? 'active' : ''}">${d.day}</span>
          ${dayEvents.length > 0 ? '<span style="width:6px;height:6px;background:#3b82f6;border-radius:50%;"></span>' : ''}
        </div>
        ${dayEvents.slice(0, 2).map(e => `
          <div class="calendar-event ${e.type}">${e.time} ${e.title}</div>
        `).join('')}
        ${dayEvents.length > 2 ? `<div style="font-size:10px;color:#9ca3af;">+${dayEvents.length - 2}</div>` : ''}
      </div>
    `;
  }).join('');
}

function selectCalendarDate(year, month, day) {
  selectedDate = new Date(year, month, day);
  renderCalendar();
  renderEventPanel();
}

function changeMonth(delta) {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1);
  renderCalendar();
}

function goToToday() {
  currentMonth = new Date();
  selectedDate = new Date();
  renderCalendar();
  renderEventPanel();
}

function renderEventPanel() {
  const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const events = calendarEvents[key] || [];
  
  const titleEl = document.getElementById('selectedDateTitle');
  const weekdayEl = document.getElementById('selectedDateWeekday');
  if (titleEl) titleEl.textContent = selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  if (weekdayEl) weekdayEl.textContent = selectedDate.toLocaleDateString('ru-RU', { weekday: 'long' });
  
  const container = document.getElementById('eventList');
  if (!container) return;
  
  if (events.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:32px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <p>Событий нет</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = events.map(e => `
    <div class="event-item">
      <div class="event-item-header">
        <span class="event-item-type ${e.type}">${e.type === 'lecture' ? 'Лекция' : e.type === 'practice' ? 'Практика' : e.type === 'exam' ? 'Экзамен' : 'Дедлайн'}</span>
        <button class="delete-event-btn" data-id="${e.id}" style="color:#71717a;transition:color 0.2s;background:none;border:none;cursor:pointer;" onmouseover="this.style.color='#e11d48'" onmouseout="this.style.color='#71717a'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="event-item-title">${e.title}</div>
      <div class="event-item-meta">
        <div style="display:flex;align-items:center;gap:4px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${e.time}
        </div>
        <div style="display:flex;align-items:center;gap:4px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${e.room}
        </div>
        <div style="display:flex;align-items:center;gap:4px;grid-column:span 2;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          ${e.instructor}
        </div>
      </div>
    </div>
  `).join('');
}

function deleteEvent(id) {
  const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  calendarEvents[key] = calendarEvents[key].filter(e => e.id !== id);
  if (calendarEvents[key].length === 0) delete calendarEvents[key];
  
  const data = window.TimeMasterStorage.getData();
  data.events = calendarEvents;
  window.TimeMasterStorage.saveData(data);
  renderCalendar();
  renderEventPanel();
}

function openEventModal() {
  const modal = document.getElementById('eventModal');
  const modalDate = document.getElementById('modalDate');
  if (modal) modal.style.display = 'flex';
  if (modalDate) modalDate.textContent = selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  
  // Reset form
  const titleInput = document.getElementById('eventTitle');
  const roomInput = document.getElementById('eventRoom');
  const instructorInput = document.getElementById('eventInstructor');
  if (titleInput) titleInput.value = '';
  if (roomInput) roomInput.value = '';
  if (instructorInput) instructorInput.value = '';
}

function closeEventModal() {
  const modal = document.getElementById('eventModal');
  if (modal) modal.style.display = 'none';
}

function saveEvent() {
  const title = document.getElementById('eventTitle')?.value || '';
  const time = document.getElementById('eventTime')?.value || '09:00';
  const duration = document.getElementById('eventDuration')?.value || '90 мин';
  const typeEl = document.querySelector('.type-option.active');
  const type = typeEl ? typeEl.dataset.type : 'lecture';
  const room = document.getElementById('eventRoom')?.value || '';
  const instructor = document.getElementById('eventInstructor')?.value || '';
  
  if (!title || !room) return;
  
  const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const newEvent = {
    id: Date.now(),
    title, time, duration, type, room, instructor
  };
  
  if (!calendarEvents[key]) calendarEvents[key] = [];
  calendarEvents[key].push(newEvent);
  
  const data = window.TimeMasterStorage.getData();
  data.events = calendarEvents;
  window.TimeMasterStorage.saveData(data);
  
  closeEventModal();
  renderCalendar();
  renderEventPanel();
}

/* ===== Tasks Page ===== */
let tasksFilter = 'all';
let tasksSearch = '';
let editingTaskId = null;

function initTasks() {
  console.log('initTasks called');
  renderTasks();
  setupTasksListeners();
}

function setupTasksListeners() {
  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', toggleSidebar);
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', toggleSidebar);
  
  // Filter tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      setFilter(this.dataset.filter);
    });
  });
  
  // Search
  const searchInput = document.getElementById('taskSearch');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      tasksSearch = this.value;
      renderTasks();
    });
  }
  
  // Add task button
  const addBtn = document.getElementById('addTaskBtn');
  if (addBtn) addBtn.addEventListener('click', function() { openTaskModal(null); });
  
  // Modal buttons
  const saveBtn = document.getElementById('saveTaskBtn');
  const cancelBtn = document.getElementById('cancelTaskBtn');
  const closeBtn = document.getElementById('closeTaskModal');
  if (saveBtn) saveBtn.addEventListener('click', saveTask);
  if (cancelBtn) cancelBtn.addEventListener('click', closeTaskModal);
  if (closeBtn) closeBtn.addEventListener('click', closeTaskModal);
  
  // Priority options
  const priorityOptions = document.querySelectorAll('.priority-option');
  priorityOptions.forEach(opt => {
    opt.addEventListener('click', function() {
      priorityOptions.forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Task container delegation
  const tasksContainer = document.getElementById('tasksContainer');
  if (tasksContainer) {
    tasksContainer.addEventListener('click', function(e) {
      const checkbox = e.target.closest('.checkbox-btn');
      if (checkbox) {
        const id = parseInt(checkbox.dataset.id);
        if (id) toggleTask(id);
        return;
      }
      const editBtn = e.target.closest('.edit-task-btn');
      if (editBtn) {
        const id = parseInt(editBtn.dataset.id);
        if (id) openTaskModal(id);
        return;
      }
      const deleteBtn = e.target.closest('.delete-task-btn');
      if (deleteBtn) {
        const id = parseInt(deleteBtn.dataset.id);
        if (id) deleteTask(id);
      }
    });
  }
}

function renderTasks() {
  const data = window.TimeMasterStorage.getData();
  let tasks = data.tasks;
  
  if (tasksFilter === 'active') tasks = tasks.filter(t => !t.completed);
  if (tasksFilter === 'completed') tasks = tasks.filter(t => t.completed);
  
  if (tasksSearch) {
    const q = tasksSearch.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  }
  
  const statTotal = document.getElementById('statTotal');
  const statCompleted = document.getElementById('statCompleted');
  const statActive = document.getElementById('statActive');
  if (statTotal) statTotal.textContent = data.tasks.length;
  if (statCompleted) statCompleted.textContent = data.tasks.filter(t => t.completed).length;
  if (statActive) statActive.textContent = data.tasks.filter(t => !t.completed).length;
  
  const container = document.getElementById('tasksContainer');
  if (!container) return;
  
  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        <p>Задач не найдено</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = tasks.map(task => `
    <div class="list-item ${task.completed ? 'task-completed' : ''}" style="flex-wrap:wrap;">
      <button class="checkbox-btn ${task.completed ? 'checked' : ''}" data-id="${task.id}">
        ${task.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>' : ''}
      </button>
      <div class="list-content" style="min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <div class="list-title">${task.title}</div>
          <span class="badge badge-${task.priority}">${task.priority === 'high' ? 'Срочно' : task.priority === 'medium' ? 'Важно' : 'Норм'}</span>
        </div>
        <div class="list-subtitle">${task.subject}</div>
        ${task.description ? `<div style="font-size:12px;color:#9ca3af;margin-top:4px;">${task.description}</div>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-left:auto;">
        <div style="display:flex;align-items:center;gap:4px;color:#9ca3af;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          <span style="font-size:12px;">${new Date(task.deadline).toLocaleDateString('ru-RU', {day:'numeric',month:'short'})}</span>
        </div>
        <button class="edit-task-btn" data-id="${task.id}" style="padding:6px;color:#9ca3af;transition:color 0.2s;background:none;border:none;cursor:pointer;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#9ca3af'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="delete-task-btn" data-id="${task.id}" style="padding:6px;color:#9ca3af;transition:color 0.2s;background:none;border:none;cursor:pointer;" onmouseover="this.style.color='#e11d48'" onmouseout="this.style.color='#9ca3af'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function toggleTask(id) {
  const data = window.TimeMasterStorage.getData();
  const updated = data.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  data.tasks = updated;
  window.TimeMasterStorage.saveData(data);
  renderTasks();
  window.TimeMasterStorage.updateStreak();
}

function deleteTask(id) {
  const data = window.TimeMasterStorage.getData();
  data.tasks = data.tasks.filter(t => t.id !== id);
  window.TimeMasterStorage.saveData(data);
  renderTasks();
}

function setFilter(filter) {
  tasksFilter = filter;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  const tab = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
  if (tab) tab.classList.add('active');
  renderTasks();
}

function openTaskModal(id) {
  editingTaskId = id;
  const data = window.TimeMasterStorage.getData();
  const task = id ? data.tasks.find(t => t.id === id) : null;
  
  const modal = document.getElementById('taskModal');
  const modalTitle = document.getElementById('taskModalTitle');
  const titleInput = document.getElementById('taskTitle');
  const subjectInput = document.getElementById('taskSubject');
  const deadlineInput = document.getElementById('taskDeadline');
  const descInput = document.getElementById('taskDescription');
  
  if (modal) modal.style.display = 'flex';
  if (modalTitle) modalTitle.textContent = task ? 'Редактировать задачу' : 'Новая задача';
  if (titleInput) titleInput.value = task ? task.title : '';
  if (subjectInput) subjectInput.value = task ? task.subject : '';
  if (deadlineInput) deadlineInput.value = task ? task.deadline : window.TimeMasterStorage.getTodayKey();
  if (descInput) descInput.value = task ? (task.description || '') : '';
  
  document.querySelectorAll('.priority-option').forEach(opt => {
    opt.classList.toggle('active', task ? opt.dataset.priority === task.priority : opt.dataset.priority === 'medium');
  });
  
  const saveBtn = document.getElementById('saveTaskBtn');
  if (saveBtn) saveBtn.textContent = task ? 'Сохранить' : 'Создать';
}

function closeTaskModal() {
  const modal = document.getElementById('taskModal');
  if (modal) modal.style.display = 'none';
  editingTaskId = null;
}

function saveTask() {
  const title = document.getElementById('taskTitle')?.value;
  const subject = document.getElementById('taskSubject')?.value;
  const deadline = document.getElementById('taskDeadline')?.value;
  const description = document.getElementById('taskDescription')?.value;
  const priorityEl = document.querySelector('.priority-option.active');
  const priority = priorityEl ? priorityEl.dataset.priority : 'medium';
  
  if (!title || !subject || !deadline) return;
  
  const data = window.TimeMasterStorage.getData();
  
  if (editingTaskId) {
    data.tasks = data.tasks.map(t => t.id === editingTaskId ? { ...t, title, subject, deadline, priority, description } : t);
  } else {
    data.tasks.unshift({
      id: Date.now(),
      title, subject, deadline, priority, description,
      completed: false,
      createdAt: window.TimeMasterStorage.getTodayKey()
    });
  }
  
  window.TimeMasterStorage.saveData(data);
  closeTaskModal();
  renderTasks();
}

/* ===== Timer Page ===== */
let timerMode = 'work';
let timerLeft = 25 * 60;
let timerRunning = false;
let timerInterval = null;
let timerSettings = { work: 25, shortBreak: 5, longBreak: 15 };

function initTimer() {
  console.log('initTimer called');
  const data = window.TimeMasterStorage.getData();
  timerSettings = data.timerSettings;
  timerLeft = timerSettings.work * 60;
  const sessionsEl = document.getElementById('timerSessions');
  const focusEl = document.getElementById('timerFocus');
  if (sessionsEl) sessionsEl.textContent = data.timerStats.sessionsCompleted;
  if (focusEl) focusEl.textContent = data.timerStats.focusMinutesToday + ' мин';
  updateTimerDisplay();
  setupTimerListeners();
}

function setupTimerListeners() {
  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', toggleSidebar);
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', toggleSidebar);
  
  // Mode buttons
  const modeBtns = document.querySelectorAll('.timer-mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      setTimerMode(this.dataset.mode);
    });
  });
  
  // Timer controls
  const toggleBtn = document.getElementById('timerToggleBtn');
  const resetBtn = document.getElementById('timerResetBtn');
  const minusBtn = document.getElementById('timerMinusBtn');
  const plusBtn = document.getElementById('timerPlusBtn');
  const settingsBtn = document.getElementById('timerSettingsBtn');
  
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);
  if (minusBtn) minusBtn.addEventListener('click', function() { adjustTimer(-60); });
  if (plusBtn) plusBtn.addEventListener('click', function() { adjustTimer(60); });
  if (settingsBtn) settingsBtn.addEventListener('click', openTimerSettings);
  
  // Settings modal
  const closeSettingsBtn = document.getElementById('closeTimerSettings');
  const cancelSettingsBtn = document.getElementById('cancelTimerSettings');
  const saveSettingsBtn = document.getElementById('saveTimerSettingsBtn');
  
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeTimerSettings);
  if (cancelSettingsBtn) cancelSettingsBtn.addEventListener('click', closeTimerSettings);
  if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveTimerSettings);
}

function updateTimerDisplay() {
  const mins = Math.floor(timerLeft / 60).toString().padStart(2, '0');
  const secs = (timerLeft % 60).toString().padStart(2, '0');
  const display = document.getElementById('timerDisplay');
  if (display) display.textContent = mins + ':' + secs;
  
  const total = timerSettings[timerMode] * 60;
  const progress = ((total - timerLeft) / total) * 100;
  const progressEl = document.getElementById('timerProgress');
  if (progressEl) progressEl.style.width = progress + '%';
}

function setTimerMode(mode) {
  timerMode = mode;
  timerRunning = false;
  clearInterval(timerInterval);
  timerLeft = timerSettings[mode] * 60;
  
  document.querySelectorAll('.timer-mode-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.timer-mode-btn[data-mode="${mode}"]`);
  if (btn) btn.classList.add('active');
  
  const displayBox = document.getElementById('timerDisplayBox');
  const label = document.getElementById('timerLabel');
  const icon = document.getElementById('timerIcon');
  
  if (displayBox) displayBox.className = 'timer-display ' + mode;
  if (label) label.textContent = mode === 'work' ? 'Фокус' : mode === 'shortBreak' ? 'Перерыв' : 'Отдых';
  if (icon) {
    icon.innerHTML = mode === 'work' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></svg>';
  }
  
  updateTimerDisplay();
  const playIcon = document.getElementById('timerPlayIcon');
  if (playIcon) playIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
}

function toggleTimer() {
  const playIcon = document.getElementById('timerPlayIcon');
  if (timerRunning) {
    timerRunning = false;
    clearInterval(timerInterval);
    if (playIcon) playIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  } else {
    timerRunning = true;
    if (playIcon) playIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>';
    timerInterval = setInterval(function() {
      timerLeft--;
      if (timerLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        timerLeft = 0;
        if (timerMode === 'work') {
          window.TimeMasterStorage.addTimerSession(timerSettings.work);
          const data = window.TimeMasterStorage.getData();
          const sessionsEl = document.getElementById('timerSessions');
          const focusEl = document.getElementById('timerFocus');
          if (sessionsEl) sessionsEl.textContent = data.timerStats.sessionsCompleted;
          if (focusEl) focusEl.textContent = data.timerStats.focusMinutesToday + ' мин';
        }
        if (playIcon) playIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      }
      updateTimerDisplay();
    }, 1000);
  }
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerLeft = timerSettings[timerMode] * 60;
  updateTimerDisplay();
  const playIcon = document.getElementById('timerPlayIcon');
  if (playIcon) playIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
}

function adjustTimer(delta) {
  timerLeft = Math.max(0, timerLeft + delta);
  updateTimerDisplay();
}

function openTimerSettings() {
  const modal = document.getElementById('timerSettingsModal');
  const workInput = document.getElementById('settingWork');
  const shortInput = document.getElementById('settingShort');
  const longInput = document.getElementById('settingLong');
  
  if (modal) modal.style.display = 'flex';
  if (workInput) workInput.value = timerSettings.work;
  if (shortInput) shortInput.value = timerSettings.shortBreak;
  if (longInput) longInput.value = timerSettings.longBreak;
}

function closeTimerSettings() {
  const modal = document.getElementById('timerSettingsModal');
  if (modal) modal.style.display = 'none';
}

function saveTimerSettings() {
  const workInput = document.getElementById('settingWork');
  const shortInput = document.getElementById('settingShort');
  const longInput = document.getElementById('settingLong');
  
  timerSettings.work = parseInt(workInput?.value) || 25;
  timerSettings.shortBreak = parseInt(shortInput?.value) || 5;
  timerSettings.longBreak = parseInt(longInput?.value) || 15;
  
  const data = window.TimeMasterStorage.getData();
  data.timerSettings = timerSettings;
  window.TimeMasterStorage.saveData(data);
  
  closeTimerSettings();
  if (!timerRunning) {
    timerLeft = timerSettings[timerMode] * 60;
    updateTimerDisplay();
  }
}

/* ===== Stats Page ===== */
function initStats() {
  console.log('initStats called');
  const data = window.TimeMasterStorage.getData();
  const tasks = data.tasks;
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const concentration = total > 0 ? Math.round((completed / total) * 100) : 0;
  const streak = window.TimeMasterStorage.getStreakCount();
  const focusMinutes = data.timerStats.focusMinutesToday;
  
  // Weekly data
  const weeklyData = [
    { day: 'Пн', hours: Math.floor(Math.random() * 5) + 1 },
    { day: 'Вт', hours: Math.floor(Math.random() * 5) + 1 },
    { day: 'Ср', hours: Math.floor(Math.random() * 5) + 1 },
    { day: 'Чт', hours: Math.floor(Math.random() * 5) + 1 },
    { day: 'Пт', hours: Math.floor(Math.random() * 5) + 1 },
    { day: 'Сб', hours: Math.floor(Math.random() * 3) + 1 },
    { day: 'Вс', hours: Math.floor(Math.random() * 3) + 1 },
  ];
  
  const maxHours = Math.max(...weeklyData.map(d => d.hours));
  const totalWeekly = weeklyData.reduce((a, b) => a + b.hours, 0);
  
  const statWeekly = document.getElementById('statWeeklyHours');
  const statTasks = document.getElementById('statTasksDone');
  const statConc = document.getElementById('statConcentration');
  const statStreak = document.getElementById('statStreak');
  
  if (statWeekly) statWeekly.textContent = totalWeekly + 'ч';
  if (statTasks) statTasks.textContent = completed.toString();
  if (statConc) statConc.textContent = concentration + '%';
  if (statStreak) statStreak.textContent = streak.toString();
  
  // Chart
  const chartContainer = document.getElementById('chartContainer');
  if (chartContainer) {
    chartContainer.innerHTML = weeklyData.map(d => `
      <div class="chart-bar-wrapper">
        <div class="chart-tooltip">${d.hours}ч</div>
        <div class="chart-bar" style="height:${(d.hours / maxHours) * 100}%"></div>
        <div class="chart-label">${d.day}</div>
      </div>
    `).join('');
  }
  
  // Subject stats
  const subjects = [
    { subject: 'Математика', hours: 12, color: '#3b82f6' },
    { subject: 'Программирование', hours: 10, color: '#6366f1' },
    { subject: 'Физика', hours: 8, color: '#10b981' },
    { subject: 'Английский', hours: 6, color: '#f59e0b' },
    { subject: 'История', hours: 4, color: '#f43f5e' },
  ];
  
  const subjectStats = document.getElementById('subjectStats');
  if (subjectStats) {
    subjectStats.innerHTML = subjects.map(s => `
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;font-weight:500;color:#374151;">${s.subject}</span>
          <span style="font-size:14px;font-weight:700;color:#111827;">${s.hours}ч</span>
        </div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width:${(s.hours / 12) * 100}%;background:${s.color}"></div>
        </div>
      </div>
    `).join('');
  }
  
  // Motivation
  const motivation = document.getElementById('motivationText');
  if (motivation) {
    if (concentration > 70) motivation.textContent = 'Ты в топе по продуктивности! Продолжай в том же духе.';
    else if (concentration > 40) motivation.textContent = 'Хороший результат! Есть куда стремиться.';
    else motivation.textContent = 'Начни с малого — выполни одну задачу прямо сейчас!';
  }
  
  // Setup listeners
  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', toggleSidebar);
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', toggleSidebar);
}

/* ===== Settings Page ===== */
let settingsData = null;

function initSettings() {
  console.log('initSettings called');
  settingsData = window.TimeMasterStorage.getData().userSettings;
  const nameInput = document.getElementById('settingName');
  const emailInput = document.getElementById('settingEmail');
  const notifToggle = document.getElementById('toggleNotifications');
  const soundToggle = document.getElementById('toggleSound');
  
  if (nameInput) nameInput.value = settingsData.name;
  if (emailInput) emailInput.value = settingsData.email;
  if (notifToggle) notifToggle.classList.toggle('on', settingsData.notifications);
  if (soundToggle) soundToggle.classList.toggle('on', settingsData.soundEnabled);
  
  setupSettingsListeners();
}

function setupSettingsListeners() {
  const burger = document.getElementById('burgerBtn');
  if (burger) burger.addEventListener('click', toggleSidebar);
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', toggleSidebar);
  
  const notifToggle = document.getElementById('toggleNotifications');
  const soundToggle = document.getElementById('toggleSound');
  const saveBtn = document.getElementById('saveSettingsBtn');
  
  if (notifToggle) notifToggle.addEventListener('click', function() { toggleSetting('notifications'); });
  if (soundToggle) soundToggle.addEventListener('click', function() { toggleSetting('soundEnabled'); });
  if (saveBtn) saveBtn.addEventListener('click', saveSettings);
}

function toggleSetting(key) {
  settingsData[key] = !settingsData[key];
  if (key === 'notifications') {
    const el = document.getElementById('toggleNotifications');
    if (el) el.classList.toggle('on', settingsData.notifications);
  }
  if (key === 'soundEnabled') {
    const el = document.getElementById('toggleSound');
    if (el) el.classList.toggle('on', settingsData.soundEnabled);
  }
}

function saveSettings() {
  const nameInput = document.getElementById('settingName');
  const emailInput = document.getElementById('settingEmail');
  if (nameInput) settingsData.name = nameInput.value;
  if (emailInput) settingsData.email = emailInput.value;
  
  const data = window.TimeMasterStorage.getData();
  data.userSettings = settingsData;
  window.TimeMasterStorage.saveData(data);
  
  // Toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Настройки сохранены!';
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 2000);
}

console.log('app.js loaded');
