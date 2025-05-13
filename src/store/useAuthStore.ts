import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  accessTokenExpiresAt: number | null
  login: (token: string, user: User) => void
  logout: () => void
  getAccessToken: () => string | null
  getUserId: () => number | null
  getUserEmail: () => string | null
  getUserFirstName: () => string | null
  getUserLastName: () => string | null
  getUser: () => User | null
  isAccessTokenExpired: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist((set, get) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    accessTokenExpiresAt: null,
    login: (token: string, user: User) =>
      set({
        isAuthenticated: true,
        user,
        token,
        accessTokenExpiresAt: Date.now() + 5 * 59 * 1000,
      }),
    logout: () =>
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        accessTokenExpiresAt: null,
      }),
    getUser: () => get().user,
    getAccessToken: () => get().token,
    getUserId: () => get().user?.id ?? null,
    getUserEmail: () => get().user?.email ?? null,
    getUserFirstName: () => get().user?.firstName ?? null,
    getUserLastName: () => get().user?.lastName ?? null,
    isAccessTokenExpired: () => {
      const expiresAt = get().accessTokenExpiresAt
      // If the access token is not set, it is expired, return true
      return !expiresAt || (Date.now() >= expiresAt)
    },
  }),
    {
      name: 'auth-store',
    }
  )
)
