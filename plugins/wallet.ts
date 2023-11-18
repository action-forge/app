export default defineNuxtPlugin(async () => {
  await useWalletStore().init()
})
