<template>
  <div>
    <!-- QUOTE BANNER -->
    <section class="quote-banner">
      <div class="quote-overlay"></div>
      <div class="quote-content">
        <p class="quote-text">
          "For <em class="highlight">better nutrition</em> and transformations that last a lifetime."
        </p>
        <div class="quote-sub">THE NUTRIMATCH PHILOSOPHY · BUILT FOR THE PHILIPPINES</div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="hiw" id="how-it-works">
      <div class="hiw-header">
        <div class="eyebrow"><span class="eyebrow-line"></span> SIMPLE PROCESS</div>
        <h2>How NutriMatch Works</h2>
        <p>Three steps to evidence-based nutrition care.</p>
      </div>

      <div class="steps-wrap">
        <div class="steps-line"></div>
        <div class="steps">
          <div class="step" v-for="step in steps" :key="step.number">
            <div class="step-circle">{{ step.number }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>

      <div class="hiw-cta">
        <button class="btn-gold">Create Your Free Account →</button>
      </div>
    </section>
  </div>
</template>

<script setup>
const steps = [
  {
    number: '01',
    title: 'Register & Get Verified',
    desc: 'Create your profile, complete pre-consultation screening, and submit credentials (RNDs) for PRC verification.',
  },
  {
    number: '02',
    title: 'Match Your Dietitian',
    desc: 'Browse verified RNDs by specialty, language, and consultation modality — video, chat, or in-person.',
  },
  {
    number: '03',
    title: 'Transform Your Health',
    desc: 'Get a personalized FNRI meal plan, structured NCP, and ongoing monitoring through your secure dashboard.',
  },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600&display=swap');

/* QUOTE BANNER */
.quote-banner {
  position: relative;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1400&q=80');
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
.quote-overlay {
  position: absolute; inset: 0;
  background: rgba(15, 42, 15, 0.72);
}
.quote-content {
  position: relative; text-align: center;
  padding: 60px 48px; max-width: 800px;
}
.quote-text {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 700; font-style: italic;
  color: #ffffff; line-height: 1.4; margin-bottom: 20px;
}
.highlight { color: #D4A017; font-style: italic; }
.quote-sub {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem; letter-spacing: 0.15em; color: #a8c4a8; font-weight: 500;
}

/* HOW IT WORKS */
.hiw {
  background: #0f2a0f;
  padding: 80px 72px;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}
.hiw-header { text-align: center; margin-bottom: 64px; }
.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em;
  color: #D4A017; margin-bottom: 16px;
}
.eyebrow-line { display: inline-block; width: 28px; height: 2px; background: #D4A017; }
.hiw-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.4rem; font-weight: 700; color: #ffffff; margin-bottom: 12px;
}
.hiw-header p { color: #8aaa8a; font-size: 0.95rem; }

.steps-wrap { position: relative; max-width: 860px; margin: 0 auto 56px; }
.steps-line {
  position: absolute; top: 36px;
  left: calc(16% + 20px); right: calc(16% + 20px);
  height: 1px; background: #3a6a3a; z-index: 0;
}
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; position: relative; z-index: 1; }
.step { text-align: center; }
.step-circle {
  width: 72px; height: 72px; border-radius: 50%;
  border: 1.5px solid #D4A017; color: #D4A017;
  font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 24px; background: #0f2a0f;
}
.step h3 { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
.step p { font-size: 0.85rem; color: #8aaa8a; line-height: 1.65; }

.hiw-cta { text-align: center; }
.btn-gold {
  background: #D4A017; border: none; color: #1a3a1a;
  padding: 16px 36px; border-radius: 32px; font-size: 0.95rem; font-weight: 700; cursor: pointer;
}
.btn-gold:hover { background: #c4920f; }

@media (max-width: 700px) {
  .steps { grid-template-columns: 1fr; }
  .steps-line { display: none; }
  .hiw { padding: 60px 24px; }
}
</style>