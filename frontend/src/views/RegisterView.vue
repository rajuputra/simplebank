<script setup lang="ts">
import Register from '@/components/Register.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const onRegisterSuccess = () => {
  router.push('/check-email')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="register-view-container">
    <Register
      @success="onRegisterSuccess"
      @login-click="goToLogin"
    />
  </div>
</template>

<style scoped>
.register-view-container {
  width: 100%;
}
</style>
