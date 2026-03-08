import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),

  // Login.jsx నుండి user, access, refresh వస్తాయి
  login: (user, access, refresh) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    set({
      user: user,
      accessToken: access,
      isAuthenticated: true,
    })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, accessToken: null, isAuthenticated: false })
    window.location.href = '/login'
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return
      const res = await fetch('/api/auth/me/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        set({ user: data, isAuthenticated: true })
      } else {
        localStorage.removeItem('access_token')
        set({ user: null, isAuthenticated: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false })
    }
  },
}))

export default useAuthStore