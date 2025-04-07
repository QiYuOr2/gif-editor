/* global defineNuxtConfig */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: '/gif-editor/',
  },
  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2025-01-02',
})
