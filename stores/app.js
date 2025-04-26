import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
  const isDark = useStorage('scholar-assist-dark-mode', false)
  
  function toggleDarkMode() {
    isDark.value = !isDark.value
    updateTheme()
  }
  
  function updateTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  function init() {
    // Initialize the theme based on stored preference
    updateTheme()
  }
  
  return {
    isDark,
    toggleDarkMode,
    init
  }
})