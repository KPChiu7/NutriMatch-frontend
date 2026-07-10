<template>
  <div>
    <!-- PAGE INTRO -->
    <div class="page-intro">
      <p class="page-subtitle">Manage and monitor all patient records</p>
      <button class="btn-add-patient"><Plus :size="16" /> Add Patient</button>
    </div>

    <!-- STAT CARDS -->
    <section class="stat-grid">
      <div class="stat-card" v-for="card in statCards" :key="card.label">
        <div class="stat-top">
          <span class="stat-icon" :style="{ background: card.iconBg }">
            <component :is="card.icon" :size="17" :color="card.iconColor" />
          </span>
          <span v-if="card.badge" class="stat-badge">{{ card.badge }}</span>
        </div>
        <div class="stat-value">{{ card.value }}</div>
        <div class="stat-label">{{ card.label }}</div>
      </div>
    </section>

    <!-- FILTER BAR -->
    <div class="filter-bar">
      <div class="filter-search">
        <Search :size="15" class="filter-search-icon" />
        <input v-model="search" type="text" placeholder="Search by name or ID....." />
      </div>
      <div class="filter-selects">
        <select v-model="conditionFilter">
          <option value="">All Conditions</option>
          <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="statusFilter">
          <option value="">All Status</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="phaseFilter">
          <option value="">All NCP Phases</option>
          <option v-for="p in phases" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
    </div>

    <!-- PATIENTS TABLE -->
    <div class="panel table-panel">
      <table class="patients-table">
        <thead>
          <tr>
            <th>PATIENT</th>
            <th>AGE / GENDER</th>
            <th>CONDITION</th>
            <th>NCP PHASE</th>
            <th>ADHERENCE</th>
            <th>NEXT APPT.</th>
            <th>STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in paginatedPatients" :key="patient.id">
            <td>
              <div class="patient-cell">
                <span class="patient-avatar" :style="{ background: patient.avatarBg, color: patient.avatarColor }">
                  {{ patient.initials }}
                </span>
                <div>
                  <div class="patient-name">{{ patient.name }}</div>
                  <div class="patient-id">{{ patient.id }}</div>
                </div>
              </div>
            </td>
            <td>{{ patient.age }} · {{ patient.gender }}</td>
            <td>{{ patient.condition }}</td>
            <td><span class="phase-pill" :class="'phase-' + patient.phase.toLowerCase()">{{ patient.phase }}</span></td>
            <td>
              <div class="adherence-cell">
                <div class="adherence-bar">
                  <div
                    class="adherence-fill"
                    :class="adherenceClass(patient.adherence)"
                    :style="{ width: patient.adherence + '%' }"
                  ></div>
                </div>
                <span :class="adherenceTextClass(patient.adherence)">{{ patient.adherence }}%</span>
              </div>
            </td>
            <td>{{ patient.nextAppt }}</td>
            <td>
              <span class="status-pill" :class="patient.status.toLowerCase().replace(' ', '-')">{{ patient.status }}</span>
            </td>
            <td>
              <button class="btn-view">View</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table-footer">
        <span class="results-count">Showing {{ paginatedPatients.length }} of {{ filteredPatients.length }} patients</span>
        <div class="pagination">
          <button class="btn-page" :disabled="page === 1" @click="page--">
            <ChevronLeft :size="15" /> Prev
          </button>
          <button class="btn-page btn-page-primary" :disabled="page === totalPages" @click="page++">
            Next <ChevronRight :size="15" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, TrendingUp, Clock, Calendar, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const statCards = [
  { icon: Users, iconBg: '#e8f0fb', iconColor: '#3b6fd6', value: 28, label: 'Total Patients', badge: 5 },
  { icon: TrendingUp, iconBg: '#eaf7ee', iconColor: '#2e9e52', value: 24, label: 'Active' },
  { icon: Clock, iconBg: '#fdf3d8', iconColor: '#b8860b', value: 3, label: 'Needs Review' },
  { icon: Calendar, iconBg: '#f0edfb', iconColor: '#6a4fc7', value: 3, label: 'New This Month' }
]

// --- Mock patient data (6 unique patients) ---
const allPatients = [
  { id: '#PT-001', initials: 'MA', avatarBg: '#fdeccb', avatarColor: '#b8860b', name: 'Maria A. Santos', age: 54, gender: 'Female', condition: 'Type 2 Diabetes', phase: 'Monitoring', adherence: 88, nextAppt: 'May 22', status: 'Active' },
  { id: '#PT-002', initials: 'JR', avatarBg: '#d9f2e3', avatarColor: '#2e9e52', name: 'Juan R. Dela Cruz', age: 47, gender: 'Male', condition: 'Hypertension', phase: 'Intervention', adherence: 72, nextAppt: 'May 20', status: 'Follow-up' },
  { id: '#PT-003', initials: 'LC', avatarBg: '#dbe7fb', avatarColor: '#3b6fd6', name: 'Luisa C. Reyes', age: 38, gender: 'Female', condition: 'Obesity Management', phase: 'Diagnosis', adherence: 60, nextAppt: 'May 19', status: 'Active' },
  { id: '#PT-004', initials: 'BP', avatarBg: '#fbe1de', avatarColor: '#d9634f', name: 'Ben P. Villanueva', age: 62, gender: 'Male', condition: 'CKD Stage 3', phase: 'Monitoring', adherence: 95, nextAppt: 'May 29', status: 'Active' },
  { id: '#PT-005', initials: 'AC', avatarBg: '#ece0fb', avatarColor: '#8a5fd6', name: 'Ana C. Ferrer', age: 29, gender: 'Female', condition: 'Malnutrition', phase: 'Assessment', adherence: 45, nextAppt: 'May 17', status: 'Needs Review' },
  { id: '#PT-006', initials: 'RM', avatarBg: '#fde3cf', avatarColor: '#d9843f', name: 'Roberto M. Tan', age: 55, gender: 'Male', condition: 'Cardiovascular Disease', phase: 'Intervention', adherence: 81, nextAppt: 'May 25', status: 'Active' }
]

const conditions = [...new Set(allPatients.map(p => p.condition))]
const statuses = [...new Set(allPatients.map(p => p.status))]
const phases = [...new Set(allPatients.map(p => p.phase))]

const search = ref('')
const conditionFilter = ref('')
const statusFilter = ref('')
const phaseFilter = ref('')
const page = ref(1)
const perPage = 6

const filteredPatients = computed(() => {
  return allPatients.filter(p => {
    const matchesSearch = !search.value ||
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.id.toLowerCase().includes(search.value.toLowerCase())
    const matchesCondition = !conditionFilter.value || p.condition === conditionFilter.value
    const matchesStatus = !statusFilter.value || p.status === statusFilter.value
    const matchesPhase = !phaseFilter.value || p.phase === phaseFilter.value
    return matchesSearch && matchesCondition && matchesStatus && matchesPhase
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPatients.value.length / perPage)))

const paginatedPatients = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredPatients.value.slice(start, start + perPage)
})

function adherenceClass(value) {
  if (value >= 75) return 'fill-green'
  if (value >= 55) return 'fill-orange'
  return 'fill-red'
}
function adherenceTextClass(value) {
  if (value >= 75) return 'text-green'
  if (value >= 55) return 'text-orange'
  return 'text-red'
}
</script>

<style scoped>
.page-intro { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-subtitle { color: #6a7a6a; font-size: 0.95rem; margin: 0; }
.btn-add-patient {
  display: flex; align-items: center; gap: 6px;
  background: #163a1c; color: #fff; border: none;
  padding: 10px 18px; border-radius: 8px; font-weight: 600; font-size: 0.88rem; cursor: pointer;
}
.btn-add-patient:hover { background: #10300f; }

.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
.stat-card { background: #fff; border-radius: 12px; padding: 18px 20px; border: 1px solid #eceeec; }
.stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.stat-icon { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.stat-badge {
  background: #D4A017; color: #fff; font-size: 0.7rem; font-weight: 700;
  width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.stat-value { font-size: 1.6rem; font-weight: 700; color: #1a3a1a; }
.stat-label { font-size: 0.8rem; color: #8a9a8a; margin-top: 2px; }

.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
.filter-search {
  flex: 1; display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1px solid #e0e5e0; border-radius: 8px; padding: 10px 14px;
}
.filter-search input { border: none; outline: none; flex: 1; font-size: 0.88rem; }
.filter-search-icon { color: #9aaa9a; }
.filter-selects { display: flex; gap: 10px; }
.filter-selects select {
  border: 1px solid #e0e5e0; border-radius: 8px; padding: 10px 14px;
  font-size: 0.85rem; background: #fff; color: #3a4a3a; cursor: pointer;
}

.panel { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #eceeec; }
.patients-table { width: 100%; border-collapse: collapse; }
.patients-table th {
  text-align: left; font-size: 0.68rem; letter-spacing: 0.05em; color: #9aaa9a;
  padding-bottom: 12px; border-bottom: 1px solid #eceeec;
}
.patients-table td { padding: 14px 10px 14px 0; border-bottom: 1px solid #f2f4f2; font-size: 0.85rem; color: #3a4a3a; }

.patient-cell { display: flex; align-items: center; gap: 10px; }
.patient-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700;
}
.patient-name { font-weight: 600; color: #1a3a1a; }
.patient-id { font-size: 0.72rem; color: #9aaa9a; }

.phase-pill { font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
.phase-monitoring { background: #e3edfc; color: #3b6fd6; }
.phase-intervention { background: #ede4fc; color: #7a4fd6; }
.phase-diagnosis { background: #fdf1d6; color: #b8860b; }
.phase-assessment { background: #fbe1de; color: #c0483a; }

.adherence-cell { display: flex; align-items: center; gap: 8px; }
.adherence-bar { width: 80px; height: 6px; background: #eceeec; border-radius: 3px; overflow: hidden; }
.adherence-fill { height: 100%; border-radius: 3px; }
.fill-green { background: #2e9e52; }
.fill-orange { background: #d9982e; }
.fill-red { background: #d9483f; }
.text-green { color: #2e9e52; font-weight: 600; }
.text-orange { color: #d9982e; font-weight: 600; }
.text-red { color: #d9483f; font-weight: 600; }

.status-pill { font-size: 0.72rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
.status-pill.active { background: #e6f4e6; color: #2e7d32; }
.status-pill.follow-up { background: #fdf1d6; color: #b8860b; }
.status-pill.needs-review { background: #fbe1de; color: #c0483a; }

.btn-view {
  border: 1px solid #dde3dd; background: #fff; color: #1a3a1a;
  padding: 6px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
}
.btn-view:hover { background: #f4f6f4; }

.table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; }
.results-count { font-size: 0.82rem; color: #8a9a8a; }
.pagination { display: flex; gap: 10px; }
.btn-page {
  display: flex; align-items: center; gap: 4px;
  border: 1px solid #dde3dd; background: #fff; color: #3a4a3a;
  padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer;
}
.btn-page:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-page-primary { background: #163a1c; color: #fff; border-color: #163a1c; }
.btn-page-primary:hover:not(:disabled) { background: #10300f; }

@media (max-width: 1100px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .filter-bar { flex-direction: column; }
}
</style>