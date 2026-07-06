<template>
  <div class="login-page">
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
        <span class="eyebrow">WELCOME BACK !</span>
        <h1>
          Your health<br />
          journey <em class="highlight">continues</em><br />
          here.
        </h1>
        <p class="left-desc">Access your dashboard, meal plans, and consultation records securely.</p>
      </div>
    </aside>

    <!-- RIGHT PANEL -->
    <main class="right-panel">
      <button class="back-link" @click="navigateTo('/')">
        ← Back to home
      </button>

      <div class="form-wrap">
        <h2>Sign in</h2>
        <p class="subtitle">Enter your credentials to access your NutriMatch account</p>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="field">
            <label>Email Address</label>
            <div class="input-icon-wrap">
              <span class="input-icon">👤</span>
              <input v-model="form.email" type="email" placeholder="blessedhope2003@email.com" required />
            </div>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="input-icon-wrap">
              <span class="input-icon">🔒</span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                required
              />
              <button type="button" class="toggle-visibility" @click="showPassword = !showPassword">
                {{ showPassword ? 'HIDE' : 'SHOW' }}
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input v-model="form.rememberMe" type="checkbox" />
              Remember me
            </label>
            <a href="#" class="forgot-link" @click.prevent="navigateTo('/forgot-password')">Forgot Password?</a>
          </div>

          <button type="submit" class="btn-primary">Sign in</button>

          <div class="divider"><span>or</span></div>

          <button type="button" class="btn-google" @click="handleGoogleLogin">
            <span class="google-icon">G</span> Sign in with Google
          </button>
        </form>

        <p class="signup-link">
          Don't have an account? <a href="#" @click.prevent="navigateTo('/register')">Sign up free</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

function handleLogin() {
  console.log('Logging in:', form)
  navigateTo('/rnd-dashboard')

}

function handleGoogleLogin() {
  // TODO: connect to your Google OAuth flow here
  console.log('Google sign in clicked')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap');

.login-page {
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

.left-content { margin-top: 160px; position: relative; z-index: 1; }

.eyebrow { font-size: 0.75rem; letter-spacing: 0.1em; color: #a8c4a8; }

.left-content h1 {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 2.85rem);
  line-height: 1.2;
  margin: 16px 0 24px;
}
.highlight { color: #D4A017; }

.left-desc { font-size: 0.92rem; color: #a8c4a8; line-height: 1.6; max-width: 380px; }

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

.form-wrap { max-width: 480px; margin: 80px auto 0; width: 100%; }

.form-wrap h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.1rem;
  color: #1a3a1a;
  margin-bottom: 8px;
}

.subtitle { color: #8a9a8a; font-size: 0.9rem; margin-bottom: 32px; }

.login-form { display: flex; flex-direction: column; gap: 18px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #1a3a1a;
  text-transform: uppercase;
}
.field input {
  padding: 12px 14px;
  border: 1px solid #dde3dd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fff;
  color: #1a3a1a;
}
.field input:focus { outline: none; border-color: #1a3a1a; }

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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}
.remember-me { display: flex; align-items: center; gap: 8px; color: #4a5a4a; cursor: pointer; }
.remember-me input { width: 15px; height: 15px; cursor: pointer; }
.forgot-link { color: #1a3a1a; font-weight: 600; text-decoration: none; }
.forgot-link:hover { text-decoration: underline; }

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
.btn-primary:hover { background: #14300f; }

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #a8b4a8;
  font-size: 0.8rem;
  margin: 4px 0;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e5e0;
}
.divider span { padding: 0 14px; }

.btn-google {
  width: 100%;
  background: #fff;
  border: 1px solid #dde3dd;
  color: #1a3a1a;
  padding: 14px;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.btn-google:hover { background: #f7f8f7; }
.google-icon {
  font-weight: 700;
  color: #4285F4;
}

.signup-link { text-align: center; margin-top: 24px; font-size: 0.88rem; color: #8a9a8a; }
.signup-link a { color: #1a3a1a; font-weight: 600; text-decoration: none; }

@media (max-width: 900px) {
  .login-page { grid-template-columns: 1fr; }
  .left-panel { padding: 32px; min-height: 280px; }
  .left-content { margin-top: 32px; }
  .right-panel { padding: 32px; }
  .form-wrap { margin-top: 32px; }
}
</style>