<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { listAccounts } from '@/api/accountService'
import { createTransfer } from '@/api/transferService'
import type { Account, CreateTransferRequest } from '@/types/api'

const toast = useToast()

// State
const accounts = ref<Account[]>([])
const isLoadingAccounts = ref(true)

const fromAccount = ref<Account | null>(null)
const toAccountId = ref('')
const amount = ref('')
const isSubmitting = ref(false)

// Auto-lock currency from selected source account
const sourceCurrency = computed(() => fromAccount.value?.currency || '')

// Load accounts on mount
const loadAccounts = async () => {
  isLoadingAccounts.value = true
  try {
    accounts.value = await listAccounts({ page_id: 1, page_size: 10 })
    if (accounts.value.length > 0 && !fromAccount.value) {
      fromAccount.value = accounts.value[0]
    }
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Memuat Rekening',
      detail: err instanceof Error ? err.message : 'Terjadi kesalahan.',
      life: 4000
    })
  } finally {
    isLoadingAccounts.value = false
  }
}

onMounted(loadAccounts)

// Sync currency when account selection changes
watch(fromAccount, (newAcc) => {
  // Reset amount on source change
  amount.value = ''
  toAccountId.value = ''
  if (!newAcc) return
})

// Format balance for display in dropdown
const formatAccountOption = (acc: Account) => {
  try {
    const bal = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: acc.currency,
      maximumFractionDigits: 2
    }).format(acc.balance)
    return `Rekening #${String(acc.id).padStart(6, '0')} · ${acc.currency} · ${bal}`
  } catch {
    return `Rekening #${acc.id} · ${acc.currency}`
  }
}

const formatBalance = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString()}`
  }
}

// Currency config colors
const currencyColor: Record<string, string> = {
  USD: 'bg-blue-100 text-blue-700 border-blue-200',
  EUR: 'bg-violet-100 text-violet-700 border-violet-200',
  CAD: 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

const getCurrencyColor = (currency: string) => currencyColor[currency] || 'bg-slate-100 text-slate-700 border-slate-200'

// Validation & Submit
const handleTransfer = async () => {
  if (!fromAccount.value) {
    toast.add({ severity: 'warn', summary: 'Validasi', detail: 'Pilih rekening sumber terlebih dahulu.', life: 3000 })
    return
  }

  const parsedToId = parseInt(toAccountId.value, 10)
  if (!toAccountId.value || isNaN(parsedToId) || parsedToId <= 0) {
    toast.add({ severity: 'warn', summary: 'Validasi', detail: 'Masukkan ID rekening tujuan yang valid.', life: 3000 })
    return
  }

  if (parsedToId === fromAccount.value.id) {
    toast.add({ severity: 'warn', summary: 'Validasi', detail: 'Rekening tujuan tidak boleh sama dengan rekening sumber.', life: 3500 })
    return
  }

  const parsedAmount = parseFloat(amount.value)
  if (!amount.value || isNaN(parsedAmount) || parsedAmount <= 0) {
    toast.add({ severity: 'warn', summary: 'Validasi', detail: 'Masukkan nominal transfer yang valid (lebih dari 0).', life: 3000 })
    return
  }

  if (parsedAmount > fromAccount.value.balance) {
    toast.add({ severity: 'error', summary: 'Saldo Tidak Cukup', detail: `Saldo ${sourceCurrency.value} Anda tidak mencukupi untuk transfer ini.`, life: 4000 })
    return
  }

  isSubmitting.value = true

  try {
    const payload: CreateTransferRequest = {
      from_account_id: fromAccount.value.id,
      to_account_id: parsedToId,
      amount: parsedAmount,
      currency: sourceCurrency.value
    }

    const result = await createTransfer(payload)

    toast.add({
      severity: 'success',
      summary: 'Transfer Berhasil!',
      detail: `${formatBalance(result.amount, result.currency)} berhasil dikirim ke rekening #${result.to_account_id}.`,
      life: 5000
    })

    // Reset form
    toAccountId.value = ''
    amount.value = ''

    // Refresh balances
    await loadAccounts()
  } catch (err: unknown) {
    toast.add({
      severity: 'error',
      summary: 'Transfer Gagal',
      detail: err instanceof Error ? err.message : 'Transaksi tidak dapat diproses.',
      life: 6000
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">

    <!-- ─── Page Header ─── -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-slate-800">Transfer Dana</h2>
      <p class="text-slate-500 text-sm mt-0.5">Kirim saldo antar rekening Simple Bank secara instan</p>
    </div>

    <!-- ─── Transfer Form Card ─── -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      <!-- Card Header -->
      <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-slate-800">Form Transfer</p>
          <p class="text-xs text-slate-400">Isi detail transfer di bawah ini</p>
        </div>
      </div>

      <div class="p-6 space-y-5">

        <!-- Loading -->
        <div v-if="isLoadingAccounts" class="text-center py-8 text-slate-400">
          <svg class="w-6 h-6 animate-spin mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p class="text-sm">Memuat daftar rekening...</p>
        </div>

        <!-- No accounts -->
        <div v-else-if="accounts.length === 0" class="text-center py-8">
          <p class="text-slate-500 text-sm">Anda belum memiliki rekening. Buat rekening terlebih dahulu di halaman Dashboard.</p>
        </div>

        <template v-else>
          <!-- FIELD 1: Source Account -->
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-slate-700">Rekening Sumber (Pengirim)</label>
            <div class="relative">
              <select
                v-model="fromAccount"
                class="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option v-for="acc in accounts" :key="acc.id" :value="acc">
                  {{ formatAccountOption(acc) }}
                </option>
              </select>
              <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            <!-- Source Account Balance Info -->
            <div v-if="fromAccount" class="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-xs text-slate-500">Saldo tersedia:</span>
              <span class="text-sm font-bold text-slate-800">{{ formatBalance(fromAccount.balance, fromAccount.currency) }}</span>
            </div>
          </div>

          <!-- ─── CURRENCY INFO BANNER ─── -->
          <div v-if="sourceCurrency" class="flex items-start gap-3 px-4 py-3 rounded-xl border"
            :class="getCurrencyColor(sourceCurrency)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p class="text-sm font-semibold">Transfer Mata Uang Sama</p>
              <p class="text-xs mt-0.5 opacity-80">
                Transfer hanya berlaku untuk sesama rekening berdenominasi <strong>{{ sourceCurrency }}</strong>.
                Backend akan menolak transfer antar mata uang yang berbeda.
              </p>
            </div>
          </div>

          <!-- FIELD 2: Destination Account ID -->
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-slate-700">ID Rekening Tujuan</label>
            <div class="relative">
              <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                v-model="toAccountId"
                type="number"
                min="1"
                placeholder="Contoh: 42"
                :disabled="isSubmitting"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
              />
            </div>
            <p class="text-xs text-slate-400">Masukkan ID numerik rekening penerima (tersedia di halaman Dashboard mereka).</p>
          </div>

          <!-- FIELD 3: Amount -->
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-slate-700">Nominal Transfer</label>
            <div class="relative flex">
              <!-- Currency Prefix -->
              <div class="shrink-0 flex items-center px-4 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-sm font-bold text-slate-600">
                {{ sourceCurrency || '—' }}
              </div>
              <input
                v-model="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                :disabled="isSubmitting || !fromAccount"
                class="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
              />
            </div>

            <!-- Quick Amount Buttons -->
            <div v-if="fromAccount" class="flex flex-wrap gap-2 mt-2">
              <button
                v-for="pct in [25, 50, 75, 100]"
                :key="pct"
                type="button"
                @click="amount = String((fromAccount!.balance * pct / 100).toFixed(2))"
                class="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
              >
                {{ pct }}%
              </button>
            </div>
          </div>

          <!-- ─── Submit Button ─── -->
          <div class="pt-2">
            <button
              @click="handleTransfer"
              :disabled="isSubmitting || !fromAccount || !toAccountId || !amount"
              class="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              {{ isSubmitting ? 'Memproses Transfer...' : `Kirim Transfer ${sourceCurrency}` }}
            </button>

            <p class="text-center text-xs text-slate-400 mt-3">
              Transfer bersifat final dan tidak dapat dibatalkan. Pastikan detail sudah benar.
            </p>
          </div>

        </template>
      </div>
    </div>

    <!-- ─── Help Card ─── -->
    <div class="mt-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p class="text-sm font-semibold text-slate-700">Kebijakan Transfer</p>
        <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">
          Transfer antar rekening dengan mata uang <strong>berbeda</strong> tidak diizinkan oleh sistem.
          Anda hanya dapat mengirim saldo ke rekening lain yang menggunakan mata uang yang sama dengan rekening sumber.
        </p>
      </div>
    </div>

  </div>
</template>
