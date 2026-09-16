<script setup>
import { rnds, clients, adminProfile } from '~/mock/mockAdminDatabase'

const route = useRoute()
const profile = adminProfile

const pendingCount = computed(() => rnds.value.filter(r => r.status === 'pending').length)
const flaggedCount = computed(() => clients.value.filter(c => c.status === 'Flagged').length)

const isCollapsed = ref(true)
let collapseTimeout = null

function expandSidebar() {
  clearTimeout(collapseTimeout)
  isCollapsed.value = false
}

function collapseSidebar() {
  // tiny delay so it doesn't flicker if the cursor grazes the edge
  collapseTimeout = setTimeout(() => {
    isCollapsed.value = true
  }, 150)
}

const nav = computed(() => [
  {
    section: 'OVERVIEW',
    items: [
      { label: 'Dashboard', to: '/admin-dashboard', icon: 'grid' }
    ]
  },
  {
    section: 'PLATFORM OPERATIONS',
    items: [
      { label: 'RND Verification', to: '/rnd-verification', icon: 'shield', badge: pendingCount.value },
      { label: 'Client Management', to: '/client-management', icon: 'users' },
      { label: 'Billing & Commission', to: '/billing-commission', icon: 'card' }
    ]
  },
  {
    section: 'GOVERNANCE',
    items: [
      { label: 'Audit Logs', to: '/audit-logs', icon: 'file' },
      { label: 'Platform Reports', to: '/platform-reports', icon: 'trending' },
      { label: 'System Settings', to: '/system-settings', icon: 'gear' }
    ]
  }
])

const isActive = (to) => route.path === to

async function handleSignOut() {
  localStorage.removeItem('nutrimatch_admin_session')
  await navigateTo('/login')
}
</script>

<template>
  <aside
    class="shrink-0 bg-forest text-cream/90 flex flex-col h-screen sticky top-0 transition-all duration-200 ease-out relative z-40"
    :class="isCollapsed ? 'w-[76px]' : 'w-[230px]'"
    @mouseenter="expandSidebar"
    @mouseleave="collapseSidebar"
  >

    <div class="px-5 pt-6 pb-5 overflow-hidden">
      <div class="flex items-center gap-2">
        <img src="/resources/nutrimatchlogo.png" alt="NutriMatch Logo" class="w-7 h-7 object-contain shrink-0" />
        <span v-if="!isCollapsed" class="font-serif text-[19px] leading-none whitespace-nowrap">
          <span class="text-cream">Nutri</span><span class="text-gold-light">Match</span>
        </span>
      </div>
      <p v-if="!isCollapsed" class="text-[9.5px] tracking-[0.18em] text-cream/40 mt-1.5 whitespace-nowrap">CLINICAL NUTRITION SYSTEM</p>
      <span v-if="!isCollapsed" class="inline-flex items-center gap-1.5 mt-3 text-[10.5px] font-semibold text-gold-light border border-gold/40 rounded-full px-2.5 py-1 whitespace-nowrap">
        <span class="w-1.5 h-1.5 rounded-full bg-gold-light"></span> ADMIN PORTAL
      </span>
    </div>

    <nav class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin px-3 pb-4">
      <div v-for="group in nav" :key="group.section" class="mb-6">
        <p v-if="!isCollapsed" class="text-[10px] tracking-[0.15em] text-cream/30 px-3 mb-2 whitespace-nowrap">{{ group.section }}</p>
        <p v-else class="h-px bg-white/10 mx-2 mb-2"></p>
        <NuxtLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="group relative flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13.5px] mb-1 transition-all duration-200 ease-out"
          :class="[
            isCollapsed ? 'justify-center' : 'justify-between',
            isActive(item.to)
              ? 'bg-forest-light text-white font-semibold'
              : 'text-cream/65 hover:bg-forest-light/60 hover:text-white hover:font-medium hover:translate-x-0.5 hover:shadow-sm'
          ]"
        >
          <span
            class="nav-indicator absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gold-light transition-all duration-200"
            :class="isActive(item.to)
              ? 'opacity-100 scale-y-100'
              : 'opacity-0 scale-y-0 group-hover:opacity-60 group-hover:scale-y-100'"
          ></span>
          <span class="flex items-center gap-2.5 min-w-0">
            <NavIcon
              :name="item.icon"
              class="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
              :class="isActive(item.to) ? 'text-gold-light' : 'group-hover:text-gold-light/90'"
            />
            <span v-if="!isCollapsed" class="whitespace-nowrap overflow-hidden text-ellipsis">{{ item.label }}</span>
          </span>
          <span v-if="item.badge && !isCollapsed" class="bg-gold-light text-forest-dark text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pop shrink-0">
            {{ item.badge }}
          </span>
          <span v-else-if="item.badge && isCollapsed" class="absolute top-1 right-1 w-2 h-2 rounded-full bg-gold-light"></span>
        </NuxtLink>
      </div>
    </nav>

    <div class="border-t border-white/10 px-4 py-3.5 overflow-hidden">
      <div class="flex items-center gap-2.5" :class="isCollapsed ? 'justify-center' : ''">
        <div class="w-8 h-8 rounded-full bg-gold-light text-forest-dark flex items-center justify-center text-xs font-bold shrink-0">
          {{ profile.footerName.split(' ').map(n => n[0]).slice(0,2).join('') }}
        </div>
        <div v-if="!isCollapsed" class="leading-tight min-w-0">
          <p class="text-[13.5px] text-white truncate">{{ profile.footerName }}</p>
          <p class="text-[11px] text-cream/40">{{ profile.footerRole }}</p>
        </div>
      </div>
      <button
        @click="handleSignOut"
        class="group flex items-center gap-2 text-[13px] text-cream/50 hover:text-white mt-3.5 transition-colors"
        :class="isCollapsed ? 'justify-center w-full' : ''"
      >
        <NavIcon name="logout" class="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
        <span v-if="!isCollapsed" class="whitespace-nowrap">Sign Out</span>
      </button>
    </div>
  </aside>
</template>