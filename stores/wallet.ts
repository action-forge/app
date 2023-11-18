import type { ConnectOptions, OnboardAPI, WalletState } from '@web3-onboard/core'
import type { ConnectOptionsString } from '@web3-onboard/core/dist/types'
import { defineStore } from 'pinia'
import { getOnboard } from '@/composables/wallet'

export const useWalletStore = defineStore('wallet', () => {

  const chain = ref({
    id: "0xaa36a7",
    token: "eth",
    label: "eth",
    rpcUrl: "https://ethereum-sepolia.publicnode.com",
    blockExplorerUrl: "https://sepolia.etherscan.io",
  })

  const onboard = ref<OnboardAPI | null>(null)
  let unsubscribeOnboard = ref<null | (() => void)>(null)
  const wallets = ref<WalletState[]>([])
  const loaders = ref({ connecting: false })

  // getters
  const isConnected = computed((): boolean => wallets.value.length !== 0)
  const wallet = computed((): WalletState | null => {
    if (wallets.value.length === 0)
      return null
    return wallets.value[0]
  })
  const connectedAddress = computed((): string | null => {
    if (!wallet.value || (!wallet.value.accounts || wallet.value.accounts.length === 0))
      return null
    return wallet.value.accounts.map(account => account.address)[0]
  })
  const connectedAddressShort = computed((): string | null => {
    if (!connectedAddress.value)
      return ''
    return `${connectedAddress.value.substring(0, 6)}...${connectedAddress.value.substring(connectedAddress.value.length - 4)}`
  })

  // actions
  async function init() {
    onboard.value = await getOnboard([chain.value])
  }

  async function connect(options?: ConnectOptions | ConnectOptionsString | undefined): Promise<void> {
    loaders.value.connecting = true
    try {
      if (onboard.value === null)
        await init()
      if (onboard.value) {
        const _wallets = onboard.value.state.select('wallets')
        const { unsubscribe } = _wallets.subscribe((_wallets: WalletState[]) => {
          wallets.value = _wallets
          const connectedWallets = _wallets.map(({ label }) => label)
          if (window)
            window.localStorage.setItem('connectedWallets', JSON.stringify(connectedWallets))
        })
        unsubscribeOnboard.value = unsubscribe

        await overrideWalletStyles() // load the wallet modal styles
        await onboard.value.connectWallet(options)
      }
    }
    catch (error) {
      console.debug('failed to connect wallet', error)
    }
    finally {
      loaders.value.connecting = false
    }
  }

  async function disconnect() {
    unsubscribeOnboard.value && unsubscribeOnboard.value()
    wallets.value.forEach(wallet => onboard.value?.disconnectWallet({ label: wallet.label }))
  }

  async function switchChain(chainId: string): Promise<boolean> {
    if (onboard.value === null)
      return false // no wallet connected
    return await onboard.value.setChain({ chainId })
  }

  return { loaders, isConnected, connectedAddress, connectedAddressShort, init, switchChain, connect, disconnect }

})
