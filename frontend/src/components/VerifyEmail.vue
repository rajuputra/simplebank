<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { verifyEmail } from '@/api/userService'

const route = useRoute()
const router = useRouter()

type VerifyState = 'loading' | 'success' | 'error'
const state = ref<VerifyState>('loading')
const errorMessage = ref('')

const performVerification = async () => {
  state.value = 'loading'
  errorMessage.value = ''

  const emailId = (route.query.emailId || route.query.email_id) as string | undefined
  const secretCode = (route.query.secretCode || route.query.secret_code) as string | undefined

  if (!emailId || !secretCode) {
    state.value = 'error'
    errorMessage.value = 'Link verifikasi tidak valid. Parameter emailId dan secretCode tidak ditemukan di URL.'
    return
  }

  try {
    const response = await verifyEmail({ emailId, secretCode })
    if (response.isVerified !== false) {
      state.value = 'success'
    } else {
      state.value = 'error'
      errorMessage.value = 'Verifikasi gagal. Kode rahasia atau ID email tidak valid atau sudah kadaluarsa.'
    }
  } catch (err: unknown) {
    state.value = 'error'
    errorMessage.value = err instanceof Error ? err.message : 'Terjadi kesalahan saat memverifikasi email.'
  }
}

onMounted(performVerification)

const goToLogin = () => router.push('/login')
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <!-- Brand Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-900/40 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-white">Simple Bank</h1>
        <p class="text-slate-400 text-sm mt-1">Verifikasi Alamat Email</p>
      </div>

      <!-- Verification Card -->
      <div class="bg-white rounded-2xl shadow-2xl shadow-black/30 p-8">

        <!-- ── LOADING STATE ── -->
        <div v-if="state === 'loading'" class="text-center py-4">
          <div class="relative inline-flex mb-6">
            <div class="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <span class="absolute -top-1 -right-1 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
            </span>
          </div>
          <h2 class="text-xl font-bold text-slate-800 mb-2">Memverifikasi Email...</h2>
          <p class="text-slate-500 text-sm">Mohon tunggu, kami sedang memvalidasi tautan verifikasi Anda.</p>
        </div>

        <!-- ── SUCCESS STATE ── -->
        <div v-else-if="state === 'success'" class="text-center py-4">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 mb-6 animate-bounce-once">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </div>

          <h2 class="text-xl font-bold text-slate-800 mb-2">Email Terverifikasi!</h2>
          <p class="text-slate-500 text-sm mb-6 leading-relaxed">
            Selamat! Alamat email Anda telah berhasil diverifikasi. Akun Simple Bank Anda kini aktif sepenuhnya.
          </p>

          <!-- Success Info Banner -->
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 text-left">
            <div class="flex items-start gap-3">
              <div class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p class="text-sm text-emerald-700">
                Silakan masuk menggunakan username dan password yang telah Anda daftarkan untuk mulai menggunakan layanan Simple Bank.
              </p>
            </div>
          </div>

          <button
            @click="goToLogin"
            class="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Lanjut ke Halaman Login →
          </button>
        </div>

        <!-- ── ERROR STATE ── -->
        <div v-else class="text-center py-4">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200">
              <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
          </div>

          <h2 class="text-xl font-bold text-slate-800 mb-2">Verifikasi Gagal</h2>
          <p class="text-slate-500 text-sm mb-5 leading-relaxed">
            Kami tidak dapat memverifikasi alamat email Anda.
          </p>

          <!-- Error Banner -->
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
            <div class="flex items-start gap-3">
              <div class="w-5 h-5 text-red-500 shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button
              @click="performVerification"
              class="w-full py-3 px-6 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Coba Lagi
            </button>
            <button
              @click="goToLogin"
              class="w-full py-3 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-xl transition-all duration-200"
            >
              Kembali ke Login
            </button>
          </div>
        </div>

      </div>

      <p class="text-center text-slate-500 text-xs mt-6">
        © 2025 Simple Bank. Sistem Perbankan Digital.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-once {
  0%, 100% { transform: scale(1); }
  40% { transform: scale(1.15); }
  70% { transform: scale(0.95); }
}
.animate-bounce-once {
  animation: bounce-once 0.5s ease-out;
}
</style>
