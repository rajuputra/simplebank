<script setup lang="ts">
import { ref, computed } from 'vue'
import LoginUser from '../components/LoginUser.vue'
import Register from '../components/Register.vue'
import store from '../store'
import Card from 'primevue/card'

const isRegisterMode = ref(false)

const currentUser = computed(() => store.state.user)

const userDisplayName = computed(() => {
  if (!currentUser.value) return ''
  return currentUser.value.fullName || currentUser.value.full_name || currentUser.value.username || ''
})

const onRegisterSuccess = () => {
  isRegisterMode.value = false
}
</script>

<template>
  <!-- Authenticated Dashboard View -->
  <div v-if="store.state.user" class="dashboard-overview">
    <div class="welcome-banner">
      <div class="banner-text">
        <h1>Selamat Datang, {{ userDisplayName }}! 👋</h1>
        <p>Kelola rekening dan transaksi perbankan Anda dengan mudah di Simple Bank.</p>
      </div>
      <div class="banner-decoration">
        <i class="pi pi-shield"></i>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="stats-grid">
      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <div class="stat-icon emerald">
              <i class="pi pi-wallet"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Estimasi Saldo</span>
              <span class="stat-value">Rp 12.500.000</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <div class="stat-icon blue">
              <i class="pi pi-arrow-up-right"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Total Transaksi</span>
              <span class="stat-value">24 Transaksi</span>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="stat-item">
            <div class="stat-icon purple">
              <i class="pi pi-check-circle"></i>
            </div>
            <div class="stat-info">
              <span class="stat-label">Status Akun</span>
              <span class="stat-value text-success">Aktif & Terverifikasi</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Quick Actions Card -->
    <Card class="actions-card">
      <template #title>Layanan Cepat</template>
      <template #content>
        <div class="quick-actions-grid">
          <router-link to="/transfer" class="action-tile">
            <i class="pi pi-send icon"></i>
            <span>Transfer Dana</span>
          </router-link>
          <router-link to="/profile" class="action-tile">
            <i class="pi pi-user-edit icon"></i>
            <span>Pengaturan Profil</span>
          </router-link>
          <a href="#" @click.prevent class="action-tile disabled">
            <i class="pi pi-history icon"></i>
            <span>Riwayat Mutasi</span>
          </a>
        </div>
      </template>
    </Card>
  </div>

  <!-- Guest Login / Register Card View -->
  <div v-else class="auth-guest-wrapper">
    <div class="auth-brand text-center">
      <div class="brand-badge">
        <i class="pi pi-wallet"></i>
      </div>
      <h2>Simple Bank</h2>
      <p>Sistem Perbankan Digital Cepat, Aman, dan Modern</p>
    </div>

    <Register
      v-if="isRegisterMode"
      @success="onRegisterSuccess"
      @login-click="isRegisterMode = false"
    />
    <div v-else class="login-box">
      <Card class="guest-card">
        <template #title>
          <div class="text-center font-bold">Masuk ke Akun Anda</div>
        </template>
        <template #content>
          <LoginUser />
          <div class="toggle-mode text-center mt-4">
            <span>Belum memiliki akun?</span>
            <a href="#" @click.prevent="isRegisterMode = true" class="register-link">Daftar Akun Baru</a>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.dashboard-overview {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.welcome-banner {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  color: #ffffff;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
}

.banner-text h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.banner-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.banner-decoration i {
  font-size: 4rem;
  opacity: 0.25;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.stat-icon.emerald {
  background: #ecfdf5;
  color: #10b981;
}

.stat-icon.blue {
  background: #eff6ff;
  color: #3b82f6;
}

.stat-icon.purple {
  background: #f5f3ff;
  color: #8b5cf6;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.825rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
}

.text-success {
  color: #10b981;
  font-size: 0.95rem;
}

.actions-card {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 0.5rem;
}

.action-tile {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #334155;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.action-tile .icon {
  font-size: 1.75rem;
  color: #10b981;
}

.action-tile:hover:not(.disabled) {
  background: #ffffff;
  border-color: #10b981;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.15);
}

.action-tile.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Guest View Styling */
.auth-guest-wrapper {
  max-width: 440px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-brand .brand-badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 0.75rem auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.6rem;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.auth-brand h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.auth-brand p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}

.guest-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.text-center {
  text-align: center;
}

.font-bold {
  font-weight: 700;
}

.mt-4 {
  margin-top: 1.25rem;
}

.register-link {
  color: #10b981;
  font-weight: 600;
  margin-left: 0.4rem;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .stats-grid,
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .banner-decoration {
    display: none;
  }
}
</style>
