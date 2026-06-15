import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/1'
  },
  {//菜单第一页
    path: '/:artistId',//匹配画师主页
    component: () => import('@/layouts/ClientLayout.vue'),//用“手机端外壳”
    //包裹函数，懒加载
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/client/Profile.vue'),
        meta: { title: '画师主页' }
      },
      {
        path: 'gallery',
        name: 'Gallery',
        component: () => import('@/views/client/Gallery.vue'),
        meta: { title: '作品橱窗' }
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: () => import('@/views/client/Pricing.vue'),
        meta: { title: '价目表' }
      },
      {
        path: 'order',
        name: 'OrderForm',
        component: () => import('@/views/client/OrderForm.vue'),
        meta: { title: '提交约稿' }
      }
    ]
  },
  {//菜单第二页
    path: '/admin/login',//匹配后台登录页面
    name: 'Login',
    component: () => import('@/views/admin/Login.vue'),//用“后台登录页外壳”
    meta: { title: '管理员登录' }
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '订单看板', requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: { title: '基础设置', requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: { template: '<div class="flex items-center justify-center h-screen text-gray-500 text-lg">404 - 页面未找到</div>' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router