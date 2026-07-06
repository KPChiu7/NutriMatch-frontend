<template>
  <nav class="navbar">
    <div class="nav-logo">
      <div class="nav-logo">
  <img src="/resources/nutrimatchlogo.png" alt="NutriMatch Logo" class="logo-img" />
  
</div>
      <span class="logo-text">
        <span class="logo-nutri">Nutri</span><span class="logo-match">Match</span>
      </span>
    </div>

    <ul class="nav-links">
      <li><a href="#features">Features</a></li>
      <li><a href="#how-it-works">How It Works</a></li>
      <li><a href="#testimonials">Testimonials</a></li>
      <li><a href="#for-rnds">For RNDs</a></li>
      <li><a href="#faqs">FAQs</a></li>
    </ul>

    <div class="nav-actions">
      <button class="btn-login" @click="navigateTo('/login')">Log In</button>
      <button class="btn-get-started" @click="navigateTo('/register')">Get Started</button>    </div>
  </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  height: 68px;
  background-color: #162e16;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  font-family: 'Inter', sans-serif;
}

.nav-logo { display: flex; align-items: center; gap: 10px; }
.logo-text { font-size: 1.3rem; font-weight: 700; }
.logo-nutri { color: #ffffff; }
.logo-match { color: #D4A017; }

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.nav-links { display: flex; list-style: none; gap: 32px; }
.nav-links a {
  color: #c8d8c8; text-decoration: none;
  font-size: 0.9rem; font-weight: 500; transition: color 0.2s;
}
.nav-links a:hover { color: #ffffff; }

.nav-actions { display: flex; gap: 12px; align-items: center; }

.btn-login {
  background: transparent; border: 1.5px solid #ffffff; color: #ffffff;
  padding: 8px 22px; border-radius: 24px; font-size: 0.88rem;
  font-weight: 500; cursor: pointer; transition: background 0.2s;
}
.btn-login:hover { background: rgba(255,255,255,0.08); }

.btn-get-started {
  background: #D4A017; border: none; color: #1a3a1a;
  padding: 8px 22px; border-radius: 24px; font-size: 0.88rem;
  font-weight: 700; cursor: pointer; transition: background 0.2s;
}
.btn-get-started:hover { background: #c4920f; }

@media (max-width: 900px) {
  .navbar { padding: 0 24px; }
  .nav-links { display: none; }
}
</style>