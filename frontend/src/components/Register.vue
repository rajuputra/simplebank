<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { createUser } from '@/api/userService'
import type { PbCreateUserRequest } from '@/types/api'

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'login-click'): void
}>()

const toast = useToast()

const formData = ref<PbCreateUserRequest>({
  username: '',
  fullName: '',
  email: '',
  password: ''
})

interface FormErrors {
  username?: string
  fullName?: string
  email?: string
  password?: string
}

const errors = ref<FormErrors>({})
const isLoading = ref<boolean>(false)
const apiError = ref<string>('')
const apiSuccess = ref<string>('')

// Form Validation logic
const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  // Validate Username
  if (!formData.value.username.trim()) {
    errors.value.username = 'Username wajib diisi'
    isValid = false
  } else if (formData.value.username.trim().length < 3) {
    errors.value.username = 'Username minimal 3 karakter'
    isValid = false
  }

  // Validate Full Name
  if (!formData.value.fullName.trim()) {
    errors.value.fullName = 'Nama lengkap wajib diisi'
    isValid = false
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email wajib diisi'
    isValid = false
  } else if (!emailRegex.test(formData.value.email.trim())) {
    errors.value.email = 'Format email tidak valid'
    isValid = false
  }

  // Validate Password
  if (!formData.value.password) {
    errors.value.password = 'Password wajib diisi'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
    isValid = false
  }

  return isValid
}

// Handle Form Submission
const handleRegister = async () => {
  apiError.value = ''
  apiSuccess.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const payload: PbCreateUserRequest = {
      username: formData.value.username.trim(),
      fullName: formData.value.fullName.trim(),
      email: formData.value.email.trim(),
      password: formData.value.password
    }

    const response = await createUser(payload)

    const createdUsername = response.user?.username || payload.username
    apiSuccess.value = `Registrasi berhasil! Selamat datang, @${createdUsername}.`

    toast.add({
      severity: 'success',
      summary: 'Registrasi Berhasil',
      detail: apiSuccess.value,
      life: 5000
    })

    // Reset Form
    formData.value = {
      username: '',
      fullName: '',
      email: '',
      password: ''
    }
    errors.value = {}

    emit('success')
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Terjadi kesalahan saat registrasi'
    apiError.value = errorMsg

    toast.add({
      severity: 'error',
      summary: 'Registrasi Gagal',
      detail: errorMsg,
      life: 5000
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <div class="icon-badge">
          <i class="pi pi-user-plus"></i>
        </div>
        <h2>Buat Akun Baru</h2>
        <p class="subtitle">Daftarkan diri Anda untuk mengakses layanan Dermawan Bank</p>
      </div>

      <!-- Feedback Banners -->
      <Message v-if="apiSuccess" severity="success" :closable="false" class="mb-4">
        {{ apiSuccess }}
      </Message>
      <Message v-if="apiError" severity="error" :closable="false" class="mb-4">
        {{ apiError }}
      </Message>

      <form @submit.prevent="handleRegister" class="register-form" novalidate>
        <!-- Username Field -->
        <div class="field-group">
          <label for="username">Username</label>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user"></i>
            </InputGroupAddon>
            <InputText
              id="username"
              v-model="formData.username"
              placeholder="Contoh: user123"
              :class="{ 'p-invalid': errors.username }"
              :disabled="isLoading"
            />
          </InputGroup>
          <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
        </div>

        <!-- Full Name Field -->
        <div class="field-group">
          <label for="fullName">Nama Lengkap</label>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-id-card"></i>
            </InputGroupAddon>
            <InputText
              id="fullName"
              v-model="formData.fullName"
              placeholder="Contoh: John Doe"
              :class="{ 'p-invalid': errors.fullName }"
              :disabled="isLoading"
            />
          </InputGroup>
          <small v-if="errors.fullName" class="p-error">{{ errors.fullName }}</small>
        </div>

        <!-- Email Field -->
        <div class="field-group">
          <label for="email">Email</label>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-envelope"></i>
            </InputGroupAddon>
            <InputText
              id="email"
              type="email"
              v-model="formData.email"
              placeholder="nama@email.com"
              :class="{ 'p-invalid': errors.email }"
              :disabled="isLoading"
            />
          </InputGroup>
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <!-- Password Field -->
        <div class="field-group">
          <label for="password">Password</label>
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock"></i>
            </InputGroupAddon>
            <Password
              id="password"
              v-model="formData.password"
              placeholder="Minimal 6 karakter"
              :feedback="false"
              toggleMask
              :class="{ 'p-invalid': errors.password }"
              :disabled="isLoading"
            />
          </InputGroup>
          <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="submit-button p-button-primary"
          :disabled="isLoading"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner mr-2"></i>
          <span>{{ isLoading ? 'Memproses...' : 'Daftar Sekarang' }}</span>
        </Button>
      </form>

      <div class="card-footer">
        <span>Sudah memiliki akun?</span>
        <a href="#" @click.prevent="emit('login-click')" class="login-link">Masuk di sini</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1.5rem;
}

.register-card {
  width: 100%;
  max-width: 460px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  padding: 2.25rem 2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: white;
}

.card-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.icon-badge {
  width: 56px;
  height: 56px;
  margin: 0 auto 1rem auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
}

.card-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.4rem 0;
}

.subtitle {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
}

:deep(.p-inputtext) {
  width: 100%;
  border-radius: 0 8px 8px 0;
  font-size: 0.95rem;
  padding: 0.65rem 0.85rem;
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

:deep(.p-inputtext:focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 1px #10b981;
  outline: none;
}

:deep(.p-inputgroup-addon) {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px 0 0 8px;
  color: #cbd5e1;
}

:deep(.p-password) {
  width: 100%;
}

:deep(.p-password input) {
  width: 100%;
  border-radius: 0 8px 8px 0;
}

.p-error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.submit-button {
  width: 100%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6);
    background: linear-gradient(135deg, #059669, #047857);
  }
}

.card-footer {
  margin-top: 1.75rem;
  text-align: center;
  font-size: 0.875rem;
  color: #94a3b8;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.25rem;
}

.login-link {
  color: #34d399;
  font-weight: 600;
  margin-left: 0.4rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
