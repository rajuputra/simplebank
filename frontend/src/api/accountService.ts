import { apiClientGin, getApiErrorMessage } from './client'
import type { Account, CreateAccountRequest, ListAccountsParams } from '../types/api'

/**
 * Service for Account operations (Gin Backend: Port 8081)
 */

/**
 * Endpoint: GET /accounts
 * Lists all accounts belonging to the authenticated user.
 */
export async function listAccounts(params: ListAccountsParams = { page_id: 1, page_size: 10 }): Promise<Account[]> {
  try {
    const response = await apiClientGin.get<Account[] | { accounts: Account[] }>('/accounts', {
      params: {
        page_id: params.page_id || 1,
        page_size: params.page_size || 10
      }
    })

    if (Array.isArray(response.data)) {
      return response.data
    }
    if (response.data && Array.isArray((response.data as { accounts: Account[] }).accounts)) {
      return (response.data as { accounts: Account[] }).accounts
    }
    return []
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: POST /accounts
 * Creates a new bank account with specified currency.
 */
export async function createAccount(data: CreateAccountRequest): Promise<Account> {
  try {
    const response = await apiClientGin.post<Account | { account: Account }>('/accounts', data)

    if ('id' in response.data) {
      return response.data as Account
    }
    if (response.data && 'account' in response.data) {
      return (response.data as { account: Account }).account
    }
    return response.data as unknown as Account
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: GET /accounts/:id
 * Fetches single account details by ID.
 */
export async function getAccount(id: number): Promise<Account> {
  try {
    const response = await apiClientGin.get<Account | { account: Account }>(`/accounts/${id}`)
    if ('id' in response.data) {
      return response.data as Account
    }
    if (response.data && 'account' in response.data) {
      return (response.data as { account: Account }).account
    }
    return response.data as unknown as Account
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: DELETE /accounts/:id
 * Deletes an account by ID.
 */
export async function deleteAccount(id: number): Promise<void> {
  try {
    await apiClientGin.delete(`/accounts/${id}`)
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: POST /deposits
 * Deskripsi: Menambah saldo (Top-up) ke rekening yang ada.
 */
export async function createDeposit(data: { account_id: number; amount: number }): Promise<any> {
  try {
    const response = await apiClientGin.post('/deposits', data)
    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

export const accountService = {
  listAccounts,
  createAccount,
  getAccount,
  deleteAccount,
  createDeposit
}

export default accountService
