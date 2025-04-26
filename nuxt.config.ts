// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/main.css'
  ],
  ui: {
    global: true,
    icons: ['mdi']
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'ScholarAssist - AI-Powered Academic Writing',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI-assisted academic paper writing with seamless reference management' },
        { name: 'description', lang: 'zh', content: 'AI辅助学术论文写作，无缝参考文献管理' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  },
  nitro: {
    preset: 'node-server'
  }
})