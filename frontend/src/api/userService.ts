import { apiClientGrpc, getApiErrorMessage } from './client'
import type {
  pbCreateUserRequest,
  pbCreateUserResponse,
  pbLoginUserRequest,
  pbLoginUserResponse,
  pbUpdateUserRequest,
  pbUpdateUserResponse,
  pbVerifyEmailParams,
  pbVerifyEmailResponse,
  RenewAccessTokenRequest,
  RenewAccessTokenResponse
} from '../types/api'

/**
 * Service for Auth & User operations (gRPC Backend Gateway: Port 8080/v1)
 */

/**
 * Endpoint: POST /v1/create_user
 */
export async function createUser(data: pbCreateUserRequest): Promise<pbCreateUserResponse> {
  try {
    const response = await apiClientGrpc.post<pbCreateUserResponse>('/create_user', data)
    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: POST /v1/login_user
 */
export async function loginUser(data: pbLoginUserRequest): Promise<pbLoginUserResponse> {
  try {
    const response = await apiClientGrpc.post<pbLoginUserResponse>('/login_user', data)

    const resData = response.data as any
    const accessToken = resData.access_token || resData.accessToken
    const refreshToken = resData.refresh_token || resData.refreshToken

    if (accessToken) {
      localStorage.setItem('access_token', accessToken)
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }

    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: PATCH /v1/update_user
 */
export async function updateUser(data: pbUpdateUserRequest): Promise<pbUpdateUserResponse> {
  try {
    const response = await apiClientGrpc.patch<pbUpdateUserResponse>('/update_user', data)
    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: GET /v1/verify_email
 */
export async function verifyEmail(params: pbVerifyEmailParams): Promise<pbVerifyEmailResponse> {
  try {
    const response = await apiClientGrpc.get<pbVerifyEmailResponse>('/verify_email', {
      params
    })
    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

/**
 * Endpoint: POST /v1/tokens/renew_access_token
 */
export async function renewAccessToken(data: RenewAccessTokenRequest): Promise<RenewAccessTokenResponse> {
  try {
    const response = await apiClientGrpc.post<RenewAccessTokenResponse>('/tokens/renew_access_token', data)
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
    }
    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error)
    throw new Error(message)
  }
}

export const userService = {
  createUser,
  loginUser,
  updateUser,
  verifyEmail,
  renewAccessToken
}

export default userService
