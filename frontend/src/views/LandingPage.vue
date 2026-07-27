<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="landing-container">
    <!-- Animated Background -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <nav class="glass-header">
      <div class="logo">
        <div class="logo-icon">
          <i class="pi pi-wallet"></i>
        </div>
        <span class="logo-text">Dermawan Bank</span>
      </div>
      <div class="nav-actions">
        <button class="btn-login-nav" @click="goToLogin">Masuk</button>
        <button class="btn-register-nav" @click="goToRegister">Buka Rekening</button>
      </div>
    </nav>

    <main class="hero-section">
      <div class="hero-content">
        <div class="badge-animated">🚀 Platform Perbankan Generasi Baru</div>
        <h1 class="hero-title">
          Keuangan Anda, <br />
          <span class="text-gradient">Tumbuh Bersama.</span>
        </h1>
        <p class="hero-subtitle">
          Dermawan Bank menghadirkan pengalaman digital banking yang cepat, super aman, dan dirancang khusus untuk kemudahan hidup Anda.
        </p>
        <div class="hero-cta">
          <button class="btn-primary-glow" @click="goToRegister">
            Mulai Sekarang
            <i class="pi pi-arrow-right ml-2"></i>
          </button>
          <button class="btn-secondary-glass" @click="goToLogin">
            Masuk ke Akun
          </button>
        </div>
        
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">100%</span>
            <span class="stat-label">Aman & Terenkripsi</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">0 Biaya</span>
            <span class="stat-label">Admin Bulanan</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">24/7</span>
            <span class="stat-label">Akses Digital</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="glass-card mockup-card">
          <div class="mockup-header">
            <div class="circle red"></div>
            <div class="circle yellow"></div>
            <div class="circle green"></div>
          </div>
          <div class="mockup-body">
            <div class="mockup-balance">
              <p>Total Saldo</p>
              <h3>Rp 12.500.000</h3>
            </div>
            <div class="mockup-chart">
              <div class="bar" style="height: 40%"></div>
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 50%"></div>
              <div class="bar" style="height: 90%"></div>
              <div class="bar" style="height: 60%"></div>
            </div>
            <div class="mockup-tx">
              <div class="tx-item">
                <div class="tx-icon receive"><i class="pi pi-arrow-down"></i></div>
                <div class="tx-details">
                  <h4>Gaji Bulanan</h4>
                  <p>Hari ini</p>
                </div>
                <div class="tx-amount positive">+ Rp 8.000.000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.landing-container {
  min-height: 100vh;
  background-color: #020617; /* Very dark slate */
  color: #f8fafc;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Background Blobs for vibrant mesh effect */
.blob {
  position: absolute;
  filter: blur(80px);
  z-index: 0;
  opacity: 0.6;
  border-radius: 50%;
  animation: float 20s infinite alternate;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: #10b981; /* Emerald */
  top: -200px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #3b82f6; /* Blue */
  bottom: -150px;
  right: -50px;
  animation-delay: -5s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: #8b5cf6; /* Purple */
  top: 40%;
  left: 40%;
  animation-delay: -10s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

/* Header */
.glass-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 4rem;
  background: rgba(2, 6, 23, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.nav-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-login-nav {
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: color 0.3s;
}
.btn-login-nav:hover {
  color: white;
}

.btn-register-nav {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.25rem;
  border-radius: 99px;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}
.btn-register-nav:hover {
  background: white;
  color: #0f172a;
}

/* Hero Section */
.hero-section {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 4rem;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.badge-animated {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 99px;
  color: #34d399;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1.5rem 0;
  letter-spacing: -1.5px;
}

.text-gradient {
  background: linear-gradient(to right, #34d399, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 3.5rem;
}

.btn-primary-glow {
  background: #10b981;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5);
  transition: all 0.3s;
}
.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px -5px rgba(16, 185, 129, 0.6);
  background: #059669;
}

.btn-secondary-glass {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}
.btn-secondary-glass:hover {
  background: rgba(255, 255, 255, 0.1);
}

.ml-2 { margin-left: 0.5rem; }

/* Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
}

/* Visual Mockup */
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  perspective: 1000px;
}

.glass-card {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transform: rotateY(-15deg) rotateX(10deg);
  transition: transform 0.5s ease;
  overflow: hidden;
}

.glass-card:hover {
  transform: rotateY(-5deg) rotateX(5deg) translateY(-10px);
}

.mockup-header {
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 1rem;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.circle.red { background: #ef4444; }
.circle.yellow { background: #f59e0b; }
.circle.green { background: #10b981; }

.mockup-body {
  padding: 2rem;
}

.mockup-balance p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}
.mockup-balance h3 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 2rem 0;
  background: linear-gradient(to right, #fff, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mockup-chart {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  height: 100px;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.mockup-chart .bar {
  flex: 1;
  background: linear-gradient(to top, #10b981, #34d399);
  border-radius: 4px 4px 0 0;
  opacity: 0.8;
}

.mockup-tx {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tx-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tx-icon.receive {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.tx-details h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}
.tx-details p {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.tx-amount {
  margin-left: auto;
  font-weight: 700;
}
.tx-amount.positive {
  color: #34d399;
}

@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 2rem;
  }
  .hero-cta {
    justify-content: center;
  }
  .stats-row {
    justify-content: center;
  }
  .hero-title {
    font-size: 3.5rem;
  }
  .glass-card {
    transform: none !important;
  }
}
@media (max-width: 768px) {
  .glass-header {
    padding: 1.25rem 1.5rem;
  }
  .nav-actions {
    display: none;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-cta {
    flex-direction: column;
    width: 100%;
  }
  .hero-cta button {
    width: 100%;
    justify-content: center;
  }
}
</style>
