<template>
  <div class="register-page">
    <!-- LEFT PANEL -->
    <aside class="left-panel">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>

      <div class="brand">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">Nutri<span class="logo-match">Match</span></span>
      </div>

      <div class="left-content">
        <span class="eyebrow">CREATE ACCOUNT</span>
        <h1>
          Join your<br />
          <em class="highlight">nutrition</em><br />
          journey today.
        </h1>

        <div class="steps">
          <div
            v-for="(step, index) in steps"
            :key="step.label"
            class="step"
            :class="{ active: currentStep === index + 1, done: currentStep > index + 1 }"
          >
            <span class="step-number">
              <span v-if="currentStep > index + 1">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </span>
            <div class="step-text">
              <span class="step-label">STEP {{ String(index + 1).padStart(2, '0') }}</span>
              <span class="step-title">{{ step.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- RIGHT PANEL -->
    <main class="right-panel">
      <button class="back-link" @click="navigateTo('/')">
        ← Back to home
      </button>

      <div class="form-wrap">
        <!-- STEP 1: CHOOSE ROLE -->
        <div v-if="currentStep === 1">
          <h2>Choose Your Role</h2>
          <p class="subtitle">Step 1 of 3 — Tell us how you'll use NutriMatch</p>

          <div class="role-grid">
            <button
              v-for="role in roles"
              :key="role.value"
              class="role-card"
              :class="{ selected: selectedRole === role.value }"
              @click="selectedRole = role.value"
            >
              <span class="role-icon">{{ role.icon }}</span>
              <span class="role-name">{{ role.label }}</span>
              <span class="role-desc">{{ role.desc }}</span>
            </button>
          </div>

          <button class="btn-primary" :disabled="!selectedRole" @click="currentStep = 2">
            Continue →
          </button>
        </div>

        <!-- STEP 2: YOUR DETAILS -->
        <div v-else-if="currentStep === 2">
          <h2>Your Details</h2>
          <p class="subtitle">Step 2 of 3 — Enter your personal information</p>

          <form class="details-form" @submit.prevent="currentStep = 3">
            <div class="field-row">
              <div class="field">
                <label>First Name</label>
                <input v-model="form.firstName" type="text" placeholder="Julia Niel" required />
              </div>
              <div class="field">
                <label>Last Name</label>
                <input v-model="form.lastName" type="text" placeholder="Bulalaque" required />
              </div>
            </div>

            <div class="field">
              <label>Email Address</label>
              <div class="input-icon-wrap">
                <span class="input-icon">👤</span>
                <input v-model="form.email" type="email" placeholder="bulalaque@email.com" required />
              </div>
            </div>

            <div class="field">
              <label>Password</label>
              <div class="input-icon-wrap">
                <span class="input-icon">🔒</span>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Min. 8 characters"
                  minlength="8"
                  required
                />
                <button type="button" class="toggle-visibility" @click="showPassword = !showPassword">
                  {{ showPassword ? 'HIDE' : 'SHOW' }}
                </button>
              </div>
            </div>

            <div class="field">
              <label>Confirm Password</label>
              <div class="input-icon-wrap">
                <span class="input-icon">🔒</span>
                <input
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Repeat your password"
                  required
                />
                <button type="button" class="toggle-visibility" @click="showConfirmPassword = !showConfirmPassword">
                  {{ showConfirmPassword ? 'HIDE' : 'SHOW' }}
                </button>
              </div>
            </div>

            <div class="field-row">
              <div class="field">
                <label>Date of Birth</label>
                <input v-model="form.dob" type="date" required />
              </div>
              <div class="field">
                <label>Gender</label>
                <select v-model="form.gender" required>
                  <option disabled value="">Select</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label>Primary Health Concern</label>
              <select v-model="form.healthConcern" required>
                <option disabled value="">Select</option>
                <option>Hypertension</option>
                <option>Type 2 Diabetes</option>
                <option>Obesity Management</option>
                <option>Renal Nutrition</option>
                <option>Other</option>
              </select>
            </div>

            <div class="form-nav">
              <button type="button" class="btn-back" @click="currentStep = 1">← Back</button>
              <button type="submit" class="btn-primary">Continue →</button>
            </div>
          </form>
        </div>

        <!-- STEP 3: CONFIRM -->
        <div v-else-if="currentStep === 3">
          <h2>Confirm Your Details</h2>
          <p class="subtitle">Step 3 of 3 — Review before submitting</p>

          <div class="confirm-summary">
            <div class="confirm-row"><span>Role</span><strong>{{ selectedRole }}</strong></div>
            <div class="confirm-row"><span>Name</span><strong>{{ form.firstName }} {{ form.lastName }}</strong></div>
            <div class="confirm-row"><span>Email</span><strong>{{ form.email }}</strong></div>
            <div class="confirm-row"><span>Date of Birth</span><strong>{{ form.dob }}</strong></div>
            <div class="confirm-row"><span>Gender</span><strong>{{ form.gender }}</strong></div>
            <div class="confirm-row"><span>Primary Health Concern</span><strong>{{ form.healthConcern }}</strong></div>
          </div>

          <div class="form-nav">
            <button type="button" class="btn-back" @click="currentStep = 2">← Back</button>
            <button class="btn-primary" @click="submitRegistration">Create Account →</button>
          </div>
        </div>

        <p class="signin-link">
          Already have an account? <a href="#" @click.prevent="navigateTo('/login')">Sign in →</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
const currentStep = ref(1)
const selectedRole = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  dob: '',
  gender: '',
  healthConcern: ''
})

const steps = [
  { label: 'Choose Role' },
  { label: 'Your Details' },
  { label: 'Confirm' }
]

const roles = [
  { value: 'patient', icon: '👤', label: 'Patient', desc: 'Find an RND' },
  { value: 'rnd', icon: '🩺', label: 'RND', desc: 'Offer care' },
  { value: 'admin', icon: '🛡️', label: 'Admin', desc: 'Manage' }
]

function submitRegistration() {
  // TODO: connect to your backend/API here
  console.log('Registering:', { role: selectedRole.value, ...form })
  navigateTo('/dashboard') // or wherever makes sense post-registration
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap');

.register-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* LEFT PANEL */
.left-panel {
  background: #1a3a1a;
  position: relative;
  overflow: hidden;
  padding: 48px 64px;
  color: #fff;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
}
.circle-1 { width: 400px; height: 400px; top: -150px; right: -100px; }
.circle-2 { width: 350px; height: 350px; bottom: 100px; right: -150px; }
.circle-3 { width: 450px; height: 450px; bottom: -250px; left: -150px; }

.brand { display: flex; align-items: center; gap: 8px; font-size: 1.2rem; font-weight: 700; position: relative; z-index: 1; }
.logo-match { color: #D4A017; }

.left-content { margin-top: 120px; position: relative; z-index: 1; }

.eyebrow { font-size: 0.75rem; letter-spacing: 0.1em; color: #a8c4a8; }

.left-content h1 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.2;
  margin: 16px 0 56px;
}
.highlight { color: #D4A017; font-style: italic; }

.steps { display: flex; flex-direction: column; }

.step {
  display: flex;
  gap: 16px;
  padding-bottom: 32px;
  position: relative;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 15px;
  top: 32px;
  width: 1px;
  height: calc(100% - 32px);
  background: rgba(255,255,255,0.2);
}

.step-number {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.1);
  color: #a8c4a8;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
}
.step.active .step-number { background: #fff; color: #1a3a1a; }
.step.done .step-number { background: #D4A017; color: #1a3a1a; }

.step-text { display: flex; flex-direction: column; }
.step-label { font-size: 0.7rem; letter-spacing: 0.08em; color: #7aaa7a; }
.step-title { font-weight: 600; color: #d8e8d8; }
.step.active .step-title { color: #fff; }
.step.done .step-title { color: #D4A017; }

/* RIGHT PANEL */
.right-panel {
  background: #fff;
  padding: 48px 80px;
  display: flex;
  flex-direction: column;
}

.back-link {
  background: none; border: none; cursor: pointer;
  color: #6a8a6a; font-size: 0.9rem; align-self: flex-start;
}

.form-wrap { max-width: 480px; margin: 40px auto 0; width: 100%; }

.form-wrap h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #1a3a1a;
  margin-bottom: 8px;
}

.subtitle { color: #8a9a8a; font-size: 0.9rem; margin-bottom: 32px; }

/* ROLE CARDS */
.role-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }

.role-card {
  border: 1px solid #e0e5e0;
  border-radius: 10px;
  padding: 28px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.15s;
}
.role-card:hover { border-color: #1a3a1a; }
.role-card.selected { border-color: #D4A017; background: #fffbf0; box-shadow: 0 0 0 1px #D4A017; }

.role-icon { font-size: 1.5rem; margin-bottom: 4px; }
.role-name { font-weight: 700; color: #1a3a1a; }
.role-desc { font-size: 0.78rem; color: #8a9a8a; }

/* FORM FIELDS */
.details-form { display: flex; flex-direction: column; gap: 18px; margin-bottom: 12px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #1a3a1a;
  text-transform: uppercase;
}
.field input,
.field select {
  padding: 12px 14px;
  border: 1px solid #dde3dd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fff;
  color: #1a3a1a;
}
.field input:focus,
.field select:focus { outline: none; border-color: #1a3a1a; }

.input-icon-wrap { position: relative; display: flex; align-items: center; }
.input-icon-wrap input { flex: 1; padding-left: 38px; padding-right: 60px; }
.input-icon {
  position: absolute; left: 12px;
  font-size: 0.9rem; color: #9aa8a0;
  pointer-events: none;
}
.toggle-visibility {
  position: absolute; right: 12px;
  background: none; border: none; cursor: pointer;
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.05em;
  color: #6a8a6a;
}

/* CONFIRM STEP */
.confirm-summary {
  border: 1px solid #e0e5e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.confirm-row { display: flex; justify-content: space-between; gap: 16px; font-size: 0.9rem; }
.confirm-row span { color: #8a9a8a; flex-shrink: 0; }
.confirm-row strong { color: #1a3a1a; text-transform: capitalize; text-align: right; }

/* BUTTONS */
.form-nav { display: flex; gap: 12px; margin-top: 4px; }

.btn-primary {
  width: 100%;
  background: #1a3a1a;
  color: #fff;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
}
.btn-primary:hover:not(:disabled) { background: #14300f; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.form-nav .btn-primary { flex: 1; margin-top: 0; }

.btn-back {
  flex: 0 0 auto;
  background: #fff;
  border: 1px solid #dde3dd;
  color: #1a3a1a;
  padding: 16px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.btn-back:hover { background: #f4f6f4; }

.signin-link { text-align: center; margin-top: 20px; font-size: 0.88rem; color: #8a9a8a; }
.signin-link a { color: #1a3a1a; font-weight: 600; text-decoration: none; }

@media (max-width: 900px) {
  .register-page { grid-template-columns: 1fr; }
  .left-panel { padding: 32px; min-height: 320px; }
  .left-content { margin-top: 32px; }
  .right-panel { padding: 32px; }
  .form-wrap { margin-top: 32px; }
  .role-grid { grid-template-columns: 1fr; }
  .field-row { grid-template-columns: 1fr; }
}
</style>