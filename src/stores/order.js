import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import { getOrders, updateOrder, createOrder, deleteOrder } from '@/api/orders'

export const useOrderStore = defineStore('order', () => {
  //所有订单原始数据
  const orders = ref([])
  // 按状态分成5列显示在看板上
  const columns = reactive({
    pending: [],
    sketch: [],
    color: [],
    done: [],
    rejected: []
  })//reactive是响应式对象，直接修改columns.pending（内部数组）会触发更新
  const loading = ref(false)
  const error = ref(null)
  const submitting = ref(false)

  const columnsArray = computed(() => [
    { key: 'pending', title: '待审核', orders: columns.pending, color: 'border-yellow-400 bg-yellow-50' },
    { key: 'sketch', title: '草稿', orders: columns.sketch, color: 'border-blue-400 bg-blue-50' },
    { key: 'color', title: '上色', orders: columns.color, color: 'border-orange-400 bg-orange-50' },
    { key: 'done', title: '完成', orders: columns.done, color: 'border-green-400 bg-green-50' },
    { key: 'rejected', title: '不通过', orders: columns.rejected, color: 'border-red-400 bg-red-50' }
  ])

  const pendingCount = computed(() => columns.pending.length)

  function populateColumns() {
    const all = orders.value
    // filter 的意思是：从所有订单里，挑出 status=??? 的
    columns.pending = all.filter(o => o.status === 'pending')
    columns.sketch = all.filter(o => o.status === 'sketch')
    columns.color = all.filter(o => o.status === 'color')
    columns.done = all.filter(o => o.status === 'done')
    columns.rejected = all.filter(o => o.status === 'rejected')
  }

  async function fetchOrders(artistId) {
    loading.value = true
    error.value = null
    try {
      orders.value = await getOrders(artistId)
      populateColumns()
    } catch (e) {
      error.value = e.message || '加载订单失败'
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const order = orders.value.find(o => o.id === orderId)
      if (order) order.status = newStatus
      await updateOrder(orderId, { status: newStatus })
      populateColumns()
    } catch (e) {
      // Rollback: re-fetch from server
      error.value = '更新状态失败，已回滚'
      const artistId = orders.value[0]?.artistId || 1
      await fetchOrders(artistId)
    }
  }

  async function addOrder(data) {
    submitting.value = true
    error.value = null
    try {
      const created = await createOrder(data)
      orders.value.push(created)
      populateColumns()
      return true
    } catch (e) {
      error.value = e.message || '提交订单失败'
      return false
    } finally {
      submitting.value = false
    }
  }

  async function removeOrder(orderId) {
    try {
      await deleteOrder(orderId)
      orders.value = orders.value.filter(o => o.id !== orderId)
      populateColumns()
      return true
    } catch (e) {
      error.value = e.message || '删除订单失败'
      return false
    }
  }

  return {
    orders, columns, loading, error, submitting,
    columnsArray, pendingCount,
    fetchOrders, updateOrderStatus, addOrder, removeOrder, populateColumns
  }
})