<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Toast from 'primevue/toast'
</script>

<template>
  <div class="auth-layout-container">
    <Toast />
    <!-- Animated Background -->
    <div class="blob blob-primary"></div>
    <div class="blob blob-secondary"></div>
    
    <div class="auth-content-box relative z-10">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.auth-layout-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #020617;
  padding: 1.5rem;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* Background Blobs */
.blob {
  position: absolute;
  filter: blur(90px);
  z-index: 0;
  opacity: 0.5;
  border-radius: 50%;
  animation: float 20s infinite alternate;
}

.blob-primary {
  width: 500px;
  height: 500px;
  background: #10b981;
  top: -150px;
  right: -100px;
}

.blob-secondary {
  width: 400px;
  height: 400px;
  background: #3b82f6;
  bottom: -100px;
  left: -100px;
  animation-delay: -5s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30px, 50px) scale(1.1); }
  100% { transform: translate(20px, -20px) scale(0.9); }
}

.auth-content-box {
  width: 100%;
  max-width: 460px;
  z-index: 10;
}
</style>
