import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import './assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())

// Restore auth state from localStorage before router guard fires
const authStore = useAuthStore()
authStore.checkAuth()

app.use(router)
app.mount('#app')