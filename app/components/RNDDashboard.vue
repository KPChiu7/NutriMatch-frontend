<template>
  <div class="dashboard-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">Nutri<span class="logo-match">Match</span></span>
      </div>
      <p class="sidebar-subtitle">CLINICAL NUTRITION SYSTEM</p>
      <span class="rnd-badge">● RND PORTAL</span>

      <nav class="sidebar-nav">
        <p class="nav-group-label">MAIN</p>
        
          <a v-for="item in mainNav"
          :key="item.label"
          class="nav-item"
          :class="{ active: activeNav === item.label }"
          @click="activeNav = item.label"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </a>

        <p class="nav-group-label">CLINICAL</p>
        

          <a v-for="item in clinicalNav"
          :key="item.label"
          class="nav-item"
          :class="{ active: activeNav === item.label }"
          @click="activeNav = item.label"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </a>

        <p class="nav-group-label">RESOURCES</p>
        
          <a v-for="item in resourceNav"
          :key="item.label"
          class="nav-item"
          :class="{ active: activeNav === item.label }"
          @click="activeNav = item.label"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </a>
      </nav>
    </aside>

    <!-- MAIN COLUMN -->
    <div class="main-column">
      <!-- STICKY TOP HEADER -->
      <header class="topbar">
        <div>
          <h1>Dashboard</h1>
          <span class="topbar-date">{{ todayLabel }}</span>
        </div>
        <div class="topbar-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input type="text" placeholder="Search patients, records..." />
          </div>
          <button class="icon-btn">💬</button>
          <button class="icon-btn">🔔</button>
          <button class="icon-btn avatar-btn">👤</button>
        </div>
      </header>

      <!-- SCROLLABLE CONTENT -->
      <main class="content">
        <!-- WELCOME BANNER -->
        <section class="welcome-banner">
          <div class="banner-circle"></div>
          <span class="banner-date">● {{ todayLabel }}</span>
          <h2>Good morning, {{ rndName }}! 🌿</h2>
          <p>
            You have <strong>{{ stats.consultationsToday }} consultations</strong> today and
            <strong>{{ stats.pendingRecords }} NCP records</strong> pending completion.
          </p>
          <div class="banner-buttons">
            <button class="btn-gold">+ New Patient</button>
            <button class="btn-outline">Schedule Visit</button>
          </div>
          <div class="banner-dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </section>

        <!-- STAT CARDS -->
        <section class="stat-grid">
          <div class="stat-card" v-for="card in statCards" :key="card.label">
            <div class="stat-top">
              <span class="stat-icon" :style="{ background: card.iconBg }">{{ card.icon }}</span>
              <span class="stat-trend">{{ card.trend }}</span>
            </div>
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </section>

        <!-- MIDDLE ROW -->
        <section class="middle-row">
          <div class="panel adherence-panel">
            <div class="panel-header">
              <h3>Patient Adherence — Weekly</h3>
              <a href="#" class="panel-link">View Report →</a>
            </div>
            <div class="bar-chart">
              <div class="bar-col" v-for="day in weeklyAdherence" :key="day.label">
                <div
                  class="bar"
                  :class="day.highlight ? 'bar-gold' : 'bar-mint'"
                  :style="{ height: day.value + '%' }"
                ></div>
                <span class="bar-label">{{ day.label }}</span>
              </div>
            </div>
          </div>

          <div class="panel calendar-panel">
            <div class="panel-header">
              <h3>{{ calendarMonthLabel }}</h3>
              <div class="calendar-nav">
                <button>‹</button>
                <button>›</button>
              </div>
            </div>
            <div class="calendar-grid">
              <span class="calendar-dow" v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d">{{ d }}</span>
              <span
                v-for="cell in calendarCells"
                :key="cell.key"
                class="calendar-cell"
                :class="{ today: cell.isToday, blank: !cell.day, event: cell.hasEvent }"
              >
                {{ cell.day }}
              </span>
            </div>
          </div>
        </section>

        <!-- BOTTOM ROW -->
        <section class="bottom-row">
          <div class="panel patients-panel">
            <div class="panel-header">
              <h3>Recent Patients</h3>
              <a href="#" class="panel-link">View All →</a>
            </div>
            <table class="patients-table">
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th>CONDITION</th>
                  <th>LAST VISIT</th>
                  <th>ADHERENCE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="patient in recentPatients" :key="patient.id">
                  <td>
                    <div class="patient-cell">
                      <span class="patient-avatar">{{ patient.initials }}</span>
                      <div>
                        <div class="patient-name">{{ patient.name }}</div>
                        <div class="patient-id">{{ patient.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ patient.condition }}</td>
                  <td>{{ patient.lastVisit }}</td>
                  <td>
                    <div class="adherence-cell">
                      <div class="adherence-bar">
                        <div class="adherence-fill" :style="{ width: patient.adherence + '%' }"></div>
                      </div>
                      <span>{{ patient.adherence }}%</span>
                    </div>
                  </td>
                  <td>
                    <span class="status-pill" :class="patient.status.toLowerCase()">{{ patient.status }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="panel schedule-panel">
            <div class="panel-header">
              <h3>Today's Schedule</h3>
              <a href="#" class="panel-link">+ Add</a>
            </div>
            <div class="schedule-list">
              <div class="schedule-item" v-for="item in todaySchedule" :key="item.time + item.name">
                <div class="schedule-time">{{ item.time }}</div>
                <div class="schedule-details">
                  <div class="schedule-name">{{ item.name }}</div>
                  <div class="schedule-meta">{{ item.meta }}</div>
                </div>
                <span class="status-pill" :class="item.status.toLowerCase()">{{ item.status }}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
const rndName = ref('Ivy Hope')
const activeNav = ref('Dashboard')

const todayLabel = 'Friday, May 15, 2026'
const calendarMonthLabel = 'May 2026'

const mainNav = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '👥', label: 'My Patients', badge: 28 },
  { icon: '📅', label: 'Appointments', badge: 5 }
]
const clinicalNav = [
  { icon: '📋', label: 'NCP Records' },
  { icon: '🧭', label: 'Meal Planning' },
  { icon: '📈', label: 'Progress Reports' }
]
const resourceNav = [
  { icon: '📚', label: 'Resource Library' },
  { icon: '💳', label: 'Billing' },
  { icon: '✅', label: 'Task Manager' }
]

const stats = {
  consultationsToday: 3,
  pendingRecords: 2
}

const statCards = [
  { icon: '👥', iconBg: '#eaf3ea', value: 28, label: 'Active Patients', trend: '+3 this week' },
  { icon: '📅', iconBg: '#fdf3d8', value: 5, label: 'Appointments', trend: 'Today' },
  { icon: '💓', iconBg: '#eaf3ea', value: '82%', label: 'Avg. Adherence', trend: '+8%' },
  { icon: '💳', iconBg: '#fdf3d8', value: '₱42.5k', label: 'Revenue', trend: 'May 2026' }
]

const weeklyAdherence = [
  { label: 'Mon', value: 55, highlight: false },
  { label: 'Tue', value: 85, highlight: true },
  { label: 'Wed', value: 45, highlight: false },
  { label: 'Thu', value: 90, highlight: false },
  { label: 'Fri', value: 78, highlight: true },
  { label: 'Sat', value: 92, highlight: false },
  { label: 'Sun', value: 80, highlight: true }
]

// Build a simple May 2026 calendar grid (starts on Friday)
const leadingBlanks = 5 // Su-Th blank before May 1 (Friday)
const daysInMonth = 31
const eventDays = [5, 8, 13, 21, 27]
const todayDate = 15

const calendarCells = []
for (let i = 0; i < leadingBlanks; i++) {
  calendarCells.push({ key: 'blank-' + i, day: null })
}
for (let d = 1; d <= daysInMonth; d++) {
  calendarCells.push({
    key: 'day-' + d,
    day: d,
    isToday: d === todayDate,
    hasEvent: eventDays.includes(d)
  })
}

const recentPatients = [
  { id: '#PT-001', initials: 'MA', name: 'Maria A. Santos', condition: 'Type 2 Diabetes', lastVisit: 'May 13', adherence: 88, status: 'Active' },
  { id: '#PT-002', initials: 'JR', name: 'Juan R. Dela Cruz', condition: 'Hypertension', lastVisit: 'May 12', adherence: 72, status: 'Follow-up' },
  { id: '#PT-003', initials: 'LC', name: 'Luisa C. Reyes', condition: 'Obesity Management', lastVisit: 'May 10', adherence: 60, status: 'Active' },
  { id: '#PT-004', initials: 'BP', name: 'Ben P. Villanueva', condition: 'CKD Stage 3', lastVisit: 'May 9', adherence: 95, status: 'Active' }
]

const todaySchedule = [
  { time: '9:00 AM', name: 'Maria A. Santos', meta: 'Initial Assessment · Video', status: 'Confirmed' },
  { time: '10:30 AM', name: 'Juan R. Dela Cruz', meta: 'Follow-up · Chat', status: 'Pending' },
  { time: '2:00 PM', name: 'Luisa C. Reyes', meta: 'MNT Review · In-person', status: 'Confirmed' }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }

.dashboard-layout {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background: #f7f8f6;
}

/* ============ SIDEBAR ============ */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #14301a;
  color: #fff;
  padding: 24px 20px;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.sidebar-brand { display: flex; align-items: center; gap: 8px; font-size: 1.15rem; font-weight: 700; }
.logo-match { color: #D4A017; }

.sidebar-subtitle {
  font-size: 0.62rem; letter-spacing: 0.1em; color: #7a9a7a; margin: 6px 0 12px;
}

.rnd-badge {
  display: inline-block;
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.04em;
  color: #D4A017; border: 1px solid #D4A017;
  padding: 4px 10px; border-radius: 20px;
  margin-bottom: 24px;
}

.nav-group-label {
  font-size: 0.65rem; letter-spacing: 0.1em; color: #5a7a5a;
  margin: 20px 0 8px; padding-left: 10px;
}

.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 10px; border-radius: 8px;
  color: #c8d8c8; font-size: 0.88rem; font-weight: 500;
  cursor: pointer; transition: background 0.15s;
  position: relative;
  text-decoration: none;
}
.nav-item:hover { background: rgba(255,255,255,0.05); }
.nav-item.active { background: #1e4a26; color: #fff; }

.nav-icon { font-size: 0.95rem; width: 18px; text-align: center; }
.nav-label { flex: 1; }

.nav-badge {
  background: #D4A017; color: #1a3a1a;
  font-size: 0.68rem; font-weight: 700;
  padding: 1px 7px; border-radius: 10px;
}

/* ============ MAIN COLUMN ============ */
.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  border-bottom: 1px solid #eceeec;
  padding: 18px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.topbar h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: #1a3a1a;
  margin: 0;
}
.topbar-date { font-size: 0.8rem; color: #8a9a8a; }

.topbar-actions { display: flex; align-items: center; gap: 12px; }

.search-box {
  display: flex; align-items: center; gap: 8px;
  background: #f4f6f4; border-radius: 8px;
  padding: 8px 14px; width: 260px;
}
.search-box input { border: none; background: none; outline: none; font-size: 0.85rem; width: 100%; }
.search-icon { font-size: 0.85rem; }

.icon-btn {
  width: 36px; height: 36px;
  border-radius: 8px; border: 1px solid #e5e8e5;
  background: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.avatar-btn { border-radius: 50%; }

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px 48px;
}

.welcome-banner {
  background: #163a1c;
  border-radius: 16px;
  padding: 32px 36px;
  color: #fff;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}
.banner-circle {
  position: absolute; top: -80px; right: -80px;
  width: 260px; height: 260px; border-radius: 50%;
  background: rgba(255,255,255,0.05);
}
.banner-date {
  display: inline-block;
  background: rgba(212,160,23,0.15); color: #D4A017;
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
  padding: 4px 12px; border-radius: 20px; margin-bottom: 14px;
}
.welcome-banner h2 { font-family: 'Playfair Display', serif; font-size: 1.6rem; margin: 0 0 10px; }
.welcome-banner p { font-size: 0.9rem; color: #c8d8c8; max-width: 520px; margin-bottom: 20px; }
.welcome-banner strong { color: #fff; }

.banner-buttons { display: flex; gap: 12px; margin-bottom: 20px; }
.btn-gold {
  background: #D4A017; border: none; color: #1a3a1a;
  padding: 10px 20px; border-radius: 24px; font-weight: 700; font-size: 0.85rem; cursor: pointer;
}
.btn-outline {
  background: transparent; border: 1px solid rgba(255,255,255,0.4); color: #fff;
  padding: 10px 20px; border-radius: 24px; font-weight: 600; font-size: 0.85rem; cursor: pointer;
}

.banner-dots { display: flex; gap: 6px; }
.dot { width: 18px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.25); }
.dot.active { background: #D4A017; width: 24px; }

.stat-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;
}
.stat-card {
  background: #fff; border-radius: 12px; padding: 18px 20px; border: 1px solid #eceeec;
}
.stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.stat-icon {
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 0.95rem;
}
.stat-trend { font-size: 0.75rem; color: #6a9a6a; font-weight: 600; }
.stat-value { font-size: 1.6rem; font-weight: 700; color: #1a3a1a; }
.stat-label { font-size: 0.8rem; color: #8a9a8a; margin-top: 2px; }

.middle-row {
  display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 16px;
}
.panel {
  background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #eceeec;
}
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.panel-header h3 { font-size: 0.98rem; color: #1a3a1a; margin: 0; }
.panel-link { font-size: 0.8rem; color: #1a6a2a; text-decoration: none; font-weight: 600; }

.bar-chart { display: flex; justify-content: space-between; align-items: flex-end; height: 180px; }
.bar-col { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; width: 12%; }
.bar { width: 70%; border-radius: 6px 6px 0 0; }
.bar-mint { background: #cfe3d4; }
.bar-gold { background: #f0d383; }
.bar-label { font-size: 0.75rem; color: #8a9a8a; margin-top: 8px; }

.calendar-nav { display: flex; gap: 6px; }
.calendar-nav button {
  width: 24px; height: 24px; border-radius: 6px; border: 1px solid #e5e8e5;
  background: #fff; cursor: pointer; font-size: 0.85rem;
}

.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.calendar-dow { font-size: 0.68rem; color: #9aaa9a; text-align: center; padding-bottom: 6px; }
.calendar-cell {
  aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; color: #3a4a3a; border-radius: 6px; position: relative;
}
.calendar-cell.blank { visibility: hidden; }
.calendar-cell.today { background: #1a3a1a; color: #fff; font-weight: 700; }
.calendar-cell.event::after {
  content: ''; position: absolute; bottom: 3px;
  width: 4px; height: 4px; border-radius: 50%; background: #D4A017;
}
.calendar-cell.today.event::after { background: #D4A017; }

.bottom-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

.patients-table { width: 100%; border-collapse: collapse; }
.patients-table th {
  text-align: left; font-size: 0.68rem; letter-spacing: 0.05em; color: #9aaa9a;
  padding-bottom: 12px; border-bottom: 1px solid #eceeec;
}
.patients-table td { padding: 14px 0; border-bottom: 1px solid #f2f4f2; font-size: 0.85rem; color: #3a4a3a; }

.patient-cell { display: flex; align-items: center; gap: 10px; }
.patient-avatar {
  width: 32px; height: 32px; border-radius: 50%; background: #e5efe5;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; color: #1a3a1a;
}
.patient-name { font-weight: 600; color: #1a3a1a; }
.patient-id { font-size: 0.72rem; color: #9aaa9a; }

.adherence-cell { display: flex; align-items: center; gap: 8px; }
.adherence-bar { width: 70px; height: 6px; background: #eceeec; border-radius: 3px; overflow: hidden; }
.adherence-fill { height: 100%; background: #2e7d32; border-radius: 3px; }

.status-pill {
  font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 20px;
}
.status-pill.active { background: #e6f4e6; color: #2e7d32; }
.status-pill.follow-up { background: #fdf1d6; color: #b8860b; }
.status-pill.confirmed { background: #e6f4e6; color: #2e7d32; }
.status-pill.pending { background: #fdf1d6; color: #b8860b; }

.schedule-list { display: flex; flex-direction: column; gap: 16px; }
.schedule-item { display: flex; align-items: center; gap: 12px; }
.schedule-time { font-size: 0.78rem; color: #8a9a8a; width: 60px; flex-shrink: 0; }
.schedule-details { flex: 1; }
.schedule-name { font-size: 0.88rem; font-weight: 600; color: #1a3a1a; }
.schedule-meta { font-size: 0.75rem; color: #9aaa9a; }

@media (max-width: 1100px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .middle-row, .bottom-row { grid-template-columns: 1fr; }
}
</style>