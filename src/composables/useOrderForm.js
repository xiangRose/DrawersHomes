import { reactive, ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'

const contactRegexMap = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^1[3-9]\d{9}$/,
  wechat: /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/
}

export function useOrderForm(artistId) {
  const currentStep = ref(0)
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const errors = ref({})

  const formData = reactive({
    commissionType: '',
    description: '',
    customerName: '',
    contactMethod: 'email',
    contactInfo: '',
    budget: null
  })

  const steps = [
    { title: '选择类型', key: 'type' },
    { title: '联系方式', key: 'contact' },
    { title: '确认提交', key: 'review' }
  ]

  function validateStep(stepIndex) {
    errors.value = {}
    if (stepIndex === 0) {
      if (!formData.commissionType) errors.value.commissionType = '请选择约稿类型'
      if (!formData.description || formData.description.length < 10) {
        errors.value.description = '描述不能少于10个字'
      }
    } else if (stepIndex === 1) {
      if (!formData.customerName.trim()) errors.value.customerName = '请输入姓名'
      if (!formData.contactInfo.trim()) {
        errors.value.contactInfo = '请输入联系方式'
      } else if (!contactRegexMap[formData.contactMethod].test(formData.contactInfo)) {
        errors.value.contactInfo = '联系方式格式不正确'
      }
    }
    return Object.keys(errors.value).length === 0
  }

  function nextStep() {
    if (validateStep(currentStep.value) && currentStep.value < 2) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 0) currentStep.value--
  }

  async function submitOrder() {
    if (!validateStep(2)) return false
    isSubmitting.value = true
    const orderStore = useOrderStore()
    const success = await orderStore.addOrder({
      artistId: Number(artistId),
      customerName: formData.customerName,
      contactInfo: formData.contactInfo,
      commissionType: formData.commissionType,
      description: formData.description,
      budget: Number(formData.budget),
      status: 'pending'
    })
    isSubmitting.value = false
    if (success) {
      submitSuccess.value = true
      currentStep.value = -1 // Switch to success view
    }
    return success
  }

  return {
    currentStep, formData, errors, steps, isSubmitting, submitSuccess,
    validateStep, nextStep, prevStep, submitOrder
  }
}