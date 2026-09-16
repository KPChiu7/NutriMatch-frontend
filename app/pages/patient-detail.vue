<template>
  <div class="patient-detail">
    <!-- BREADCRUMB -->
    <p class="breadcrumb">
      <NuxtLink to="/my-patients">My Patients</NuxtLink> / {{ patient?.name || 'Patient' }}
    </p>

    <!-- HEADER BANNER -->
    <section class="patient-banner">
      <div class="banner-left">
        <div class="banner-avatar" :style="{ background: patient?.avatarColor || '#D4A017' }">{{ patient?.initials }}</div>
        <div>
          <h1 class="banner-name">{{ patient?.name }}</h1>
          <p class="banner-meta">
            {{ patient?.age }} y/o {{ patient?.gender }} · {{ patient?.condition }} · Patient since {{ patient?.patientSince }}
          </p>
          <div class="banner-tags">
            <span class="tag tag-relationship">{{ patient?.status || 'Active Relationship' }}</span>
            <span v-if="patient?.allergies" class="tag tag-allergy">Allergy: {{ patient.allergies }}</span>
          </div>
        </div>
      </div>
      <button class="message-btn" @click="navigateTo(`/messages?patient=${patient?.name}`)">Message</button>
    </section>

    <!-- TABS -->
    <nav class="detail-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="detail-tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </nav>

    <!-- OVERVIEW TAB -->
    <section v-if="activeTab === 'Overview'" class="detail-grid">
      <div class="detail-col">
        <!-- NCP PHASE PROGRESS -->
        <div class="panel">
          <div class="panel-header-row">
            <h3 class="panel-title">Current NCP Record — Phase Progress</h3>
            <span class="status-pill pill-gold">{{ patient?.ncpStatus || 'Draft' }}</span>
          </div>
          <div class="phase-grid">
            <div class="phase-item" v-for="p in phases" :key="p.label">
              <div class="phase-icon" :class="{ 'phase-done': p.done }">
                <Check v-if="p.done" :size="16" />
                <span v-else>{{ p.number }}</span>
              </div>
              <p class="phase-label">{{ p.label }}</p>
              <button class="phase-action" @click="navigateTo(`/ncp-records?patient=${patient?.name}&phase=${p.label}`)">
                {{ p.done ? 'View' : 'Continue' }}
              </button>
            </div>
          </div>
        </div>

        <!-- LATEST VITALS -->
        <div class="panel">
          <h3 class="panel-title">Latest Vitals</h3>
          <div class="vitals-grid">
            <div class="vital-item" v-for="v in vitals" :key="v.label">
              <p class="vital-value">{{ v.value }}</p>
              <p class="vital-label">{{ v.label }}</p>
            </div>
          </div>
        </div>

        <!-- PES STATEMENT -->
        <div class="panel">
          <h3 class="panel-title">Current PES Statement</h3>
          <blockquote class="pes-quote">
            <p><strong>Problem:</strong> {{ pesStatement.problem }}</p>
            <p><strong>Etiology:</strong> {{ pesStatement.etiology }}</p>
            <p><strong>Signs:</strong> {{ pesStatement.signs }}</p>
          </blockquote>
        </div>
      </div>

      <div class="detail-col">
        <!-- HEALTH PROFILE -->
        <div class="panel">
          <h3 class="panel-title">Health Profile</h3>
          <div class="profile-row" v-for="row in healthProfile" :key="row.label">
            <span class="profile-label">{{ row.label }}</span>
            <span class="profile-value">{{ row.value }}</span>
          </div>
        </div>

        <!-- NEXT APPOINTMENT -->
        <div class="panel">
          <h3 class="panel-title">Next Appointment</h3>
          <p class="appt-date">{{ patient?.nextAppointment || '—' }}</p>
          <p class="appt-detail">{{ nextApptDetail }}</p>
          <button class="manage-appt-btn" @click="navigateTo(`/appointments?patient=${patient?.name}`)">Manage Appointment</button>
        </div>

        <!-- QUICK ACTIONS -->
        <div class="panel">
          <h3 class="panel-title">Quick Actions</h3>
          <div class="quick-actions">
            <button class="qa-btn qa-primary" @click="navigateTo(`/meal-planning?patient=${patient?.name}`)">Update Meal Plan</button>
            <button class="qa-btn" @click="navigateTo(`/ncp-records?patient=${patient?.name}`)">Continue NCP Record</button>
            <button class="qa-btn" @click="navigateTo(`/messages?patient=${patient?.name}`)">Send Message</button>
          </div>
        </div>
      </div>
    </section>

    <!-- OTHER TABS: placeholders -->
    <section v-else class="panel">
      <p class="empty-text">{{ activeTab }} content goes here.</p>
    </section>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'
import { db } from '~/mock/mockDatabase'

definePageMeta({ layout: 'dashboard', title: 'Patient Chart' })

const route = useRoute()
const patientName = computed(() => route.query.patient)

// Base patient record comes from the mock db
const basePatient = computed(() => db.patients.find(p => p.name === patientName.value))

// TODO: these fields aren't in the mock db yet — wire up once patient detail
// records (age, gender, allergies, vitals, PES statement, etc.) exist there.
const patient = computed(() => ({
  ...basePatient.value,
  age: basePatient.value?.age || 32,
  gender: basePatient.value?.gender || 'Male',
  patientSince: basePatient.value?.patientSince || 'Jan 2026',
  allergies: basePatient.value?.allergies || null
}))

const tabs = ['Overview', 'NCP Records', 'Meal Plan', 'Progress History', 'Appointments']
const activeTab = ref('Overview')

// TODO: replace with real phase progress from the patient's NCP record
const phases = ref([
  { number: 1, label: 'Assessment', done: true },
  { number: 2, label: 'Diagnosis', done: true },
  { number: 3, label: 'Intervention', done: false },
  { number: 4, label: 'Monitoring', done: false }
])

// TODO: replace with real vitals history
const vitals = ref([
  { label: 'Weight', value: '68.2 kg' },
  { label: 'BMI', value: '23.4' },
  { label: 'Blood Pressure', value: '118/76' },
  { label: 'Fasting Glucose', value: '112 mg/dL' }
])

// TODO: replace with real PES statement from the latest NCP record
const pesStatement = ref({
  problem: 'Inadequate carbohydrate intake management',
  etiology: 'related to poor dietary knowledge regarding diabetic exchange portions',
  signs: 'as evidenced by elevated fasting blood glucose (126 mg/dL) and inconsistent meal timing per food diary.'
})

// TODO: replace with real profile fields from the patient's record
const healthProfile = computed(() => [
  { label: 'Condition', value: patient.value?.condition || '—' },
  { label: 'Allergies', value: patient.value?.allergies || 'None reported' },
  { label: 'Dietary Restriction', value: patient.value?.dietaryRestriction || 'Low Sodium' },
  { label: 'Health Goal', value: patient.value?.healthGoal || 'Glucose Control' }
])

// TODO: replace with real appointment detail
const nextApptDetail = '2:00 PM · Video Consultation'
</script>

<style scoped>
* { box-sizing: border-box; }

.patient-detail { font-family: 'Inter', sans-serif; }

.breadcrumb { font-size: 0.82rem; color: #8a9a8a; margin: 0 0 16px; }
.breadcrumb a { color: #8a9a8a; text-decoration: none; }
.breadcrumb a:hover { text-decoration: underline; }

/* HEADER BANNER */
.patient-banner {
  background: linear-gradient(135deg, #00382a 0%, #005a42 100%);
  border-radius: 16px; padding: 28px 32px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px; color: #fff;
}
.banner-left { display: flex; align-items: center; gap: 18px; }
.banner-avatar {
  width: 64px; height: 64px; border-radius: 50%; color: #1a3a1a;
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.3rem; flex-shrink: 0;
}
.banner-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; margin: 0 0 4px; color: #fff; }
.banner-meta { font-size: 0.85rem; color: #cfe0d5; margin: 0 0 10px; }
.banner-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 14px; }
.tag-relationship { background: rgba(255,255,255,0.15); color: #cdeacd; }
.tag-allergy { background: rgba(0,0,0,0.25); color: #fff; }
.message-btn { background: #D4A017; color: #1a3a1a; border: none; border-radius: 8px; padding: 11px 22px; font-weight: 700; font-size: 0.85rem; cursor: pointer; flex-shrink: 0; }

/* TABS */
.detail-tabs { display: flex; gap: 4px; background: #fff; border: 1px solid #eceeec; border-radius: 30px; padding: 4px; margin-bottom: 20px; width: fit-content; }
.detail-tab { border: none; background: none; padding: 10px 18px; border-radius: 24px; font-size: 0.85rem; font-weight: 600; color: #6a7a6a; cursor: pointer; }
.detail-tab.active { background: #14301a; color: #fff; }

/* GRID */
.detail-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; align-items: start; }
.detail-col { display: flex; flex-direction: column; gap: 20px; }
.panel { background: #fff; border-radius: 14px; border: 1px solid #eceeec; padding: 22px; }
.panel-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #1a3a1a; margin: 0 0 16px; }
.panel-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.panel-header-row .panel-title { margin: 0; }

.status-pill { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; }
.pill-gold { background: #fdf1d6; color: #b8860b; }

/* PHASE PROGRESS */
.phase-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.phase-item { text-align: left; }
.phase-icon {
  width: 34px; height: 34px; border-radius: 50%; background: #eceeec; color: #6a7a6a;
  display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; margin-bottom: 10px;
}
.phase-icon.phase-done { background: #1f8f5c; color: #fff; }
.phase-label { font-weight: 700; color: #1a3a1a; font-size: 0.88rem; margin: 0 0 8px; }
.phase-action { border: none; background: none; color: #1f8f5c; font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 0; }

/* VITALS */
.vitals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.vital-item { text-align: left; }
.vital-value { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #1a3a1a; margin: 0; }
.vital-label { font-size: 0.75rem; color: #8a9a8a; margin: 4px 0 0; }

/* PES STATEMENT */
.pes-quote { background: #eef2fb; border-left: 3px solid #2a5a8a; border-radius: 8px; padding: 14px 18px; margin: 0; }
.pes-quote p { font-size: 0.85rem; color: #2a3a4a; margin: 0 0 8px; line-height: 1.5; }
.pes-quote p:last-child { margin-bottom: 0; }
.pes-quote strong { color: #1a2a3a; }

/* HEALTH PROFILE */
.profile-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f2f4f2; }
.profile-row:last-child { border-bottom: none; }
.profile-label { font-size: 0.82rem; color: #8a9a8a; }
.profile-value { font-size: 0.85rem; font-weight: 700; color: #1a3a1a; }

/* NEXT APPOINTMENT */
.appt-date { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #1a3a1a; margin: 0 0 4px; }
.appt-detail { font-size: 0.82rem; color: #6a7a6a; margin: 0 0 16px; }
.manage-appt-btn { width: 100%; background: #fff; border: 1px solid #1a3a1a; color: #1a3a1a; border-radius: 8px; padding: 11px; font-weight: 700; font-size: 0.85rem; cursor: pointer; }

/* QUICK ACTIONS */
.quick-actions { display: flex; flex-direction: column; gap: 10px; }
.qa-btn { border: 1px solid #d5dad5; background: #fff; color: #2a2a2a; border-radius: 8px; padding: 12px; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
.qa-primary { background: #D4A017; color: #1a3a1a; border: none; }

.empty-text { font-size: 0.85rem; color: #9aaa9a; padding: 20px; text-align: center; }

@media (max-width: 1024px) {
  .detail-grid { grid-template-columns: 1fr; }
  .phase-grid, .vitals-grid { grid-template-columns: repeat(2, 1fr); }
  .patient-banner { flex-direction: column; align-items: flex-start; gap: 16px; }
}
</style>