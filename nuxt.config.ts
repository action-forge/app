export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxt/content',
    '@pinia/nuxt',
    '@unocss/nuxt',
  ],

  vue: { defineModel: true },
  devtools: { enabled: true },
})
