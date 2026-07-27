<script setup lang="ts">
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const toAccount = ref('')
const amount = ref('')
const notes = ref('')
const isLoading = ref(false)

const handleTransfer = () => {
  if (!toAccount.value || !amount.value) {
    toast.add({
      severity: 'error',
      summary: 'Form Belum Lengkap',
      detail: 'Rekening tujuan dan nominal transfer wajib diisi.',
      life: 3000
    })
    return
  }

  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
    toast.add({
      severity: 'success',
      summary: 'Transfer Berhasil',
      detail: `Transfer sebesar Rp ${Number(amount.value).toLocaleString('id-ID')} ke rekening ${toAccount.value} berhasil diproses.`,
      life: 4000
    })
    toAccount.value = ''
    amount.value = ''
    notes.value = ''
  }, 1000)
}
</script>

<template>
  <div class="transfer-wrapper">
    <Card class="transfer-card">
      <template #title>
        <div class="card-title">
          <i class="pi pi-send text-emerald"></i>
          <span>Transfer Dana</span>
        </div>
      </template>
      <template #subtitle>
        Kirim saldo ke sesama pengguna Simple Bank secara instan dan aman.
      </template>
      <template #content>
        <form @submit.prevent="handleTransfer" class="transfer-form">
          <div class="field-group">
            <label for="toAccount">Rekening / Username Tujuan</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user"></i>
              </InputGroupAddon>
              <InputText
                id="toAccount"
                v-model="toAccount"
                placeholder="Contoh: user123"
              />
            </InputGroup>
          </div>

          <div class="field-group">
            <label for="amount">Nominal Transfer (Rp)</label>
            <InputGroup>
              <InputGroupAddon>
                <span>Rp</span>
              </InputGroupAddon>
              <InputText
                id="amount"
                type="number"
                v-model="amount"
                placeholder="Contoh: 100000"
              />
            </InputGroup>
          </div>

          <div class="field-group">
            <label for="notes">Catatan (Opsional)</label>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-file-edit"></i>
              </InputGroupAddon>
              <InputText
                id="notes"
                v-model="notes"
                placeholder="Contoh: Bayar makan malam"
              />
            </InputGroup>
          </div>

          <Button
            type="submit"
            label="Kirim Transfer"
            icon="pi pi-send"
            class="p-button-success submit-btn"
            :loading="isLoading"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.transfer-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.transfer-card {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: #0f172a;
}

.text-emerald {
  color: #10b981;
}

.transfer-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

:deep(.p-inputtext) {
  width: 100%;
}

.submit-btn {
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  border: none !important;
}
</style>
