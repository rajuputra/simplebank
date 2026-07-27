<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import store from '@/store'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const currentUser = computed(() => store.state.user)

const userDisplayName = computed(() => {
  if (!currentUser.value) return 'User'
  return currentUser.value.fullName || currentUser.value.full_name || currentUser.value.username || 'User'
})

const userInitial = computed(() => {
  const name = userDisplayName.value
  return name.charAt(0).toUpperCase() || 'U'
})

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/profile': 'Profil Saya',
    '/transfer': 'Transfer Dana'
  }
  return map[route.path] || 'Dermawan Bank'
})

const handleLogout = () => {
  const name = userDisplayName.value
  store.clearUser()
  localStorage.removeItem('access_token')
  sessionStorage.removeItem('access_token')
  toast.add({
    severity: 'success',
    summary: `Sampai Jumpa, ${name}!`,
    detail: 'Anda telah berhasil keluar dari akun.',
    life: 3000
  })
  router.push('/login')
}

const navLinks = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
  },
  {
    to: '/profile',
    label: 'Profil Saya',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    to: '/transfer',
    label: 'Transfer',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`
  }
]
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-slate-100">
    <Toast position="top-right" />

    <!-- ═══════════════════════════════════════════
         SIDEBAR — hidden on mobile, visible on md+
    ═══════════════════════════════════════════ -->
    <aside class="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200 shadow-sm z-20">

      <!-- Brand Logo -->
      <div class="flex items-center gap-3 h-16 px-5 border-b border-slate-100 shrink-0">
        <div class="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
        </div>
        <div>
          <p class="font-bold text-slate-900 text-sm leading-tight">Dermawan Bank</p>
          <p class="text-xs text-slate-400 leading-tight">Digital Banking</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-150 no-underline group"
          :class="route.path === link.to ? 'bg-emerald-50 text-emerald-700 border-l-[3px] border-emerald-500 pl-[9px]' : 'border-l-[3px] border-transparent'"
        >
          <span class="shrink-0 opacity-70 group-hover:opacity-100" :class="route.path === link.to ? 'opacity-100' : ''" v-html="link.icon"></span>
          <span>{{ link.label }}</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer — User Profile + Logout -->
      <div class="shrink-0 border-t border-slate-100 p-3">
        <!-- User Info -->
        <div v-if="currentUser" class="flex items-center gap-3 px-2 py-2 mb-2">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm">
            {{ userInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-800 truncate">{{ userDisplayName }}</p>
            <p class="text-xs text-slate-400 truncate">{{ currentUser.email || `@${currentUser.username}` }}</p>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 border border-transparent hover:border-red-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar dari Akun
        </button>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════
         MAIN CONTENT AREA
    ═══════════════════════════════════════════ -->
    <div class="flex-1 min-w-0 flex flex-col overflow-hidden pb-16 md:pb-0">

      <!-- Top Header -->
      <header class="h-16 shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200 shadow-sm z-10">
        <div>
          <h1 class="text-lg font-bold text-slate-800">{{ pageTitle }}</h1>
          <p class="text-xs text-slate-400">Dermawan Bank — Digital Banking Platform</p>
        </div>

        <!-- User Pill -->
        <div v-if="currentUser" class="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
            {{ userInitial }}
          </div>
          <span class="text-sm font-medium text-slate-700 pr-1">{{ userDisplayName }}</span>
        </div>
      </header>

      <!-- Scrollable Page Content -->
      <main class="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
        <router-view />
      </main>
    </div>

    <!-- ═══════════════════════════════════════════
         BOTTOM NAVIGATION — visible on mobile only
    ═══════════════════════════════════════════ -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] px-2">
      <router-link
        v-for="link in navLinks"
        :key="link.to + '-mobile'"
        :to="link.to"
        class="flex flex-col items-center justify-center w-full h-full text-slate-400 no-underline transition-colors"
        :class="route.path === link.to ? 'text-emerald-600' : ''"
      >
        <span class="mb-1" v-html="link.icon"></span>
        <span class="text-[0.65rem] font-medium">{{ link.label }}</span>
      </router-link>
      
      <button @click="handleLogout" class="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span class="text-[0.65rem] font-medium">Keluar</span>
      </button>
    </nav>
  </div>
</template>
