<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="check-email-container">
    <!-- Animated Background -->
    <div class="blob blob-primary"></div>
    <div class="blob blob-secondary"></div>

    <div class="glass-card">
      <div class="icon-wrapper">
        <i class="pi pi-envelope mail-icon"></i>
        <div class="sparkle sp-1"><i class="pi pi-star-fill"></i></div>
        <div class="sparkle sp-2"><i class="pi pi-star-fill"></i></div>
      </div>
      
      <h1 class="title">Cek Email Anda</h1>
      <p class="subtitle">
        Registrasi berhasil! Kami telah mengirimkan tautan verifikasi ke alamat email Anda. 
        Silakan klik tautan tersebut untuk mengaktifkan akun Dermawan Bank Anda.
      </p>
      
      <div class="instructions">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">Buka kotak masuk email (Inbox / Spam)</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">Klik tautan <strong>Verifikasi Email</strong></div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">Login dan mulai bertransaksi!</div>
        </div>
      </div>

      <button class="btn-primary-glow" @click="goToLogin">
        Kembali ke Halaman Login
      </button>
    </div>
  </div>
</template>

<style scoped>
.check-email-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #020617; /* Slate 950 */
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  padding: 1.5rem;
}

/* Background Blobs */
.blob {
  position: absolute;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.5;
  border-radius: 50%;
  animation: float 15s infinite alternate;
}

.blob-primary {
  width: 400px;
  height: 400px;
  background: #10b981; /* Emerald */
  top: -100px;
  left: -50px;
}

.blob-secondary {
  width: 300px;
  height: 300px;
  background: #3b82f6; /* Blue */
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Glass Card */
.glass-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 3rem 2.5rem;
  text-align: center;
  color: white;
}

.icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem auto;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
}

.mail-icon {
  font-size: 2.5rem;
  color: #34d399;
}

.sparkle {
  position: absolute;
  color: #fcd34d;
  font-size: 0.8rem;
  animation: twinkle 2s infinite alternate;
}

.sp-1 { top: -5px; right: -5px; animation-delay: 0s; }
.sp-2 { bottom: 5px; left: -10px; animation-delay: 1s; font-size: 0.6rem; }

@keyframes twinkle {
  0% { opacity: 0.3; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1.2); }
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.subtitle {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.instructions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
  text-align: left;
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.step-num {
  width: 28px;
  height: 28px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.9rem;
  color: #f1f5f9;
}

.btn-primary-glow {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
  transition: all 0.3s;
}

.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6);
  background: linear-gradient(135deg, #059669, #047857);
}
</style>
