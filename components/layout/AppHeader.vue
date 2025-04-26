<template>
  <header class="border-b border-gray-200 dark:border-gray-800">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo.svg" alt="ScholarAssist Logo" class="w-8 h-8" />
          <h1 class="text-xl font-semibold text-primary-600 dark:text-primary-400">ScholarAssist</h1>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <UButton
          v-if="route.name !== 'index'"
          :icon="'i-mdi-home'"
          color="gray"
          variant="ghost"
          to="/"
        >
          {{ languageStore.t('nav.home') }}
        </UButton>
        
        <UButton
          v-if="route.name !== 'projects'"
          :icon="'i-mdi-file-document-multiple'"
          color="gray"
          variant="ghost"
          to="/projects"
        >
          {{ languageStore.t('nav.papers') }}
        </UButton>
        
        <UButton
          v-if="route.name !== 'references'"
          :icon="'i-mdi-bookmark-multiple'"
          color="gray"
          variant="ghost"
          to="/references"
        >
          {{ languageStore.t('nav.references') }}
        </UButton>

        <UDivider vertical />

        <UButton
          :icon="'i-mdi-plus'"
          color="primary"
          to="/editor/new"
        >
          {{ languageStore.t('nav.newPaper') }}
        </UButton>

        <UDropdown :items="userMenuItems">
          <UAvatar src="https://i.pravatar.cc/128" alt="User Profile" />
        </UDropdown>

        <UButton
          :icon="appStore.isDark ? 'i-mdi-weather-sunny' : 'i-mdi-weather-night'"
          color="gray"
          variant="ghost"
          @click="appStore.toggleDarkMode()"
        />

        <UButton
          :icon="'i-mdi-translate'"
          color="gray"
          variant="ghost"
          @click="toggleLanguage"
        >
          {{ languageStore.currentLanguage.toUpperCase() }}
        </UButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '~/stores/app'
import { useLanguageStore } from '~/stores/language'

const route = useRoute()
const appStore = useAppStore()
const languageStore = useLanguageStore()

const userMenuItems = computed(() => [
  [
    {
      label: languageStore.t('nav.profile'),
      icon: 'i-mdi-account',
      to: '/profile'
    },
    {
      label: languageStore.t('nav.settings'),
      icon: 'i-mdi-cog',
      to: '/settings'
    }
  ],
  [
    {
      label: languageStore.t('nav.signOut'),
      icon: 'i-mdi-logout',
      click: () => console.log('Sign out clicked')
    }
  ]
])

function toggleLanguage() {
  const newLang = languageStore.currentLanguage === 'en' ? 'zh' : 'en'
  languageStore.setLanguage(newLang)
}
</script>