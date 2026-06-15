<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">画师后台</h1>
        <p class="text-sm text-gray-400 mt-2">登录以管理订单和设置</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
            @keyup.enter="handleLogin"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
            @keyup.enter="handleLogin"
          />
        </div>

        <p v-if="loginErr" class="text-red-500 text-xs text-center">{{ loginErr }}</p>

        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full py-2.5 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>

      <p class="text-center text-xs text-gray-400 mt-6">默认账号: admin / admin123</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const loginErr = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    loginErr.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  loginErr.value = ''
  const success = await authStore.login(username.value, password.value)
  loading.value = false
  if (success) {
    const redirect = route.query.redirect || '/admin/dashboard'
    router.push(redirect)
  } else {
    loginErr.value = authStore.loginError
  }
}
</script>