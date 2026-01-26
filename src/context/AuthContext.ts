// stores/useAuthStore.ts
import { create } from 'zustand'

interface User {
  _id: string
  name: string
  email: string
  userType: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  refreshAccessToken: () => Promise<string | null>
  fetchUser: () => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  
  login: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    get().fetchUser()
  },
  
  logout: () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    set({ user: null })
  },
  
  refreshAccessToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) return null

      const res = await fetch("http://localhost:5000/api/users/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) throw new Error("Refresh failed")

      const data = await res.json()
      localStorage.setItem("accessToken", data.accessToken)
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken)
      }
      return data.accessToken
    } catch (error) {
      get().logout()
      console.log(error)
      return null
    }
  },
  
  fetchUser: async () => {
    try {
      const token = localStorage.getItem("accessToken")
      if (!token) return

      let res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        const newToken = await get().refreshAccessToken()
        if (newToken) {
          res = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${newToken}` },
          })
        }
      }

      if (res.ok) {
        const userData = await res.json()
        set({ user: userData })
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  },
  
  initializeAuth: async () => {
    await get().fetchUser()
    set({ isLoading: false })
  }
}))