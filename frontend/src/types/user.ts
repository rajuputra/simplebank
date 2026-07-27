import type { pbUser } from './api'

export interface User extends pbUser {
  full_name?: string
}
