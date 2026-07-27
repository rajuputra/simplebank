import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { RpcStatus } from '../types/api'
import store from '@/store'

// Base URLs for gRPC (Auth/Users) and Gin (Accounts/Transfers) backends
const grpcBaseURL = import.meta.env.VITE_API_GRPC_BASE_URL || 'http://localhost:8080/v1'
const ginBaseURL = import.meta.env.VITE_API_GIN_BASE_URL || 'http://localhost:8081'

/**
 * 1. gRPC Gateway Client (Port 8080/v1 - Auth & Users)
 */
export const apiClientGrpc = axios.create({
  baseURL: grpcBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 2. Gin Server Client (Port 8081 without /v1 - Accounts & Transfers)
 */
export const apiClientGin = axios.create({
  baseURL: ginBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor helper to inject Bearer Token automatically
const attachBearerToken = (config: InternalAxiosRequestConfig) => {
  const token =
    store.state.accessToken ||
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token')

  if (token) {
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', 'Bearer ' + token)
    } else {
      config.headers.Authorization = 'Bearer ' + token
      config.headers['Authorization'] = 'Bearer ' + token
    }
  }
  return config
}

apiClientGrpc.interceptors.request.use(attachBearerToken, (error) => Promise.reject(error))
apiClientGin.interceptors.request.use(attachBearerToken, (error) => Promise.reject(error))

import router from '@/router'

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const handleResponseError = async (error: any) => {
  const originalRequest = error.config

  // If the error is 401 and we haven't already retried this request
  if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
      // If a refresh is already in progress, wait for it to complete
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', 'Bearer ' + token)
          } else {
            originalRequest.headers.Authorization = 'Bearer ' + token
          }
          return axios(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken =
      store.state.refreshToken ||
      localStorage.getItem('refresh_token')

    if (!refreshToken) {
      isRefreshing = false
      store.clearUser()
      router.push('/login')
      return Promise.reject(error)
    }

    try {
      // Call the renew token endpoint directly using axios to avoid circular dependency loops
      const response = await axios.post(ginBaseURL + '/tokens/renew_access', {
        refresh_token: refreshToken
      })

      const newAccessToken = response.data.access_token
      
      // Update store and storage
      store.setUser(
        store.state.user || { username: '', full_name: '', email: '' },
        newAccessToken,
        refreshToken
      )

      if (typeof originalRequest.headers.set === 'function') {
        originalRequest.headers.set('Authorization', 'Bearer ' + newAccessToken)
      } else {
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken
      }

      processQueue(null, newAccessToken)
      return axios(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError as Error, null)
      store.clearUser()
      router.push('/login')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(error)
}

apiClientGrpc.interceptors.response.use((response) => response, handleResponseError)
apiClientGin.interceptors.response.use((response) => response, handleResponseError)

/**
 * Helper to extract error message from API error responses
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const rpcErr = error.response?.data as RpcStatus | { message?: string } | undefined
    if (rpcErr?.message) {
      return rpcErr.message
    }
    if (typeof error.response?.data === 'string' && error.response.data.trim()) {
      return error.response.data
    }
    return error.message || 'Terjadi kesalahan pada server'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Terjadi kesalahan tidak terduga'
}

export default apiClientGrpc
