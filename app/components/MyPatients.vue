<template>
  <div class="my-patients-page">
    <div class="page-header">
      <div>
        <p class="page-sub">Manage your active and pending client relationships.</p>
      </div>
    </div>

    <!-- STAT CARDS -->
    <section v-if="patients.length" class="stat-grid">
      <div class="stat-card">
        <div class="stat-icon icon-blue"><Users :size="17" /></div>
        <p class="stat-value">{{ filters[0].count }}</p>
        <p class="stat-label">Total Patients</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-mint"><Activity :size="17" /></div>
        <p class="stat-value">{{ filters[1].count }}</p>
        <p class="stat-label">Active</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-gold"><Clock :size="17" /></div>
        <p class="stat-value">{{ filters[2].count }}</p>
        <p class="stat-label">Pending</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon icon-red"><UserX :size="17" /></div>
        <p class="stat-value">{{ filters[3].count }}</p>
        <p class="stat-label">Discharged</p>
      </div>
    </section>

    <!-- TOOLBAR: SEARCH + FILTER TABS -->
    <div v-if="patients.length" class="toolbar">
      <div class="search-box-wide">
        <Search :size="16" class="search-icon" />
        <input v-model="search" type="text" placeholder="Search by name or ID....." />
      </div>
      <div class="filter-tabs">
        <button
          v-for="f in filters"
          :key="f.label"
          class="filter-tab"
          :class="{ active: activeFilter === f.label }"
          @click="activeFilter = f.label"
        >
          {{ f.label }} ({{ f.count }})
        </button>
      </div>
    </div>

    <!-- PATIENT TABLE -->
    <div v-if="patients.length" class="patient-table-wrap">
      <table v-if="pagedPatients.length" class="patient-table">
        <thead>
          <tr>
            <th>PATIENT</th>
            <th>CONDITION</th>
            <th>STATUS</th>
            <th>LAST VISIT</th>
            <th>NEXT APPOINTMENT</th>
            <th>NCP STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in pagedPatients" :key="p.name">
            <td class="patient-cell">
              <div class="patient-avatar" :class="{ 'avatar-muted': p.discharged }" :style="!p.discharged ? { background: p.avatarColor } : {}">
                {{ p.initials }}
              </div>
              <span class="patient-name" :class="{ 'name-muted': p.discharged }">{{ p.name }}</span>
            </td>
            <td :class="{ 'text-muted': p.discharged }">{{ p.condition }}</td>
            <td><span class="status-pill" :class="statusClass(p.status)">{{ p.status }}</span></td>
            <td :class="{ 'text-muted': p.discharged }">{{ p.lastVisit || '—' }}</td>
            <td :class="{ 'text-muted': p.discharged }">{{ p.nextAppointment || '—' }}</td>
            <td><span class="ncp-pill" :class="ncpClass(p.ncpStatus)">{{ p.ncpStatus }}</span></td>
            <td class="action-cell">
              <template v-if="p.status === 'Pending Request'">
                <button class="accept-btn" @click="acceptPatient(p)">Accept</button>
                <button class="decline-btn" @click="declinePatient(p)">Decline</button>
              </template>
              <button v-else class="chart-btn" @click="navigateTo(`/patient-detail?patient=${p.name}`)">View Chart</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty-text">No patients match your search or filter.</p>
    </div>

    <!-- PAGINATION -->
    <div v-if="filteredPatients.length" class="pagination-row">
      <span class="pagination-label">Showing {{ pagedPatients.length }} of {{ filteredPatients.length }} patients</span>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="page === 1" @click="page--"><ChevronLeft :size="14" /> Prev</button>
        <button class="page-btn page-btn-primary" :disabled="page >= totalPages" @click="page++">Next <ChevronRight :size="14" /></button>
      </div>
    </div>

    <!-- EMPTY STATE: no patients at all -->
    <div v-else class="empty-state">
      <div class="empty-icon"><Users :size="28" /></div>
      <p class="empty-title">No patients yet</p>
      <p class="empty-desc">Once clients request to work with you, they'll show up here.</p>
    </div>
  </div>
</template>

<script setup>
import { Search, Users, Activity, Clock, UserX, Plus, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { db } from '~/mock/mockDatabase'

definePageMeta({ layout: 'dashboard', title: 'My Patients' })

const search = ref('')
const activeFilter = ref('All')
const page = ref(1)
const pageSize = 6

const patients = ref(db.patients)

const filters = computed(() => [
  { label: 'All', count: patients.value.length },
  { label: 'Active', count: patients.value.filter(p => p.status === 'Active').length },
  { label: 'Pending', count: patients.value.filter(p => p.status.includes('Pending')).length },
  { label: 'Discharged', count: patients.value.filter(p => p.status === 'Discharged').length }
])

const filteredPatients = computed(() => {
  return patients.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesFilter =
      activeFilter.value === 'All' ||
      (activeFilter.value === 'Pending' && p.status.includes('Pending')) ||
      p.status === activeFilter.value
    return matchesSearch && matchesFilter
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPatients.value.length / pageSize)))

const pagedPatients = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredPatients.value.slice(start, start + pageSize)
})

function statusClass(status) {
  if (status === 'Active') return 'status-active'
  if (status.includes('Pending')) return 'status-pending'
  if (status === 'Discharged') return 'status-discharged'
  return ''
}

function ncpClass(ncpStatus) {
  if (ncpStatus.includes('Draft')) return 'ncp-draft'
  if (ncpStatus === 'Not Started') return 'ncp-not-started'
  if (ncpStatus === 'Completed') return 'ncp-completed'
  return ''
}

function acceptPatient(patient) {
  // Wire this up to your real accept-patient API call
  patient.status = 'Active'
}

function declinePatient(patient) {
  // Wire this up to your real decline-patient API call
  patients.value = patients.value.filter(p => p.name !== patient.name)
}
</script>

<style scoped>
* { box-sizing: border-box; }

.my-patients-page { font-family: 'Inter', sans-serif; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; color: #1a3a1a; margin: 0 0 4px; }
.page-sub { font-size: 0.88rem; color: #6a7a6a; margin: 0; }

.add-patient-btn {
  display: flex; align-items: center; gap: 6px;
  background: #00382a; color: #fff; border: none; border-radius: 8px;
  padding: 10px 18px; font-weight: 700; font-size: 0.85rem; cursor: pointer; flex-shrink: 0;
}

/* STAT CARDS */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
.stat-card { background: #fff; border-radius: 14px; padding: 18px 20px; border: 1px solid #CBD5E1; }
.stat-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.stat-icon.icon-blue { background: #e3ecf7; color: #2a5a8a; }
.stat-icon.icon-mint { background: #e3f3ea; color: #1f8f5c; }
.stat-icon.icon-gold { background: #fdf1d6; color: #b8860b; }
.stat-icon.icon-red { background: #fbe0e0; color: #c0392b; }
.stat-value { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #1a3a1a; margin: 0; }
.stat-label { font-size: 0.8rem; color: #6a7a6a; margin: 4px 0 0; }

/* TOOLBAR */
.toolbar { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
.search-box-wide {
  display: flex; align-items: center; gap: 10px; background: #fff; border: 1.5px solid #a8b3a8;
  border-radius: 24px; padding: 12px 18px; width: 100%; max-width: 420px;
}
.search-box-wide input { border: none; background: none; outline: none; font-size: 0.85rem; width: 100%; color: #4a5a4a; }
.search-icon { color: #9aaa9a; flex-shrink: 0; }

/* FILTER TABS */
.filter-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
.filter-tab {
  border: 1px solid #e5e8e5; background: #fff; color: #4a5a4a;
  border-radius: 20px; padding: 9px 18px; font-size: 0.85rem; font-weight: 600; cursor: pointer;
}
.filter-tab.active { background: #14301a; color: #fff; border-color: #14301a; }

/* TABLE */
.patient-table-wrap { background: #fff; border-radius: 14px; border: 1px solid #eceeec; padding: 8px 22px; overflow-x: auto; }
.patient-table { width: 100%; border-collapse: collapse; }
.patient-table th {
  text-align: left; font-size: 0.7rem; letter-spacing: 0.05em; color: #9aaa9a;
  font-weight: 700; padding: 16px 12px 12px; border-bottom: 1px solid #eceeec;
}
.patient-table td { padding: 16px 12px; border-bottom: 1px solid #f2f4f2; font-size: 0.86rem; color: #2a2a2a; }
.patient-table tr:last-child td { border-bottom: none; }

.patient-cell { display: flex; align-items: center; gap: 10px; }
.patient-avatar {
  width: 32px; height: 32px; border-radius: 50%; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
}
.patient-avatar.avatar-muted { background: #d5dad5; color: #fff; }
.patient-name { font-weight: 700; color: #1a3a1a; }
.patient-name.name-muted { color: #9aaa9a; font-weight: 600; }
.text-muted { color: #b0b8b0; }

.status-pill { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; }
.status-pill.status-active { background: #e3f3ea; color: #1f8f5c; }
.status-pill.status-pending { background: #fdf1d6; color: #b8860b; }
.status-pill.status-discharged { background: #fbe0e0; color: #c0392b; }

.ncp-pill { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; }
.ncp-pill.ncp-draft { background: #fdf1d6; color: #b8860b; }
.ncp-pill.ncp-not-started { background: #eceeec; color: #7a8a7a; }
.ncp-pill.ncp-completed { background: #e3f3ea; color: #1f8f5c; }

.action-cell { display: flex; align-items: center; gap: 10px; white-space: nowrap; }
.chart-btn {
  border: 1px solid #d5dad5; background: #fff; color: #2a2a2a;
  border-radius: 6px; padding: 7px 16px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
}
.accept-btn {
  background: #D4A017; color: #1a3a1a; border: none; border-radius: 6px;
  padding: 7px 16px; font-size: 0.8rem; font-weight: 700; cursor: pointer;
}
.decline-btn {
  background: none; border: none; color: #8a9a8a; font-size: 0.8rem; font-weight: 600; cursor: pointer;
}

/* EMPTY STATE */
.empty-state {
  background: #fff; border-radius: 14px; border: 1px solid #eceeec;
  padding: 60px 20px; text-align: center;
}
.empty-icon {
  width: 56px; height: 56px; border-radius: 50%; background: #eef3ec; color: #1e4a26;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
}
.empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #1a3a1a; margin: 0 0 6px; }
.empty-desc { font-size: 0.85rem; color: #8a9a8a; margin: 0; }
.empty-text { font-size: 0.85rem; color: #9aaa9a; padding: 20px; text-align: center; }

/* PAGINATION */
.pagination-row { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; }
.pagination-label { font-size: 0.8rem; color: #8a9a8a; }
.pagination-controls { display: flex; gap: 8px; }
.page-btn {
  display: flex; align-items: center; gap: 4px;
  border: 1px solid #d5dad5; background: #fff; color: #4a5a4a;
  border-radius: 8px; padding: 8px 14px; font-size: 0.82rem; font-weight: 600; cursor: pointer;
}
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-btn-primary { background: #14301a; color: #fff; border-color: #14301a; }
.page-btn-primary:disabled { background: #14301a; opacity: 0.4; }

@media (max-width: 1100px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>