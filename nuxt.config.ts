export default defineNuxtConfig({
  modules: ["@vueuse/nuxt", "@nuxt/content", "@pinia/nuxt", "@unocss/nuxt"],

  vue: { defineModel: true },
  prerender: { enabled: true },

  vite: {
    build: {
      target: ["esnext"], // you can also use 'es2020' here
    },
    optimizeDeps: {
      esbuildOptions: {
        target: ["esnext"], // you can also use 'es2020' here
      },
    },
  },
  devtools: { enabled: true },
});
