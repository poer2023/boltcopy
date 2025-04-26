<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 py-4">
    <div class="container mx-auto px-4 flex items-center justify-between">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        &copy; {{ new Date().getFullYear() }} ScholarAssist. All rights reserved.
      </p>
      <div class="flex items-center gap-4">
        <UButton 
          icon="i-mdi-help-circle"
          color="gray" 
          variant="ghost" 
          size="sm"
          to="/help"
        >
          Help
        </UButton>
        <UButton 
          icon="i-mdi-shield"
          color="gray" 
          variant="ghost" 
          size="sm"
          to="/privacy"
        >
          Privacy
        </UButton>
      </div>
    </div>
  </footer>
</template>