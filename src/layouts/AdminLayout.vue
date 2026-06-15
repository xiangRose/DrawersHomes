<template>
  <div class="flex h-screen bg-gray-100">
    <AdminSidebar /><!--左边栏-->
    <main class="flex-1 overflow-auto p-6">
      <router-view /><!--Dashboard或Settings-->
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
</script>