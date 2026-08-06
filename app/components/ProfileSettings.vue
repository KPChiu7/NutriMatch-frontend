<template>
  <div class="profile-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Profile Settings</h1>
        <p class="page-sub">Manage your professional profile, credentials, and preferences.</p>
      </div>
      <span v-if="personalInfo.prcVerified" class="verified-pill">
        <BadgeCheck :size="14" />
        PRC Verified
      </span>
    </div>

    <div class="profile-layout">
      <!-- TABS -->
      <div class="tab-card">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <component :is="tab.icon" :size="17" />
          {{ tab.label }}
        </button>
      </div>

      <!-- PANEL -->
      <div class="panel-card">
        <template v-if="activeTab === 'personal'">
          <div class="avatar-row">
            <div class="avatar-circle" :style="{ background: personalInfo.avatarColor }">
              {{ personalInfo.initials }}
            </div>
            <div>
              <button class="change-photo-btn" type="button">Change Photo</button>
              <p class="avatar-hint">JPG or PNG, max 2MB</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="field">
              <label class="field-label">First Name</label>
              <input v-model="personalInfo.firstName" type="text" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Last Name</label>
              <input v-model="personalInfo.lastName" type="text" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Email Address</label>
              <input v-model="personalInfo.email" type="email" class="field-input" />
            </div>
            <div class="field">
              <label class="field-label">Phone Number</label>
              <input v-model="personalInfo.phone" type="tel" class="field-input" />
            </div>
          </div>

          <button class="save-btn" type="button" @click="saveChanges">Save Changes</button>
        </template>

        <template v-else>
          <p class="placeholder-text">{{ activeTabLabel }} settings go here.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { User, Briefcase, Languages, Wallet, ShieldCheck, BadgeCheck } from 'lucide-vue-next'
import { db } from '~/mock/mockDatabase'

definePageMeta({ layout: 'dashboard', title: 'Profile Settings' })

const tabs = [
  { key: 'personal', label: 'Personal Info', icon: User },
  { key: 'professional', label: 'Professional Profile', icon: Briefcase },
  { key: 'languages', label: 'Languages', icon: Languages },
  { key: 'fees', label: 'Fees & Payouts', icon: Wallet },
  { key: 'security', label: 'Security', icon: ShieldCheck }
]

const activeTab = ref('personal')
const activeTabLabel = computed(() => tabs.find(t => t.key === activeTab.value)?.label)

const personalInfo = ref({ ...db.personalInfo })

function saveChanges() {
  // Wire this up to your real update-profile API call
  personalInfo.value.initials = `${personalInfo.value.firstName?.[0] ?? ''}${personalInfo.value.lastName?.[0] ?? ''}`.toUpperCase()
}
</script>

<style scoped>
* { box-sizing: border-box; }

.profile-page { font-family: 'Inter', sans-serif; }

.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-family: 'Playfair Display', serif; font-size: 1.7rem; color: #1a3a1a; margin: 0 0 4px; }
.page-sub { font-size: 0.88rem; color: #6a7a6a; margin: 0; }

.verified-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: #e6efe0; color: #3a6b3a; font-size: 0.78rem; font-weight: 700;
  padding: 7px 14px; border-radius: 20px; white-space: nowrap;
}

/* LAYOUT */
.profile-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; align-items: start; }

.tab-card {
  background: #fff; border-radius: 12px; border: 1px solid #eceeec;
  padding: 10px; display: flex; flex-direction: column; gap: 2px;
}
.tab-item {
  display: flex; align-items: center; gap: 10px; text-align: left;
  border: none; background: none; border-radius: 8px; padding: 12px 14px;
  font-size: 0.88rem; font-weight: 600; color: #4a5a4a; cursor: pointer;
}
.tab-item.active { background: #eef3ec; color: #1a3a1a; }

.panel-card {
  background: #fff; border-radius: 12px; border: 1px solid #eceeec; padding: 28px;
}

/* AVATAR */
.avatar-row { display: flex; align-items: center; gap: 18px; margin-bottom: 26px; }
.avatar-circle {
  width: 56px; height: 56px; border-radius: 50%; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 1.05rem; font-weight: 700; flex-shrink: 0;
}
.change-photo-btn {
  border: 1px solid #d5dad5; background: #fff; color: #1a3a1a;
  border-radius: 8px; padding: 9px 16px; font-size: 0.84rem; font-weight: 600; cursor: pointer;
}
.avatar-hint { font-size: 0.76rem; color: #9aaa9a; margin: 6px 0 0; }

/* FORM */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 24px; margin-bottom: 24px; }
.field-label { display: block; font-size: 0.82rem; font-weight: 600; color: #1a3a1a; margin: 0 0 8px; }
.field-input {
  width: 100%; border: 1px solid #d5dad5; border-radius: 8px; padding: 12px 14px;
  font-size: 0.88rem; color: #2a2a2a; font-family: inherit;
}
.field-input:focus { outline: none; border-color: #D4A017; }

.save-btn {
  background: #D4A017; color: #1a3a1a; border: none; border-radius: 8px;
  padding: 12px 22px; font-weight: 700; font-size: 0.88rem; cursor: pointer;
}

.placeholder-text { font-size: 0.85rem; color: #9aaa9a; }
</style>