import { reactive, readonly } from 'vue'
import type { AuthState } from './types/auth_state'
import type { User } from './types/user'

// Restore stored state from localStorage on init if present
const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('user_data')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const state = reactive<AuthState>({
  user: getStoredUser(),
  accessToken: localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null
})

function setUser(user: User, accessToken: string, refreshToken: string) {
  state.user = user
  state.accessToken = accessToken
  state.refreshToken = refreshToken

  try {
    localStorage.setItem('user_data', JSON.stringify(user))
  } catch {
    // Ignore quota errors
  }

  if (accessToken) {
    localStorage.setItem('access_token', accessToken)
  }
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken)
  }
}

function updateUserData(updatedUser: Partial<User>) {
  if (state.user) {
    state.user = {
      ...state.user,
      ...updatedUser
    }
    try {
      localStorage.setItem('user_data', JSON.stringify(state.user))
    } catch {
      // Ignore quota errors
    }
  }
}

function clearUser() {
  state.user = null
  state.accessToken = null
  state.refreshToken = null
  localStorage.removeItem('user_data')
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  sessionStorage.removeItem('access_token')
}

export default {
  state: readonly(state),
  setUser,
  updateUserData,
  clearUser
}
