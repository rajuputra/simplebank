<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { listAccounts, createAccount, getAccount, deleteAccount, createDeposit } from '@/api/accountService'
import type { Account } from '@/types/api'
import { formatDate } from '@/utils/date'

const toast = useToast()

const accounts = ref<Account[]>([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const selectedCurrency = ref('USD')
const isCreating = ref(false)

// Delete Account state
const isDeleteModalOpen = ref(false)
const accountToDelete = ref<Account | null>(null)
const isDeleting = ref(false)

// Detail Account state
const isDetailModalOpen = ref(false)
const accountDetail = ref<Account | null>(null)
const isDetailLoading = ref(false)

// Top-up Account state
const isTopupModalOpen = ref(false)
const accountToTopup = ref<Account | null>(null)
const topupAmount = ref<number | null>(null)
const isToppingUp = ref(false)

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'CAD']
const MAX_ACCOUNTS = 3

// Computed: currencies user doesn't have yet
const availableCurrencies = computed(() =>
  SUPPORTED_CURRENCIES.filter((c) => !accounts.value.some((a) => a.currency === c))
)

// Computed: can create more accounts?
const canCreateAccount = computed(() => accounts.value.length < MAX_ACCOUNTS)

const loadAccounts = async () => {
  isLoading.value = true
  try {
    accounts.value = await listAccounts({ page_id: 1, page_size: 10 })
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Memuat Rekening',
      detail: err instanceof Error ? err.message : 'Terjadi kesalahan.',
      life: 4000
    })
  } finally {
    isLoading.value = false
  }
}

onMounted(loadAccounts)

const openModal = () => {
  if (availableCurrencies.value.length > 0) {
    selectedCurrency.value = availableCurrencies.value[0]
  }
  isModalOpen.value = true
}

const handleCreateAccount = async () => {
  if (!selectedCurrency.value) return
  isCreating.value = true
  try {
    const newAcc = await createAccount({ currency: selectedCurrency.value })
    toast.add({
      severity: 'success',
      summary: 'Rekening Berhasil Dibuat',
      detail: `Rekening ${newAcc.currency} #${newAcc.id} kini aktif.`,
      life: 4000
    })
    isModalOpen.value = false
    await loadAccounts()
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Membuat Rekening',
      detail: err instanceof Error ? err.message : 'Terjadi kesalahan.',
      life: 5000
    })
  } finally {
    isCreating.value = false
  }
}

const openDeleteModal = (acc: Account) => {
  accountToDelete.value = acc
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!accountToDelete.value) return
  isDeleting.value = true
  try {
    await deleteAccount(accountToDelete.value.id)
    toast.add({
      severity: 'success',
      summary: 'Rekening Dihapus',
      detail: `Rekening ${accountToDelete.value.currency} #${accountToDelete.value.id} berhasil ditutup.`,
      life: 4000
    })
    isDeleteModalOpen.value = false
    await loadAccounts()
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Menghapus Rekening',
      detail: err instanceof Error ? err.message : 'Terjadi kesalahan.',
      life: 5000
    })
  } finally {
    isDeleting.value = false
  }
}

const openDetailModal = async (acc: Account) => {
  isDetailModalOpen.value = true
  isDetailLoading.value = true
  accountDetail.value = null
  try {
    const response = await getAccount(acc.id)
    accountDetail.value = response
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Memuat Detail',
      detail: err instanceof Error ? err.message : 'Terjadi kesalahan.',
      life: 4000
    })
    isDetailModalOpen.value = false
  } finally {
    isDetailLoading.value = false
  }
}

const openTopupModal = (acc: Account) => {
  accountToTopup.value = acc
  topupAmount.value = null
  isTopupModalOpen.value = true
}

const handleTopup = async () => {
  if (!accountToTopup.value || !topupAmount.value || topupAmount.value <= 0) return
  isToppingUp.value = true
  try {
    await createDeposit({ account_id: accountToTopup.value.id, amount: topupAmount.value })
    toast.add({
      severity: 'success',
      summary: 'Top-up Berhasil',
      detail: `Berhasil menambahkan ${formatBalance(topupAmount.value, accountToTopup.value.currency)} ke rekening.`,
      life: 4000
    })
    isTopupModalOpen.value = false
    await loadAccounts()
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Top-up Gagal',
      detail: err instanceof Error ? err.message : 'Terjadi kesalahan.',
      life: 5000
    })
  } finally {
    isToppingUp.value = false
  }
}

const formatBalance = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

// Per-currency card gradient + accent config
const currencyConfig: Record<string, { gradient: string; badge: string; icon: string }> = {
  USD: {
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    badge: 'bg-blue-500/30 text-blue-100 ring-1 ring-blue-400/30',
    icon: '$'
  },
  EUR: {
    gradient: 'from-violet-600 via-purple-700 to-indigo-800',
    badge: 'bg-violet-500/30 text-violet-100 ring-1 ring-violet-400/30',
    icon: '€'
  },
  CAD: {
    gradient: 'from-emerald-500 via-teal-600 to-green-800',
    badge: 'bg-emerald-400/30 text-emerald-100 ring-1 ring-emerald-400/30',
    icon: 'C$'
  }
}

const getConfig = (currency: string) =>
  currencyConfig[currency] || {
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    badge: 'bg-slate-400/20 text-slate-100',
    icon: '#'
  }
</script>

<template>
  <div class="space-y-6">
    <!-- ─── Page Header ─── -->
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Rekening Saya</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          {{ accounts.length }}/{{ MAX_ACCOUNTS }} rekening aktif ·
          <span class="text-emerald-600 font-medium">USD, EUR, CAD</span> didukung
        </p>
      </div>
      </div>

    <!-- ─── Loading State ─── -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="i in 3" :key="i" class="h-52 bg-slate-200 rounded-2xl animate-pulse"></div>
    </div>

    <!-- ─── Empty State ─── -->
    <div
      v-else-if="accounts.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <div class="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-10 h-10 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-700 mb-1">Belum Ada Rekening</h3>
      <p class="text-slate-400 text-sm mb-6 max-w-sm">
        Anda belum memiliki rekening aktif. Buka rekening baru dalam mata uang USD, EUR, atau CAD
        untuk mulai bertransaksi.
      </p>
      <button
        @click="openModal"
        class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Buka Rekening Pertama
      </button>
    </div>

    <!-- ─── Account Cards Grid ─── -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="acc in accounts"
        :key="acc.id"
        class="relative rounded-2xl p-6 text-white overflow-hidden shadow-xl hover:-translate-y-1 transition-transform duration-200 cursor-default select-none"
        :class="`bg-gradient-to-br ${getConfig(acc.currency).gradient}`"
      >
        <!-- Background Decorative Circles -->
        <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5"></div>
        <div class="absolute -bottom-8 -right-4 w-40 h-40 rounded-full bg-white/5"></div>

        <!-- Card Header: Bank Name + Currency Badge -->
        <div class="relative flex items-center justify-between mb-6">
          <div class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span class="text-white/70 text-sm font-medium">Simple Bank</span>
          </div>
          <div class="flex items-center gap-2">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-bold tracking-wider"
              :class="getConfig(acc.currency).badge"
            >
              {{ acc.currency }}
            </span>
            <button @click.stop="openTopupModal(acc)" class="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-emerald-500 hover:text-white text-white/70 backdrop-blur-sm transition-colors border border-white/20 hover:border-emerald-500" title="Top-up Saldo">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button
              @click.stop="openDetailModal(acc)"
              class="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-blue-500 hover:text-white text-white/70 backdrop-blur-sm transition-colors border border-white/20 hover:border-blue-500"
              title="Detail Rekening"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button
              @click.stop="openDeleteModal(acc)"
              class="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 hover:text-white text-white/70 backdrop-blur-sm transition-colors border border-white/20 hover:border-red-500"
              title="Hapus Rekening"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 6h18" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Balance -->
        <div class="relative mb-6">
          <p class="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">
            Saldo Tersedia
          </p>
          <p class="text-3xl font-bold tracking-tight">
            {{ formatBalance(acc.balance, acc.currency) }}
          </p>
        </div>

        <!-- Card Footer: Owner + Account ID + Date -->
        <div class="relative flex items-end justify-between">
          <div>
            <p class="text-white/50 text-xs uppercase tracking-wider mb-0.5">Pemilik</p>
            <p class="text-white font-semibold text-sm">{{ acc.owner }}</p>
          </div>
          <div class="text-right">
            <p class="text-white/50 text-xs uppercase tracking-wider mb-0.5">Rekening</p>
            <p class="text-white font-mono text-sm">#{{ String(acc.id).padStart(6, '0') }}</p>
          </div>
        </div>

        <!-- Created Date Chip -->
        <div class="relative mt-4 pt-4 border-t border-white/10 flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5 text-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span class="text-white/40 text-xs">Dibuat {{ formatDate(acc.created_at) }}</span>
        </div>
      </div>

      <!-- Add Account Card (Visible only when accounts > 0 and < MAX_ACCOUNTS) -->
      <button
        v-if="canCreateAccount"
        @click="openModal"
        class="group relative rounded-2xl p-6 text-slate-400 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-white hover:border-emerald-500 hover:text-emerald-600 flex flex-col items-center justify-center min-h-[200px]"
      >
        <div class="w-14 h-14 rounded-full bg-slate-200/50 flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <p class="font-bold text-lg">Buka Rekening Baru</p>
        <p class="text-xs text-slate-400 mt-1">USD, EUR, atau CAD</p>
      </button>
    </div>

    <!-- ─── Summary Card (when accounts exist) ─── -->
    <div v-if="accounts.length > 0 && !isLoading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
          Total Rekening
        </p>
        <p class="text-2xl font-bold text-slate-800">
          {{ accounts.length }}<span class="text-slate-400 text-lg">/3</span>
        </p>
      </div>
      <div
        v-for="acc in accounts"
        :key="`summary-${acc.id}`"
        class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
      >
        <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
          {{ acc.currency }}
        </p>
        <p class="text-lg font-bold text-slate-800 truncate">
          {{ formatBalance(acc.balance, acc.currency) }}
        </p>
      </div>
    </div>

    <!-- ─── CREATE ACCOUNT MODAL ─── -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="isModalOpen = false"
        ></div>

        <!-- Modal Card -->
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Buka Rekening Baru</h3>
              <p class="text-sm text-slate-400 mt-0.5">
                Pilih mata uang rekening yang ingin dibuat
              </p>
            </div>
            <button
              @click="isModalOpen = false"
              class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-3">
            <p class="text-sm text-slate-500 mb-4">
              Mata uang yang tersedia (belum memiliki rekening):
            </p>
            <button
              v-for="currency in availableCurrencies"
              :key="currency"
              @click="selectedCurrency = currency"
              class="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all duration-150"
              :class="
                selectedCurrency === currency
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              "
            >
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md"
                :class="`bg-gradient-to-br ${getConfig(currency).gradient}`"
              >
                {{ getConfig(currency).icon }}
              </div>
              <div class="text-left">
                <p class="font-semibold text-slate-800">{{ currency }}</p>
                <p class="text-xs text-slate-400">
                  {{
                    currency === 'USD'
                      ? 'US Dollar'
                      : currency === 'EUR'
                        ? 'Euro'
                        : 'Canadian Dollar'
                  }}
                </p>
              </div>
              <div class="ml-auto">
                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="
                    selectedCurrency === currency
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-slate-300'
                  "
                >
                  <svg
                    v-if="selectedCurrency === currency"
                    class="w-3 h-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            </button>

            <div
              v-if="availableCurrencies.length === 0"
              class="text-center py-6 text-slate-400 text-sm"
            >
              Semua mata uang yang tersedia (USD, EUR, CAD) sudah memiliki rekening.
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
            <button
              @click="isModalOpen = false"
              :disabled="isCreating"
              class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              @click="handleCreateAccount"
              :disabled="isCreating || !selectedCurrency || availableCurrencies.length === 0"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <svg
                v-if="isCreating"
                class="w-4 h-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {{ isCreating ? 'Membuat...' : 'Buat Rekening' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ─── DELETE ACCOUNT MODAL ─── -->
    <Teleport to="body">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="isDeleteModalOpen = false"
        ></div>
        <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-6 text-center">
            <div
              class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-7 h-7 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-800 mb-2">Tutup Rekening?</h3>
            <p class="text-sm text-slate-500 mb-6">
              Apakah Anda yakin ingin menutup rekening
              <strong class="text-slate-800"
                >{{ accountToDelete?.currency }} #{{
                  String(accountToDelete?.id).padStart(6, '0')
                }}</strong
              >? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div class="flex items-center gap-3">
              <button
                @click="isDeleteModalOpen = false"
                :disabled="isDeleting"
                class="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                @click="confirmDelete"
                :disabled="isDeleting"
                class="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-200 transition-all disabled:opacity-50"
              >
                <svg v-if="isDeleting" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ─── DETAIL ACCOUNT MODAL ─── -->
    <Teleport to="body">
      <div v-if="isDetailModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="isDetailModalOpen = false"
        ></div>
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-800">Detail Rekening</h3>
            <button @click="isDetailModalOpen = false" class="text-slate-400 hover:text-slate-600">
              <svg
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <div v-if="isDetailLoading" class="flex justify-center items-center py-10">
              <svg class="w-8 h-8 text-emerald-500 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <div v-else-if="accountDetail" class="space-y-5">
              <div
                class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center"
              >
                <div class="text-sm text-slate-500 font-medium whitespace-nowrap">Nomor Rekening</div>
                <div class="font-mono font-bold text-slate-800 text-lg truncate ml-2">
                  #{{ String(accountDetail.id).padStart(6, '0') }}
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between text-sm border-b border-slate-100 pb-2">
                  <span class="text-slate-500">Mata Uang</span>
                  <span class="font-bold text-slate-800">{{ accountDetail.currency }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-slate-100 pb-2">
                  <span class="text-slate-500">Pemilik</span>
                  <span class="font-semibold text-slate-800">{{ accountDetail.owner }}</span>
                </div>
                <div class="flex justify-between text-sm border-b border-slate-100 pb-2">
                  <span class="text-slate-500">Saldo</span>
                  <span class="font-bold text-emerald-600">{{
                    formatBalance(accountDetail.balance, accountDetail.currency)
                  }}</span>
                </div>
                <div class="flex justify-between text-sm pb-2">
                  <span class="text-slate-500">Dibuat Pada</span>
                  <span class="font-medium text-slate-800">{{
                    formatDate(accountDetail.created_at)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ─── TOP-UP ACCOUNT MODAL ─── -->
    <Teleport to="body">
      <div v-if="isTopupModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="isTopupModalOpen = false"></div>
        <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-800">Top-up Saldo</h3>
            <button @click="isTopupModalOpen = false" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="p-6">
            <p class="text-sm text-slate-500 mb-4">
              Masukkan nominal uang yang ingin ditambahkan ke rekening <strong class="text-slate-800">{{ accountToTopup?.currency }} #{{ String(accountToTopup?.id).padStart(6, '0') }}</strong>.
            </p>
            <div class="mb-6 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-slate-500 font-semibold">{{ accountToTopup?.currency }}</span>
              </div>
              <input 
                v-model.number="topupAmount"
                type="number"
                min="1"
                class="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-semibold text-slate-800 text-lg"
                placeholder="0.00"
              />
            </div>
            <div class="flex items-center gap-3">
              <button @click="isTopupModalOpen = false" :disabled="isToppingUp" class="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
                Batal
              </button>
              <button @click="handleTopup" :disabled="isToppingUp || !topupAmount || topupAmount <= 0" class="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="isToppingUp" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Top-up
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>
