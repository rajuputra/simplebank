<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import store from '@/store'
import { updateUser } from '@/api/userService'
import type { pbUpdateUserRequest, pbUser } from '@/types/api'

const toast = useToast()

const currentUser = computed<pbUser | null>(() => store.state.user)

const form = ref({
  username: '',
  fullName: '',
  email: '',
  password: ''
})

const initial = ref({ username: '', fullName: '', email: '' })
const isLoading = ref(false)
const showPassword = ref(false)

const populateForm = () => {
  if (!currentUser.value) return
  const u = currentUser.value as Record<string, string>
  const username = u.username || ''
  const fullName = u.fullName || u.full_name || ''
  const email = u.email || ''
  form.value = { username, fullName, email, password: '' }
  initial.value = { username, fullName, email }
}

onMounted(populateForm)

const formattedCreatedAt = computed(() => {
  const date = currentUser.value?.createdAt
  if (!date || date.startsWith('0001')) return 'Tidak tersedia'
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date))
  } catch {
    return date
  }
})

const formattedPasswordChangedAt = computed(() => {
  const date = currentUser.value?.passwordChangedAt
  if (!date || date.startsWith('0001')) return 'Belum pernah diubah'
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
  } catch {
    return date
  }
})

const getChangedPayload = (): pbUpdateUserRequest => {
  const p: pbUpdateUserRequest = {
    username: form.value.username.trim() || initial.value.username // Backend gRPC ALWAYS requires username to identify the user
  }
  
  let hasChanges = false
  
  if (form.value.username.trim() !== initial.value.username) hasChanges = true
  
  if (form.value.fullName.trim() !== initial.value.fullName) {
    p.fullName = form.value.fullName.trim()
    hasChanges = true
  }
  
  if (form.value.email.trim() !== initial.value.email) {
    p.email = form.value.email.trim()
    hasChanges = true
  }
  
  if (form.value.password) {
    p.password = form.value.password
    hasChanges = true
  }
  
  // If no fields were actually changed, we return an empty object to trigger the "Tidak Ada Perubahan" toast
  if (!hasChanges) {
    return {} as pbUpdateUserRequest
  }
  
  return p
}

const handleSubmit = async () => {
  const payload = getChangedPayload()
  if (Object.keys(payload).length === 0) {
    toast.add({ severity: 'info', summary: 'Tidak Ada Perubahan', detail: 'Belum ada data yang diubah.', life: 3000 })
    return
  }
  isLoading.value = true
  try {
    const response = await updateUser(payload)
    if (response.user) {
      store.updateUserData({
        username: response.user.username,
        fullName: response.user.fullName,
        full_name: response.user.fullName,
        email: response.user.email,
        passwordChangedAt: response.user.passwordChangedAt,
        createdAt: response.user.createdAt
      })
    }
    toast.add({ severity: 'success', summary: 'Profil Diperbarui', detail: 'Data profil Anda berhasil disimpan.', life: 4000 })
    form.value.password = ''
    populateForm()
  } catch (err: unknown) {
    toast.add({ severity: 'error', summary: 'Gagal Memperbarui', detail: err instanceof Error ? err.message : 'Terjadi kesalahan.', life: 5000 })
  } finally {
    isLoading.value = false
  }
}

const userInitial = computed(() => {
  const name = form.value.fullName || form.value.username || 'U'
  return name.charAt(0).toUpperCase()
})
</script>

<template>
  <div class="max-w-3xl space-y-6">

    <!-- ─── Profile Header Card ─── -->
    <div class="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5"></div>
      <div class="absolute -bottom-10 -left-4 w-40 h-40 rounded-full bg-white/5"></div>

      <div class="relative flex items-center gap-5">
        <!-- Avatar -->
        <div class="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-black text-3xl text-white shadow-lg shrink-0 border border-white/30">
          {{ userInitial }}
        </div>
        <!-- User Info -->
        <div class="min-w-0">
          <p class="text-white/70 text-sm font-medium">Selamat datang kembali,</p>
          <h2 class="text-2xl font-bold text-white truncate">{{ form.fullName || form.username || 'User' }}</h2>
          <p class="text-white/60 text-sm truncate mt-0.5">{{ form.email || 'Email belum diatur' }}</p>
        </div>
        <!-- Verified Badge -->
        <div class="ml-auto shrink-0">
          <div class="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"/>
            </svg>
            <span class="text-white text-xs font-medium">Terverifikasi</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Account Metadata ─── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-400 font-medium">Akun Dibuat</p>
          <p class="text-sm font-semibold text-slate-700 truncate">{{ formattedCreatedAt }}</p>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-400 font-medium">Password Diubah</p>
          <p class="text-sm font-semibold text-slate-700 truncate">{{ formattedPasswordChangedAt }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Edit Profile Form ─── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Form Header -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-slate-800">Edit Profil</p>
          <p class="text-xs text-slate-400">Hanya field yang diubah yang akan disimpan</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <!-- Username -->
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-slate-700">Username</label>
            <div class="relative">
              <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                v-model="form.username"
                type="text"
                placeholder="Username"
                :disabled="isLoading"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
              />
            </div>
          </div>

          <!-- Full Name -->
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-slate-700">Nama Lengkap</label>
            <div class="relative">
              <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <input
                v-model="form.fullName"
                type="text"
                placeholder="Nama Lengkap"
                :disabled="isLoading"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-1.5 sm:col-span-2">
            <label class="block text-sm font-semibold text-slate-700">Alamat Email</label>
            <div class="relative">
              <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                placeholder="nama@email.com"
                :disabled="isLoading"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="space-y-1.5 sm:col-span-2">
            <label class="block text-sm font-semibold text-slate-700">
              Password Baru
              <span class="text-slate-400 font-normal ml-1">(opsional — kosongkan jika tidak ingin ubah)</span>
            </label>
            <div class="relative">
              <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Minimal 6 karakter"
                :disabled="isLoading"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-12 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-100 mt-6 gap-4">
          <p class="text-xs text-slate-400 text-center sm:text-left">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 inline mr-1 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            Hanya field yang berubah yang akan dikirim ke server
          </p>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
          >
            <svg v-if="isLoading" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>

  </div>
</template>
