<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/api/userService'
import store from '@/store'

const router = useRouter()
const toast = useToast()

const username = ref<string>('')
const password = ref<string>('')
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Username dan password wajib diisi.'
    return
  }

  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await loginUser({
      username: username.value,
      password: password.value
    })

    const userObj = response.user
      ? {
          username: response.user.username || username.value,
          full_name: response.user.fullName || response.user.username || username.value,
          fullName: response.user.fullName,
          email: response.user.email || '',
          createdAt: response.user.createdAt,
          passwordChangedAt: response.user.passwordChangedAt
        }
      : {
          username: username.value,
          full_name: username.value,
          email: ''
        }

    const accessToken = (response as any).access_token || response.accessToken || ''
    const refreshToken = (response as any).refresh_token || response.refreshToken || ''

    // Set state & persist token
    store.setUser(userObj, accessToken, refreshToken)

    toast.add({
      severity: 'success',
      summary: `Selamat datang, ${userObj.full_name}!`,
      detail: `Anda berhasil masuk.`,
      life: 3000
    })

    // Immediately redirect to Dashboard
    await router.push('/dashboard')
  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'Login gagal. Silakan coba lagi.'

    toast.add({
      severity: 'error',
      summary: 'Login gagal',
      detail: errorMessage.value,
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-form-container">
    <Message v-if="errorMessage" severity="error" :closable="false">
      {{ errorMessage }}
    </Message>

    <div class="form-group">
      <InputGroup class="custom-input-group">
        <InputGroupAddon class="custom-addon">
          <i class="pi pi-user"></i>
        </InputGroupAddon>
        <InputText id="username" v-model="username" placeholder="Username" :disabled="isLoading" class="custom-input" />
      </InputGroup>
    </div>

    <div class="form-group">
      <InputGroup class="custom-input-group">
        <InputGroupAddon class="custom-addon">
          <i class="pi pi-lock"></i>
        </InputGroupAddon>
        <InputText id="password" type="password" placeholder="Password" v-model="password" :disabled="isLoading" @keyup.enter="handleLogin" class="custom-input" />
      </InputGroup>
    </div>

    <Button :disabled="isLoading" @click="handleLogin" class="btn-primary-glow">
      <i v-if="isLoading" class="pi pi-spin pi-spinner mr-2"></i>
      <span>{{ isLoading ? 'Memproses...' : 'Login' }}</span>
    </Button>
  </div>
</template>

<style scoped>
.login-form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  width: 100%;
}

:deep(.custom-input-group) {
  display: flex;
  width: 100%;
}

:deep(.custom-addon) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-radius: 8px 0 0 8px;
}

:deep(.custom-input) {
  width: 100%;
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border-radius: 0 8px 8px 0;
  padding: 0.75rem 1rem;
}

:deep(.custom-input:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
  outline: none;
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
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6);
}

.mr-2 {
  margin-right: 0.5rem;
}
</style>
