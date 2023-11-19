import { useTokenStore } from '../stores/token';
export default defineNuxtPlugin(async () => {
  useTokenStore()
  const wallet = await useWalletStore()
  wallet.init()

  if (typeof window === undefined) return

  const previouslyConnectedWallets = JSON.parse(window.localStorage.getItem('connectedWallets') || '[]') as string[]
  if (previouslyConnectedWallets.length > 0)
    wallet.connect({ autoSelect: { label: previouslyConnectedWallets[0], disableModals: true } })
})
