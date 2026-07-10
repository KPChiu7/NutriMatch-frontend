<template>
  <div class="appointments-layout">
    <!-- CALENDAR PANEL -->
    <div class="panel calendar-panel">
      <div class="calendar-header">
        <h2>{{ monthLabel }}</h2>
        <div class="calendar-nav">
          <button @click="prevMonth"><ChevronLeft :size="16" /></button>
          <button @click="nextMonth"><ChevronRight :size="16" /></button>
        </div>
      </div>

      <div class="calendar-grid">
        <span class="dow" v-for="d in ['SUN','MON','TUE','WED','THU','FRI','SAT']" :key="d">{{ d }}</span>

        <button
          v-for="cell in calendarCells"
          :key="cell.key"
          class="day-cell"
          :class="{ blank: !cell.day, selected: cell.isSelected, today: cell.isToday }"
          :disabled="!cell.day"
          @click="selectDay(cell)"
        >
          <span class="day-number">{{ cell.day }}</span>
          <span v-if="cell.hasAppt" class="day-dot" :class="{ 'dot-today': cell.isToday }"></span>
        </button>
      </div>

      <div class="calendar-legend">
        <span class="legend-item"><span class="dot dot-mint"></span> Has appointment</span>
        <span class="legend-item"><span class="dot dot-gold"></span> Today</span>
      </div>
    </div>

    <!-- SCHEDULE PANEL -->
    <div class="panel schedule-panel">
      <div class="schedule-header">
        <div>
          <h3>{{ selectedDateLabel }}</h3>
          <p class="schedule-count">{{ selectedSessions.length }} Scheduled Sessions</p>
        </div>
        <button class="btn-schedule"><Plus :size="15" /> Schedule</button>
      </div>

      <div class="session-list">
        <div
          v-for="session in selectedSessions"
          :key="session.time + session.name"
          class="session-card"
          :class="'accent-' + session.statusColor"
        >
          <div class="session-time">
            <span class="time-main">{{ session.time.split(' ')[0] }}</span>
            <span class="time-suffix">{{ session.time.split(' ')[1] }}</span>
          </div>
          <div class="session-body">
            <div class="session-top">
              <span class="session-name">{{ session.name }}</span>
              <span class="status-pill" :class="'status-' + session.statusColor">
                <component :is="session.statusIcon" :size="11" />
                {{ session.status }}
              </span>
            </div>
            <div class="session-meta">
              <MapPin v-if="session.mode === 'in-person'" :size="12" />
              <Video v-else :size="12" />
              {{ session.type }} · {{ session.duration }} · {{ session.location }}
            </div>
            <span class="session-tag">{{ session.tag }}</span>
          </div>
        </div>

        <p v-if="!selectedSessions.length" class="no-sessions">No appointments scheduled for this day.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeft, ChevronRight, Plus, MapPin, Video, CheckCircle2, Clock3, CalendarClock } from 'lucide-vue-next'

// --- Current view state ---
const viewMonth = ref(3) // April = index 3
const viewYear = ref(2026)
const selectedDate = ref(27) // April 27 selected by default (matches "today" in mock)
const todayDate = 27

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const monthLabel = computed(() => `${monthNames[viewMonth.value]} ${viewYear.value}`)

// --- Mock appointment data keyed by day number ---
const appointmentsByDay = {
  3: [],
  7: [],
  10: [],
  14: [],
  15: [],
  18: [],
  21: [],
  22: [],
  25: [],
  27: [
    { time: '9:00 AM', name: 'Maria Lourdes Santos', type: 'Initial Assessment', duration: '60 min', location: 'Room 3', mode: 'in-person', tag: 'MNT — Type 2 Diabetes', status: 'Confirmed', statusColor: 'green', statusIcon: CheckCircle2 },
    { time: '10:30 AM', name: 'Jose Ramon Cruz', type: 'Follow-up', duration: '45 min', location: 'Telehealth', mode: 'video', tag: 'Hypertension Diet', status: 'In Progress', statusColor: 'gold', statusIcon: Clock3 },
    { time: '2:00 PM', name: 'Ana Luisa Reyes', type: 'Follow-up', duration: '30 min', location: 'Telehealth', mode: 'video', tag: 'Weight Management', status: 'Scheduled', statusColor: 'blue', statusIcon: CalendarClock },
    { time: '4:00 PM', name: 'Roberto Bautista', type: 'Initial Assessment', duration: '60 min', location: 'Room 1', mode: 'in-person', tag: 'CKD Nutrition Support', status: 'Pending', statusColor: 'grey', statusIcon: Clock3 }
  ],
  28: []
}

const selectedSessions = computed(() => appointmentsByDay[selectedDate.value] || [])

const selectedDateLabel = computed(() => {
  const isToday = selectedDate.value === todayDate
  const label = `${monthNames[viewMonth.value].slice(0,3)} ${selectedDate.value}`
  return isToday ? `${label} — Today` : label
})

// --- Calendar grid generation ---
const calendarCells = computed(() => {
  const firstDayOfWeek = new Date(viewYear.value, viewMonth.value, 1).getDay()
  const daysInMonth = new Date(viewYear.value, viewMonth.value + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push({ key: 'blank-' + i, day: null })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      key: 'day-' + d,
      day: d,
      isToday: d === todayDate,
      isSelected: d === selectedDate.value,
      hasAppt: !!(appointmentsByDay[d] && appointmentsByDay[d].length)
    })
  }
  return cells
})

function selectDay(cell) {
  if (!cell.day) return
  selectedDate.value = cell.day
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}
function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}
</script>

<style scoped>
.appointments-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  align-items: start;
}

.panel { background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #eceeec; }

/* CALENDAR */
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.calendar-header h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #1a3a1a; margin: 0; }
.calendar-nav { display: flex; gap: 8px; }
.calendar-nav button {
  width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e0e5e0;
  background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #4a5a4a;
}
.calendar-nav button:hover { background: #f4f6f4; }

.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.dow { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.05em; color: #9aaa9a; text-align: center; padding-bottom: 8px; }

.day-cell {
  aspect-ratio: 1; border: 1px solid transparent; border-radius: 8px;
  background: #fafbfa; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  font-family: inherit; position: relative;
}
.day-cell:hover:not(:disabled) { background: #f0f3f0; }
.day-cell.blank { visibility: hidden; cursor: default; }
.day-cell .day-number { font-size: 0.85rem; color: #3a4a3a; }
.day-cell.today { border-color: #D4A017; background: #fffbf0; }
.day-cell.today .day-number { color: #b8860b; font-weight: 700; }
.day-cell.selected { background: #163a1c; }
.day-cell.selected .day-number { color: #fff; font-weight: 700; }

.day-dot { width: 5px; height: 5px; border-radius: 50%; background: #4caf7d; }
.day-dot.dot-today { background: #D4A017; }
.day-cell.selected .day-dot { background: #D4A017; }

.calendar-legend { display: flex; gap: 20px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #eceeec; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #6a7a6a; }
.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.dot-mint { background: #4caf7d; }
.dot-gold { background: #D4A017; }

/* SCHEDULE */
.schedule-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.schedule-header h3 { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #1a3a1a; margin: 0 0 2px; }
.schedule-count { font-size: 0.8rem; color: #8a9a8a; margin: 0; }

.btn-schedule {
  display: flex; align-items: center; gap: 6px;
  background: #163a1c; color: #fff; border: none;
  padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; flex-shrink: 0;
}
.btn-schedule:hover { background: #10300f; }

.session-list { display: flex; flex-direction: column; gap: 14px; }

.session-card {
  display: flex; gap: 14px;
  background: #fafbfa; border-radius: 10px; padding: 14px;
  border-left: 3px solid #ccc;
}
.session-card.accent-green { border-left-color: #2e9e52; }
.session-card.accent-gold { border-left-color: #D4A017; }
.session-card.accent-blue { border-left-color: #3b6fd6; }
.session-card.accent-grey { border-left-color: #9aa8a0; }

.session-time { display: flex; flex-direction: column; align-items: center; min-width: 44px; flex-shrink: 0; }
.time-main { font-size: 0.85rem; font-weight: 700; color: #1a3a1a; }
.time-suffix { font-size: 0.65rem; color: #9aaa9a; }

.session-body { flex: 1; min-width: 0; }
.session-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px; }
.session-name { font-size: 0.92rem; font-weight: 600; color: #1a3a1a; }

.status-pill {
  display: flex; align-items: center; gap: 4px; flex-shrink: 0;
  font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 20px; white-space: nowrap;
}
.status-green { background: #e6f4e6; color: #2e7d32; }
.status-gold { background: #fdf1d6; color: #b8860b; }
.status-blue { background: #e3edfc; color: #3b6fd6; }
.status-grey { background: #eef0ee; color: #6a7a6a; }

.session-meta {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.78rem; color: #7a8a7a; margin-bottom: 8px;
}
.session-tag {
  display: inline-block; font-size: 0.72rem; font-weight: 600;
  background: #eef2ee; color: #4a5a4a; padding: 3px 10px; border-radius: 6px;
}

.no-sessions { font-size: 0.85rem; color: #9aaa9a; text-align: center; padding: 32px 0; }

@media (max-width: 1100px) {
  .appointments-layout { grid-template-columns: 1fr; }
}
</style>