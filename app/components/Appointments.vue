<template>
  <div class="appointments-page">
    <div class="page-header">
      <h1 class="page-title">Appointments</h1>
      <p class="page-sub">Manage your upcoming and past consultations.</p>
    </div>

    <!-- FILTER TABS -->
    <div v-if="appointments.length" class="filter-tabs">
      <button
        v-for="f in filters"
        :key="f.label"
        class="filter-tab"
        :class="{ active: activeFilter === f.label }"
        @click="activeFilter = f.label"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- APPOINTMENT LIST -->
    <div v-if="appointments.length" class="appt-list">
      <div
        v-if="filteredAppointments.length"
        v-for="appt in filteredAppointments"
        :key="appt.id"
        class="appt-card"
        :class="{ 'appt-completed': appt.status === 'Completed' }"
      >
        <div class="appt-date" :class="{ 'date-muted': appt.status === 'Completed' }">
          <span class="appt-day">{{ appt.day }}</span>
          <span class="appt-month">{{ appt.month }}</span>
        </div>
        <div class="appt-avatar" :style="{ background: appt.avatarColor }">{{ appt.initials }}</div>
        <div class="appt-info">
          <p class="appt-name">
            {{ appt.name }}
            <span class="appt-status-pill" :class="appt.statusClass">{{ appt.statusLabel }}</span>
          </p>
          <p class="appt-detail">{{ appt.detail }}</p>
        </div>
        <div class="appt-action">
          <span v-if="appt.note" class="appt-note">{{ appt.note }}</span>
          <template v-else>
            <button v-if="appt.canStart" class="start-session-btn" @click="startSession(appt)">Start Session</button>
            <button v-if="appt.canConfirm" class="confirm-btn" @click="confirmAppointment(appt)">Confirm</button>
            <button v-if="appt.canConfirm" class="decline-btn" @click="declineAppointment(appt)">Decline</button>
            <button v-if="appt.canViewChart" class="chart-btn" @click="navigateTo(`/ncp-records?patient=${appt.name}`)">View Chart</button>
            <button v-if="appt.canReschedule" class="reschedule-btn" @click="rescheduleAppointment(appt)">Reschedule</button>
            <button v-if="appt.canViewRecord" class="chart-btn" @click="navigateTo(`/ncp-records?patient=${appt.name}`)">View NCP Record</button>
          </template>
        </div>
      </div>
      <p v-if="!filteredAppointments.length" class="empty-text">No appointments match this filter.</p>
    </div>

    <!-- EMPTY STATE: no appointments at all -->
    <div v-else class="empty-state">
      <div class="empty-icon"><CalendarDays :size="28" /></div>
      <p class="empty-title">No appointments yet</p>
      <p class="empty-desc">Once patients book sessions with you, they'll show up here.</p>
    </div>
  </div>
</template>

<script setup>
import { CalendarDays } from 'lucide-vue-next'
import { db } from '~/mock/mockDatabase'

definePageMeta({ layout: 'dashboard', title: 'Appointments' })

const activeFilter = ref('All')

const filters = [
  { label: 'All' },
  { label: 'Pending Confirmation' },
  { label: 'Confirmed' },
  { label: 'Completed' },
  { label: 'Cancelled' }
]

const appointments = ref(db.appointments)

const filteredAppointments = computed(() => {
  if (activeFilter.value === 'All') return appointments.value
  if (activeFilter.value === 'Pending Confirmation') {
    return appointments.value.filter(a => a.status === 'Pending Confirmation' || a.status === 'Awaiting Screening')
  }
  return appointments.value.filter(a => a.status === activeFilter.value)
})

function startSession(appt) {
  navigateTo(`/appointments/session?patient=${appt.name}`)
}

function confirmAppointment(appt) {
  // Wire this up to your real confirm-appointment API call
  appt.status = 'Confirmed'
  appt.statusLabel = 'Confirmed'
  appt.statusClass = 'confirmed'
  appt.canConfirm = false
  appt.canViewChart = true
}

function declineAppointment(appt) {
  // Wire this up to your real decline-appointment API call
  appointments.value = appointments.value.filter(a => a.id !== appt.id)
}

function rescheduleAppointment(appt) {
  navigateTo(`/appointments/reschedule?id=${appt.id}`)
}
</script>

<style scoped>
* { box-sizing: border-box; }

.appointments-page { font-family: 'Inter', sans-serif; }

.page-header { margin-bottom: 20px; }
.page-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; color: #1a3a1a; margin: 0 0 4px; }
.page-sub { font-size: 0.88rem; color: #6a7a6a; margin: 0; }

/* FILTER TABS */
.filter-tabs { display: flex; gap: 10px; margin-bottom: 20px; }
.filter-tab {
  border: 1px solid #e5e8e5; background: #fff; color: #4a5a4a;
  border-radius: 20px; padding: 9px 18px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
}
.filter-tab.active { background: #14301a; color: #fff; border-color: #14301a; }

/* APPOINTMENT LIST */
.appt-list { display: flex; flex-direction: column; gap: 16px; }
.appt-card {
  background: #fff; border-radius: 12px; border: 1px solid #eceeec; padding: 20px 22px;
  display: flex; align-items: center; gap: 16px;
}
.appt-card.appt-completed { opacity: 0.7; }

.appt-date {
  width: 52px; height: 52px; border-radius: 8px; background: #eef3ec;
  display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
}
.appt-date.date-muted { background: #eceeec; }
.appt-day { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #1a3a1a; line-height: 1; }
.appt-month { font-size: 0.62rem; letter-spacing: 0.05em; color: #6a7a6a; margin-top: 2px; }

.appt-avatar {
  width: 32px; height: 32px; border-radius: 50%; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
}

.appt-info { flex: 1; }
.appt-name { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; font-weight: 700; color: #1a3a1a; margin: 0 0 4px; }
.appt-status-pill { font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; white-space: nowrap; }
.appt-status-pill.confirmed { background: #e6efe0; color: #3a6b3a; }
.appt-status-pill.awaiting { background: #faead0; color: #b8860b; }
.appt-status-pill.pending { background: #faead0; color: #b8860b; }
.appt-status-pill.completed { background: #eceeec; color: #7a8a7a; }
.appt-detail { font-size: 0.8rem; color: #6a7a6a; margin: 0; }

.appt-action { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.appt-note { font-size: 0.82rem; color: #b8860b; background: #faf1de; padding: 10px 16px; border-radius: 8px; max-width: 320px; text-align: right; }

.start-session-btn, .confirm-btn {
  background: #D4A017; color: #1a3a1a; border: none; border-radius: 8px;
  padding: 10px 18px; font-weight: 700; font-size: 0.85rem; cursor: pointer; white-space: nowrap;
}
.decline-btn {
  background: none; border: none; color: #8a9a8a; font-size: 0.85rem; font-weight: 600; cursor: pointer;
}
.chart-btn, .reschedule-btn {
  border: 1px solid #d5dad5; background: #fff; color: #2a2a2a;
  border-radius: 8px; padding: 10px 18px; font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap;
}

/* EMPTY STATE */
.empty-state {
  background: #fff; border-radius: 12px; border: 1px solid #eceeec;
  padding: 60px 20px; text-align: center;
}
.empty-icon {
  width: 56px; height: 56px; border-radius: 50%; background: #eef3ec; color: #1e4a26;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
}
.empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #1a3a1a; margin: 0 0 6px; }
.empty-desc { font-size: 0.85rem; color: #8a9a8a; margin: 0; }
.empty-text { font-size: 0.85rem; color: #9aaa9a; padding: 20px; text-align: center; }
</style>