import { apiClientGin, getApiErrorMessage } from './client'
import type { CreateTransferRequest, Transfer } from '../types/api'

/**
 * Service for Transfer operations (Gin Backend: Port 8081)
 */

/**
 * Endpoint: POST /transfers
 * Executes a fund transfer between accounts.
 */
export async function createTransfer(data: CreateTransferRequest): Promise<Transfer> {
  try {
    const response = await apiClientGin.post<Transfer | { transfer: Transfer }>('/transfers', data)

    if ('id' in response.data) {
      return response.data as Transfer
    }
    if (response.data && 'transfer' in response.data) {
      return (response.data as { transfer: Transfer }).transfer
    }
    return response.data as unknown as Transfer
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

export const transferService = {
  createTransfer
}

export default transferService
