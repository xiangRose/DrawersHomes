import { ref } from 'vue'

const updatingIds = new Set()

export function useKanbanDrag(columnStatus, orderStore) {
  const isDragging = ref(false)

  function onDragChange(event) {
    if (!event.added) return
    const order = event.added.element
    if (updatingIds.has(order.id)) return

    updatingIds.add(order.id)
    orderStore.updateOrderStatus(order.id, columnStatus)
      .finally(() => {
        updatingIds.delete(order.id)
      })
  }

  return { onDragChange, isDragging }
}