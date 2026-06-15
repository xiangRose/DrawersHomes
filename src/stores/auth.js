import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const loginError = ref('')

  const isAuthenticated = computed(() => !!token.value)

  function checkAuth() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken) {
      token.value = savedToken
      user.value = savedUser ? JSON.parse(savedUser) : null
    }
  }

  async function login(username, password) {
    loginError.value = ''
    if (username === 'admin' && password === 'admin123') {
      const generatedToken = 'token_' + Date.now() + '_' + Math.random().toString(36).slice(2)
      const userData = { id: 1, username: 'admin', role: 'admin' }
      token.value = generatedToken
      user.value = userData
      localStorage.setItem('auth_token', generatedToken)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      return true
    }
    loginError.value = '用户名或密码错误'
    return false
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  return { token, user, loginError, isAuthenticated, checkAuth, login, logout }
})