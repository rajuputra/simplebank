<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import store from '@/store'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isMobileSidebarOpen = ref(false)

// Close mobile sidebar when route changes
watch(
  () => route.path,
  () => {
    isMobileSidebarOpen.value = false
  }
)

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

const currentUser = computed(() => store.state.user)

const userDisplayName = computed(() => {
  if (!currentUser.value) return 'Guest'
  return currentUser.value.fullName || currentUser.value.full_name || currentUser.value.username || 'User'
})

const userInitials = computed(() => {
  const name = userDisplayName.value
  return name.slice(0, 2).toUpperCase()
})

const handleLogout = () => {
  const name = userDisplayName.value
  store.clearUser()
  toast.add({
    severity: 'success',
    summary: `Sampai Jumpa, ${name}!`,
    detail: 'Anda telah berhasil keluar dari akun.',
    life: 3000
  })
  router.push('/')
}

const navItems = [
  { label: 'Dashboard', icon: 'pi pi-home', to: '/' },
  { label: 'Profil', icon: 'pi pi-user', to: '/profile' },
  { label: 'Transfer', icon: 'pi pi-send', to: '/transfer' }
]

const currentTitle = computed(() => {
  const match = navItems.find((item) => item.to === route.path)
  return match ? match.label : 'Dashboard'
})
</script>

<template>
  <div class="layout-wrapper">
    <Toast />

    <!-- Mobile Sidebar Backdrop Overlay -->
    <div
      v-if="isMobileSidebarOpen"
      class="sidebar-backdrop"
      @click="closeMobileSidebar"
    ></div>

    <!-- Sidebar Container -->
    <aside
      class="sidebar-container"
      :class="{ 'mobile-open': isMobileSidebarOpen }"
    >
      <div class="sidebar-header">
        <div class="brand-logo">
          <i class="pi pi-wallet logo-icon"></i>
          <span class="brand-name">Simple Bank</span>
        </div>
        <button
          class="mobile-close-btn"
          @click="closeMobileSidebar"
          aria-label="Tutup Menu"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <ul>
          <li v-for="item in navItems" :key="item.to">
            <router-link
              :to="item.to"
              class="nav-link"
              :class="{ active: route.path === item.to }"
              @click="closeMobileSidebar"
            >
              <i :class="item.icon" class="nav-icon"></i>
              <span>{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer (User Info & Logout) -->
      <div class="sidebar-footer">
        <div class="user-badge" v-if="currentUser">
          <Avatar
            :label="userInitials"
            shape="circle"
            class="user-avatar"
          />
          <div class="user-info">
            <span class="user-name">{{ userDisplayName }}</span>
            <span class="user-email">{{ currentUser.email || `@${currentUser.username}` }}</span>
          </div>
        </div>

        <Button
          label="Keluar"
          icon="pi pi-sign-out"
          class="logout-button p-button-outlined p-button-danger"
          @click="handleLogout"
        />
      </div>
    </aside>

    <!-- Main Right Content Area -->
    <div class="main-wrapper">
      <!-- Top Header Navigation -->
      <header class="top-header">
        <div class="header-left">
          <button
            class="hamburger-btn"
            @click="toggleMobileSidebar"
            aria-label="Buka Menu"
          >
            <i class="pi pi-bars"></i>
          </button>
          <h1 class="page-title">{{ currentTitle }}</h1>
        </div>

        <div class="header-right" v-if="currentUser">
          <div class="header-user-pill">
            <Avatar :label="userInitials" shape="circle" class="header-avatar" />
            <span class="header-user-name">{{ userDisplayName }}</span>
          </div>
        </div>
      </header>

      <!-- Router View for Pages -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #1e293b;
  font-family: inherit;
}

/* --- Sidebar Styling --- */
.sidebar-container {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.03);
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 1.6rem;
  color: #10b981; /* Emerald green accent */
  background: #ecfdf5;
  padding: 0.5rem;
  border-radius: 10px;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.mobile-close-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
}

/* Sidebar Nav */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: #475569;
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.nav-link.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.nav-icon {
  font-size: 1.15rem;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1.25rem;
  border-top: 1px solid #f1f5f9;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  background-color: #10b981 !important;
  color: #ffffff !important;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-button {
  width: 100%;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

/* --- Main Content Wrapper --- */
.main-wrapper {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

/* Top Header */
.top-header {
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 90;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hamburger-btn {
  display: none;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: #334155;
  cursor: pointer;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-user-pill {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f8fafc;
  padding: 0.35rem 0.85rem 0.35rem 0.35rem;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
}

.header-avatar {
  background-color: #10b981 !important;
  color: #ffffff !important;
  font-size: 0.85rem;
  width: 32px;
  height: 32px;
}

.header-user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 2rem;
}

/* --- Responsive Media Queries --- */
@media (max-width: 1023px) {
  .sidebar-container {
    transform: translateX(-100%);
  }

  .sidebar-container.mobile-open {
    transform: translateX(0);
  }

  .mobile-close-btn {
    display: block;
  }

  .sidebar-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(2px);
    z-index: 95;
  }

  .main-wrapper {
    margin-left: 0;
  }

  .hamburger-btn {
    display: flex;
  }

  .top-header {
    padding: 0 1rem;
  }

  .content-area {
    padding: 1.25rem;
  }
}
</style>
