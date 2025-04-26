<template>
  <div class="min-h-screen flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAppStore } from '~/stores/app'

const appStore = useAppStore()

// Initialize the app store
onMounted(() => {
  appStore.init()
})
</script>