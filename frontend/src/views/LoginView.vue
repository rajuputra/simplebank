<script setup lang="ts">
import LoginUser from '@/components/LoginUser.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-view-container">
    <div class="auth-brand text-center mb-4">
      <div class="brand-badge">
        <i class="pi pi-wallet"></i>
      </div>
      <h2>Dermawan Bank</h2>
      <p>Sistem Perbankan Digital Cepat, Aman, dan Modern</p>
    </div>

    <div class="glass-card">
      <div class="card-header text-center font-bold">
        Masuk ke Akun Anda
      </div>
      <div class="card-body">
        <LoginUser />
        <div class="toggle-mode text-center mt-4">
          <span>Belum memiliki akun?</span>
          <a href="#" @click.prevent="goToRegister" class="register-link">Daftar Akun Baru</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view-container {
  width: 100%;
}

.auth-brand .brand-badge {
  width: 64px;
  height: 64px;
  margin: 0 auto 0.75rem auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.8rem;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}

.auth-brand h2 {
  font-size: 1.85rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.auth-brand p {
  color: #94a3b8;
  font-size: 0.925rem;
  margin: 0.35rem 0 0 0;
}

.glass-card {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 2.5rem 2rem;
  color: white;
}

.card-header {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.text-center {
  text-align: center;
}

.font-bold {
  font-weight: 700;
  color: #ffffff;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1.25rem;
}

.register-link {
  color: #34d399;
  font-weight: 600;
  margin-left: 0.4rem;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style>
