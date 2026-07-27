/**
 * Simple Bank API v1.2 - TypeScript Interfaces
 */

// User model definition
export interface pbUser {
  username?: string
  fullName?: string
  email?: string
  passwordChangedAt?: string
  createdAt?: string
}

// Request and Response for /v1/create_user
export interface pbCreateUserRequest {
  username: string
  fullName: string
  email: string
  password: string
}

export interface pbCreateUserResponse {
  user?: pbUser
}

// Request and Response for /v1/login_user
export interface pbLoginUserRequest {
  username: string
  password: string
}

export interface pbLoginUserResponse {
  user?: pbUser
  sessionId?: string
  accessToken?: string
  refreshToken?: string
  accessTokenExpiresAt?: string
  refreshTokenExpiresAt?: string
}

// Request and Response for /v1/update_user
export interface pbUpdateUserRequest {
  username?: string
  fullName?: string
  email?: string
  password?: string
}

export interface pbUpdateUserResponse {
  user?: pbUser
}

// Parameters and Response for /v1/verify_email
export interface pbVerifyEmailParams {
  emailId?: string | number
  secretCode?: string
}

export interface pbVerifyEmailResponse {
  isVerified?: boolean
}

// Account Interface & API Types
export interface Account {
  id: number
  owner: string
  balance: number
  currency: string
  created_at: string
}

export interface CreateAccountRequest {
  currency: string
}

export interface ListAccountsParams {
  page_id?: number
  page_size?: number
}

// Transfer Interface & API Types
export interface CreateTransferRequest {
  from_account_id: number
  to_account_id: number
  amount: number
  currency: string
}

export interface Transfer {
  id: number
  from_account_id: number
  to_account_id: number
  amount: number
  currency: string
  created_at: string
}

// Renew Token Types
export interface RenewAccessTokenRequest {
  refresh_token: string
}

export interface RenewAccessTokenResponse {
  access_token: string
  access_token_expires_at: string
}

// Generic Protobuf Any & RPC Error Status definitions
export interface protobufAny {
  '@type'?: string
  [key: string]: unknown
}

export interface rpcStatus {
  code?: number
  message?: string
  details?: protobufAny[]
}

// Aliases matching PascalCase convention
export type PbUser = pbUser
export type PbCreateUserRequest = pbCreateUserRequest
export type PbCreateUserResponse = pbCreateUserResponse
export type PbLoginUserRequest = pbLoginUserRequest
export type PbLoginUserResponse = pbLoginUserResponse
export type PbUpdateUserRequest = pbUpdateUserRequest
export type PbUpdateUserResponse = pbUpdateUserResponse
export type PbVerifyEmailParams = pbVerifyEmailParams
export type PbVerifyEmailResponse = pbVerifyEmailResponse
export type ProtobufAny = protobufAny
export type RpcStatus = rpcStatus
