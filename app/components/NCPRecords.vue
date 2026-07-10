<template>
  <div>
    <!-- FILTER BAR -->
    <div class="filter-bar">
      <div class="filter-search">
        <Search :size="15" class="filter-search-icon" />
        <input v-model="search" type="text" placeholder="Search by name or ID....." />
      </div>
      <div class="filter-selects">
        <select v-model="statusFilter">
          <option value="">All Status</option>
          <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="phaseFilter">
          <option value="">All NCP Phases</option>
          <option v-for="p in phaseNames" :key="p" :value="p">{{ p }}</option>
        </select>
      </div>
      <button class="btn-new-record" @click="openWizard()"><Plus :size="16" /> New NCP Record</button>
    </div>

    <!-- ACTIVE RECORD DETAIL -->
    <div class="panel active-record-panel" v-if="activeRecord">
      <div class="active-record-header">
        <div class="active-record-title">
          <h3>{{ activeRecord.patientName }}</h3>
          <span class="badge badge-green">Active Record</span>
          <span class="badge badge-outline" v-for="tag in activeRecord.tags" :key="tag">{{ tag }}</span>
        </div>
        <div class="active-record-meta">Record ID: {{ activeRecord.recordId }} · Updated {{ activeRecord.updated }}</div>
      </div>

      <div class="phase-timeline">
        <div class="phase-card" v-for="phase in activeRecord.phases" :key="phase.step" :class="'phase-status-' + phase.statusKey">
          <div class="phase-marker">{{ phase.step }}</div>
          <div class="phase-body">
            <div class="phase-title">{{ phase.title }}</div>
            <p class="phase-desc">{{ phase.desc }}</p>
          </div>
          <span class="status-pill" :class="'status-' + phase.statusKey">
            <component :is="phase.statusIcon" :size="11" /> {{ phase.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- NCP HISTORY -->
    <div class="history-header">
      <h3>NCP History</h3>
    </div>
    <div class="panel table-panel">
      <table class="history-table">
        <thead>
          <tr>
            <th>PATIENT</th>
            <th>PHASE</th>
            <th>DIETITIAN</th>
            <th>DATE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredHistory" :key="row.id" @click="viewRecord(row)">
            <td>
              <div class="patient-cell">
                <span class="patient-avatar" :style="{ background: row.avatarBg, color: row.avatarColor }">{{ row.initials }}</span>
                <div>
                  <div class="patient-name">{{ row.name }}</div>
                  <div class="patient-id">{{ row.id }}</div>
                </div>
              </div>
            </td>
            <td>{{ row.phase }}</td>
            <td>{{ row.dietitian }}</td>
            <td>{{ row.date }}</td>
            <td><span class="status-pill" :class="'status-' + row.statusKey"><component :is="row.statusIcon" :size="11" /> {{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= NEW NCP RECORD MODAL ================= -->
    <div v-if="wizardOpen" class="modal-overlay" @click.self="closeWizard">
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <h2>Nutrition Care Process</h2>
            <p class="modal-subtitle">Complete all 4 NCP phases</p>
          </div>
          <span class="patient-pill">
            <span class="patient-avatar small">{{ wizardPatientInitials }}</span>
            {{ wizardForm.patientName || 'Select Patient' }}
          </span>
        </div>

        <div class="wizard-tabs">
          <button
            v-for="(label, idx) in wizardSteps"
            :key="label"
            class="wizard-tab"
            :class="{ active: wizardStep === idx + 1, done: wizardStep > idx + 1 }"
            :disabled="idx + 1 > wizardStep"
            @click="idx + 1 < wizardStep && (wizardStep = idx + 1)"
          >
            {{ idx + 1 }}. {{ label }}
          </button>
        </div>

        <div class="wizard-body">
          <!-- STEP 1: ASSESSMENT -->
          <div v-if="wizardStep === 1">
            <p class="phase-eyebrow">PHASE 1 — NUTRITIONAL ASSESSMENT</p>

            <div class="form-grid-3">
              <div class="field">
                <label>Height (cm)</label>
                <input v-model.number="assessment.height" type="number" />
              </div>
              <div class="field">
                <label>Weight (kg)</label>
                <input v-model.number="assessment.weight" type="number" />
              </div>
              <div class="field">
                <label>Age</label>
                <input v-model.number="assessment.age" type="number" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="field">
                <label>Blood Pressure</label>
                <input v-model="assessment.bp" type="text" placeholder="e.g., 120/80 mmHg" />
              </div>
              <div class="field">
                <label>Blood Glucose (mg/dL)</label>
                <input v-model.number="assessment.glucose" type="number" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="field">
                <label>HbA1c (%)</label>
                <input v-model.number="assessment.hba1c" type="number" step="0.1" />
              </div>
              <div class="field">
                <label>eGFR (mL/min)</label>
                <input v-model.number="assessment.egfr" type="number" />
              </div>
            </div>

            <div class="field">
              <label>Assessment Notes</label>
              <textarea v-model="assessment.notes" rows="3" placeholder="Clinical observations..."></textarea>
            </div>

            <div class="computed-box">
              <p class="computed-title">AUTO-COMPUTED RESULTS · MIFFLIN-ST JEOR · WHO ASIA-PACIFIC</p>
              <div class="computed-grid">
                <div class="computed-cell">
                  <span class="computed-value">{{ computedResults.bmi }}</span>
                  <span class="computed-label">BMI</span>
                  <span class="computed-tag" :class="'tag-' + computedResults.bmiTagColor">{{ computedResults.bmiTag }}</span>
                </div>
                <div class="computed-cell">
                  <span class="computed-value">{{ computedResults.bmr }}</span>
                  <span class="computed-label">BMR</span>
                  <span class="computed-tag tag-neutral">kcal/day</span>
                </div>
                <div class="computed-cell">
                  <span class="computed-value">{{ computedResults.tdee }}</span>
                  <span class="computed-label">TDEE</span>
                  <span class="computed-tag tag-neutral">kcal/day</span>
                </div>
                <div class="computed-cell">
                  <span class="computed-value">{{ computedResults.nrs }}</span>
                  <span class="computed-label">NRS-2002</span>
                  <span class="computed-tag" :class="'tag-' + computedResults.nrsTagColor">{{ computedResults.nrsTag }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 2: DIAGNOSIS -->
          <div v-else-if="wizardStep === 2">
            <p class="phase-eyebrow">PHASE 2 — NUTRITION DIAGNOSIS (PES STATEMENT)</p>

            <div class="field">
              <label>Problem (P)</label>
              <input v-model="diagnosis.problem" type="text" placeholder="e.g., Excessive carbohydrate intake" />
            </div>
            <div class="field">
              <label>Etiology / Related to (E)</label>
              <textarea v-model="diagnosis.etiology" rows="2" placeholder="e.g. High intake of refined carbohydrates..."></textarea>
            </div>
            <div class="field">
              <label>Signs &amp; Symptoms (S)</label>
              <textarea v-model="diagnosis.signs" rows="2" placeholder="e.g as evidenced by..."></textarea>
            </div>

            <div class="pes-box">
              <p class="computed-title">AUTO-GENERATED PES STATEMENT</p>
              <p class="pes-text">{{ pesStatement }}</p>
            </div>
          </div>

          <!-- STEP 3: INTERVENTION -->
          <div v-else-if="wizardStep === 3">
            <p class="phase-eyebrow">PHASE 3 — NUTRITION INTERVENTION</p>

            <div class="form-grid-2">
              <div class="field">
                <label>Target kcal/day</label>
                <input v-model.number="intervention.kcal" type="number" />
              </div>
              <div class="field">
                <label>Condition</label>
                <input v-model="intervention.condition" type="text" placeholder="e.g., Diabetes Mellitus" />
              </div>
            </div>
            <div class="form-grid-2">
              <div class="field">
                <label>Target Protein (g)</label>
                <input v-model.number="intervention.protein" type="number" />
              </div>
              <div class="field">
                <label>Target Carbs (g)</label>
                <input v-model.number="intervention.carbs" type="number" />
              </div>
            </div>
            <div class="field">
              <label>Diet Prescription Notes</label>
              <textarea v-model="intervention.notes" rows="3" placeholder="e.g. Low-GI, high-fiber Filipino diet. Reduce rice to ½ cup per meal. Include ampalaya, sayote, kangkong daily......"></textarea>
            </div>
          </div>

          <!-- STEP 4: MONITORING -->
          <div v-else-if="wizardStep === 4">
            <p class="phase-eyebrow">PHASE 4 — MONITORING &amp; EVALUATION</p>

            <div class="field">
              <label>Goal Status</label>
              <select v-model="monitoring.goalStatus">
                <option>In Progress</option>
                <option>On Track</option>
                <option>Needs Adjustment</option>
                <option>Achieved</option>
              </select>
            </div>
            <div class="field">
              <label>Next Follow-up Date</label>
              <input v-model="monitoring.followUpDate" type="date" />
            </div>
            <div class="field">
              <label>Monitoring Notes</label>
              <textarea v-model="monitoring.notes" rows="3" placeholder="Observations on patient progress, clinical response, next steps......."></textarea>
            </div>
          </div>
        </div>

        <div class="wizard-footer">
          <button v-if="wizardStep > 1" class="btn-secondary" @click="wizardStep--">Back</button>
          <button v-if="wizardStep < 4" class="btn-primary-wide" @click="wizardStep++">
            Save and Continue to {{ wizardSteps[wizardStep] }}
          </button>
          <button v-else class="btn-primary-wide" @click="submitRecord">Submit NCP Record</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search, Plus, CheckCircle2, Clock3, CircleDashed } from 'lucide-vue-next'

// ============ FILTER / LIST STATE ============
const search = ref('')
const statusFilter = ref('')
const phaseFilter = ref('')

const statuses = ['Completed', 'Pending Review', 'In Progress']
const phaseNames = ['Assessment', 'Diagnosis', 'Intervention', 'Monitoring']

const activeRecord = reactive({
  patientName: 'Julia Niel Bulalaque',
  recordId: 'NCP-2026-0042',
  updated: 'Apr 25, 2026',
  tags: ['T2DM', 'MNT'],
  phases: [
    {
      step: 1, title: 'Nutrition Assessment',
      desc: 'Anthropometric: Ht 157cm, Wt 72kg, BMI 29.2 (Overweight). Biochemical: FBS 9.2 mmol/L, HbA1c 8.1%, LDL 3.4 mmol/L. Dietary: 24-hr recall shows excess refined CHO intake (~65%), inadequate fiber (<15g/day). Clinical: T2DM diagnosed 2022, on Metformin 500mg BID.',
      status: 'Complete', statusKey: 'green', statusIcon: CheckCircle2
    },
    {
      step: 2, title: 'Nutrition Diagnosis',
      desc: 'PES Statement: Excessive carbohydrate intake (P) related to inadequate knowledge of glycemic index foods and Filipino dietary patterns (E) as evidenced by FBS 9.2 mmol/L and 24-hr recall showing 65% CHO distribution above target 50–55% (S).',
      status: 'Complete', statusKey: 'green', statusIcon: CheckCircle2
    },
    {
      step: 3, title: 'Nutrition Intervention',
      desc: 'Goal: Reduce FBS to ≤7.0 mmol/L in 3 months. MNT Plan: 1,800 kcal/day, CHO 50%, Protein 20%, Fat 30%. FNRI Food Exchange Lists applied. Structured meal timing at 3-3-3 intervals. Dietary counseling bi-weekly.',
      status: 'In Progress', statusKey: 'gold', statusIcon: Clock3
    },
    {
      step: 4, title: 'Nutrition Monitoring & Evaluation',
      desc: 'Scheduled: May 10, 2026 — Repeat FBS, HbA1c, dietary recall, weight monitoring, and patient-reported outcomes.',
      status: 'Pending', statusKey: 'grey', statusIcon: CircleDashed
    }
  ]
})

const historyRows = [
  { id: 1, initials: 'IA', avatarBg: '#fdeccb', avatarColor: '#b8860b', name: 'Ivy Hope Alba', patientId: '#PT-001', phase: 'Monitoring', dietitian: 'Merian Felizarta, RND', date: 'May 13', status: 'Completed', statusKey: 'green', statusIcon: CheckCircle2 },
  { id: 2, initials: 'JB', avatarBg: '#d9f2e3', avatarColor: '#2e9e52', name: 'Julia Niel Bulalaque', patientId: '#PT-002', phase: 'Intervention', dietitian: 'Nika Espantaleon, RND', date: 'May 12', status: 'Pending Review', statusKey: 'gold', statusIcon: Clock3 },
  { id: 3, initials: 'KL', avatarBg: '#dbe7fb', avatarColor: '#3b6fd6', name: 'Kent Leabres', patientId: '#PT-003', phase: 'Monitoring', dietitian: 'Nika Espantaleon, RND', date: 'May 12', status: 'Completed', statusKey: 'green', statusIcon: CheckCircle2 },
  { id: 4, initials: 'KP', avatarBg: '#ece0fb', avatarColor: '#8a5fd6', name: 'King Piolo Chui', patientId: '#PT-04', phase: 'Diagnosis', dietitian: 'Nika Espantaleon, RND', date: 'May 12', status: 'Pending Review', statusKey: 'gold', statusIcon: Clock3 }
]

const filteredHistory = computed(() => {
  return historyRows.filter(r => {
    const matchesSearch = !search.value ||
      r.name.toLowerCase().includes(search.value.toLowerCase()) ||
      r.patientId.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = !statusFilter.value || r.status === statusFilter.value
    const matchesPhase = !phaseFilter.value || r.phase === phaseFilter.value
    return matchesSearch && matchesStatus && matchesPhase
  })
})

function viewRecord(row) {
  // TODO: load this patient's record into activeRecord / navigate to detail view
  console.log('View record for', row.name)
}

// ============ WIZARD STATE ============
const wizardOpen = ref(false)
const wizardStep = ref(1)
const wizardSteps = ['Assessment', 'Diagnosis', 'Intervention', 'Monitoring']

const wizardForm = reactive({
  patientName: 'Kent Leabres'
})
const wizardPatientInitials = computed(() => {
  return wizardForm.patientName
    ? wizardForm.patientName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'
})

const assessment = reactive({
  height: null, weight: null, age: null,
  bp: '', glucose: null, hba1c: null, egfr: null,
  notes: ''
})

const diagnosis = reactive({ problem: '', etiology: '', signs: '' })
const intervention = reactive({ kcal: null, condition: '', protein: null, carbs: null, notes: '' })
const monitoring = reactive({ goalStatus: 'In Progress', followUpDate: '', notes: '' })

// --- Auto-computed clinical values ---
const computedResults = computed(() => {
  const h = assessment.height
  const w = assessment.weight
  const age = assessment.age

  if (!h || !w) {
    return { bmi: '—', bmr: '—', tdee: '—', nrs: '—', bmiTag: '', bmiTagColor: 'neutral', nrsTag: '', nrsTagColor: 'neutral' }
  }

  const heightM = h / 100
  const bmi = +(w / (heightM * heightM)).toFixed(1)

  let bmiTag = 'Normal', bmiTagColor = 'green'
  if (bmi < 18.5) { bmiTag = 'Underweight'; bmiTagColor = 'blue' }
  else if (bmi >= 23 && bmi < 27.5) { bmiTag = 'Overweight'; bmiTagColor = 'gold' }
  else if (bmi >= 27.5) { bmiTag = 'Obese'; bmiTagColor = 'red' }

  // Mifflin-St Jeor (assumes adult; using a neutral constant since gender isn't captured yet)
  const bmr = age ? Math.round(10 * w + 6.25 * h - 5 * age - 78) : Math.round(10 * w + 6.25 * h - 78)
  const tdee = Math.round(bmr * 1.4) // light activity factor default

  // Simplified NRS-2002 style scoring based on BMI + glucose as a rough proxy
  let nrs = 1
  if (bmi < 20.5) nrs += 1
  if (assessment.glucose && assessment.glucose > 126) nrs += 1
  if (assessment.hba1c && assessment.hba1c > 7) nrs += 1
  nrs = Math.min(nrs, 3)

  let nrsTag = 'Low Risk', nrsTagColor = 'green'
  if (nrs === 2) { nrsTag = 'Moderate'; nrsTagColor = 'gold' }
  if (nrs >= 3) { nrsTag = 'High Risk'; nrsTagColor = 'red' }

  return { bmi, bmr, tdee, nrs, bmiTag, bmiTagColor, nrsTag, nrsTagColor }
})

const pesStatement = computed(() => {
  if (!diagnosis.problem) return 'Fill in Problem, Etiology, and Signs & Symptoms above to generate the PES statement.'
  let text = diagnosis.problem
  if (diagnosis.etiology) text += ` related to ${diagnosis.etiology.replace(/\.$/, '').toLowerCase()}`
  if (diagnosis.signs) text += ` as evidenced by ${diagnosis.signs.replace(/^as evidenced by\s*/i, '').replace(/\.$/, '').toLowerCase()}`
  return text.endsWith('.') ? text : text + '.'
})

function openWizard(patientName) {
  if (patientName) wizardForm.patientName = patientName
  wizardStep.value = 1
  wizardOpen.value = true
}
function closeWizard() {
  wizardOpen.value = false
}
function submitRecord() {
  // TODO: send assessment / diagnosis / intervention / monitoring to backend
  console.log('Submitting NCP record:', {
    patient: wizardForm.patientName,
    assessment, diagnosis, intervention, monitoring,
    computed: computedResults.value,
    pesStatement: pesStatement.value
  })
  wizardOpen.value = false
}
</script>

<style scoped>
.filter-bar { display: flex; gap: 12px; margin-bottom: 20px; }
.filter-search { flex: 1; display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e0e5e0; border-radius: 8px; padding: 10px 14px; }
.filter-search input { border: none; outline: none; flex: 1; font-size: 0.88rem; }
.filter-search-icon { color: #9aaa9a; }
.filter-selects { display: flex; gap: 10px; }
.filter-selects select { border: 1px solid #e0e5e0; border-radius: 8px; padding: 10px 14px; font-size: 0.85rem; background: #fff; color: #3a4a3a; cursor: pointer; }

.btn-new-record {
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
  background: #163a1c; color: #fff; border: none; padding: 10px 18px;
  border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;
}
.btn-new-record:hover { background: #10300f; }

.panel { background: #fff; border-radius: 12px; padding: 22px; border: 1px solid #eceeec; margin-bottom: 20px; }

/* ACTIVE RECORD */
.active-record-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.active-record-title { display: flex; align-items: center; gap: 10px; }
.active-record-title h3 { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #1a3a1a; margin: 0; }
.badge { font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.badge-green { background: #e6f4e6; color: #2e7d32; }
.badge-outline { background: #f4f6f4; color: #4a5a4a; }
.active-record-meta { font-size: 0.75rem; color: #9aaa9a; white-space: nowrap; }

.phase-timeline { display: flex; flex-direction: column; gap: 12px; }
.phase-card {
  display: flex; align-items: flex-start; gap: 14px;
  border: 1px solid #eceeec; border-left: 3px solid #ccc; border-radius: 10px; padding: 16px 18px;
}
.phase-status-green { border-left-color: #2e9e52; }
.phase-status-gold { border-left-color: #D4A017; }
.phase-status-grey { border-left-color: #cdd3cd; opacity: 0.75; }

.phase-marker {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  background: #eef2ee; color: #4a5a4a; font-size: 0.8rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.phase-body { flex: 1; }
.phase-title { font-size: 0.92rem; font-weight: 700; color: #1a3a1a; margin-bottom: 4px; }
.phase-desc { font-size: 0.8rem; color: #6a7a6a; line-height: 1.5; margin: 0; }

.status-pill {
  display: flex; align-items: center; gap: 4px; flex-shrink: 0; white-space: nowrap;
  font-size: 0.7rem; font-weight: 700; padding: 4px 11px; border-radius: 20px;
}
.status-green { background: #e6f4e6; color: #2e7d32; }
.status-gold { background: #fdf1d6; color: #b8860b; }
.status-grey { background: #eef0ee; color: #8a9a8a; }

/* HISTORY */
.history-header { margin-bottom: 12px; }
.history-header h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #1a3a1a; margin: 0; }

.table-panel { padding: 20px 22px; }
.history-table { width: 100%; border-collapse: collapse; }
.history-table th { text-align: left; font-size: 0.68rem; letter-spacing: 0.05em; color: #9aaa9a; padding-bottom: 12px; border-bottom: 1px solid #eceeec; }
.history-table td { padding: 14px 10px 14px 0; border-bottom: 1px solid #f2f4f2; font-size: 0.85rem; color: #3a4a3a; }
.history-table tbody tr { cursor: pointer; }
.history-table tbody tr:hover { background: #fafbfa; }

.patient-cell { display: flex; align-items: center; gap: 10px; }
.patient-avatar {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700;
}
.patient-avatar.small { width: 22px; height: 22px; font-size: 0.62rem; background: rgba(255,255,255,0.2); color: #fff; }
.patient-name { font-weight: 600; color: #1a3a1a; }
.patient-id { font-size: 0.72rem; color: #9aaa9a; }

/* ============ MODAL ============ */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(20,30,20,0.5);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
}
.modal-card {
  background: #fff; border-radius: 16px; width: 100%; max-width: 620px;
  max-height: 90vh; overflow-y: auto; padding: 28px 32px;
}
.modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.modal-header h2 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #1a3a1a; margin: 0; }
.modal-subtitle { font-size: 0.82rem; color: #9aaa9a; margin: 2px 0 0; }

.patient-pill {
  display: flex; align-items: center; gap: 8px;
  background: #163a1c; color: #fff; font-size: 0.8rem; font-weight: 600;
  padding: 6px 14px 6px 6px; border-radius: 20px; white-space: nowrap;
}

.wizard-tabs { display: flex; gap: 4px; border-bottom: 1px solid #eceeec; margin-bottom: 22px; }
.wizard-tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  padding: 10px 6px; margin-right: 18px; font-size: 0.85rem; font-weight: 600; color: #9aaa9a; cursor: pointer;
}
.wizard-tab.active { color: #163a1c; border-bottom-color: #163a1c; }
.wizard-tab.done { color: #2e9e52; }
.wizard-tab:disabled { cursor: not-allowed; }

.phase-eyebrow { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; color: #1a6a2a; margin-bottom: 16px; }

.form-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 4px; }
.form-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 4px; }

.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.field label { font-size: 0.75rem; font-weight: 600; color: #4a5a4a; }
.field input, .field select, .field textarea {
  border: 1px solid #dde3dd; border-radius: 8px; padding: 10px 12px;
  font-size: 0.88rem; font-family: inherit; color: #1a3a1a; background: #fafbfa;
}
.field textarea { resize: vertical; }

.computed-box { background: #f3f8f3; border-radius: 10px; padding: 18px; margin-top: 8px; }
.computed-title { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; color: #4a8a4a; margin: 0 0 14px; }
.computed-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.computed-cell { display: flex; flex-direction: column; align-items: center; text-align: center; }
.computed-value { font-size: 1.3rem; font-weight: 700; color: #1a3a1a; }
.computed-label { font-size: 0.68rem; color: #8a9a8a; margin: 2px 0 6px; }
.computed-tag { font-size: 0.68rem; font-weight: 700; padding: 2px 9px; border-radius: 10px; }
.tag-green { background: #e6f4e6; color: #2e7d32; }
.tag-gold { background: #fdf1d6; color: #b8860b; }
.tag-red { background: #fbe1de; color: #c0483a; }
.tag-blue { background: #e3edfc; color: #3b6fd6; }
.tag-neutral { background: #eef0ee; color: #6a7a6a; }

.pes-box { background: #fffbf0; border: 1px solid #f0e0b0; border-radius: 10px; padding: 16px; margin-top: 8px; }
.pes-text { font-size: 0.88rem; color: #8a6a1a; font-style: italic; margin: 6px 0 0; line-height: 1.5; }

.wizard-footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #eceeec; }
.btn-secondary {
  border: 1px solid #dde3dd; background: #fff; color: #3a4a3a;
  padding: 12px 22px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;
}
.btn-primary-wide {
  flex: 1; background: #163a1c; color: #fff; border: none;
  padding: 12px 22px; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;
}
.btn-primary-wide:hover { background: #10300f; }

@media (max-width: 900px) {
  .form-grid-3, .form-grid-2, .computed-grid { grid-template-columns: 1fr 1fr; }
  .filter-bar { flex-direction: column; }
}
</style>