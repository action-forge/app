import { getContract, type Address, isAddress } from "viem"
import { erc20ABI } from "~/config/abi"

export const MAX_AMOUNT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

/**
 * Custom composable function for retrieving ERC20 token details.
 *
 * @param address - The address of the ERC20 token.
 * @returns An object containing the loader and data properties.
 */
export function useErc20Details(address: MaybeRef<string>, onLoad?: (details: any) => void) {
  const wallet = useWalletStore()
  const token = useTokenStore()

  const data = ref({
    name: '',
    symbol: '',
    address: '',
    decimals: 0,
  })
  const loader = ref(false)

  /**
   * Loads ERC20 details from the contract.
   * If the address is not provided, the function returns early.
   * Sets the name, symbol, decimals, and address properties of the data object.
   * Sets the loader value to true before loading and false after loading.
   * Logs an error message if loading fails.
   */
  async function load() {
    if (!toValue(address) || !isAddress(toValue(address)))
      return
    const tkn = token.all.find(t => t.address === toValue(address))
    if (tkn)
      return onLoad && onLoad(tkn)
    loader.value = true
    try {
      const contract = getContract({ abi: erc20ABI, address: toValue(address) as Address, publicClient: wallet.publicClient })
      const [name, symbol, decimals] = await Promise.all([
        contract.read.name(), contract.read.symbol(), contract.read.decimals()
      ])
      data.value.name = name
      data.value.symbol = symbol
      data.value.decimals = Number(decimals)
      data.value.address = toValue(address) as Address
      onLoad && onLoad(toValue(data))
    }
    catch (error) {
      console.debug('failed to load erc20 details', error)
    }
    loader.value = false
  }

  watch(() => toValue(address), load, { immediate: true })

  return { loader, data }

}


async function fetchErc20Balance(tokenAddress: Address | 'native', userAddress: Address | null, resetOnError = false): Promise<string | undefined> {
  if (userAddress === null)
    return '0'
  const wallet = useWalletStore()
  try {
    if (tokenAddress === 'native') {
      return (await wallet.publicClient.getBalance({ address: userAddress })).toString()
    }
    else {
      const amount = await wallet.publicClient.readContract({ abi: erc20ABI, address: tokenAddress, functionName: 'balanceOf', args: [userAddress] })
      return (
        amount
      ).toString()
    }
  }
  catch (error) {
    console.debug('fetching balances error:', error)
    if (resetOnError)
      return '0'
  }
}


export function useERC20Balance(
  tokenAddress: MaybeRef<Address | 'native'>,
  disableOnMount = false,
  resetOnError = true
) {
  const balance = ref('0')
  const isLoading = ref(false)
  const wallet = useWalletStore()
  const { connectedAddress } = storeToRefs(wallet)

  const fetchBalance = async () => {
    isLoading.value = true
    const _balance = await fetchErc20Balance(toValue(tokenAddress), wallet.connectedAddress, resetOnError)
    if (_balance !== undefined)
      balance.value = _balance
    isLoading.value = false
  }

  onMounted(() => !disableOnMount && fetchBalance())

  watch(() => toValue(tokenAddress), fetchBalance)
  watch(connectedAddress, fetchBalance)

  return { isLoading, balance, fetchBalance }
}


export function useERC20Allowance(
  tokenAddress: MaybeRef<Address | 'native'>,
  spenderAddress: MaybeRef<Address>,
  requiredAllowance: MaybeRef<string>,
  resetOnError = false,
) {
  const wallet = useWalletStore()
  const { connectedAddress } = storeToRefs(wallet)
  const allowance = ref(0n)
  const isFetchingAllowance = ref(false)
  const isApproving = ref(false)
  const isEnoughAllowance = computed(() => allowance.value >= BigInt(toValue(requiredAllowance)))

  async function fetchAllowance() {

    console.debug('fetching allowance', toValue(tokenAddress), toValue(spenderAddress), toValue(requiredAllowance))

    if (wallet.connectedAddress === null || toValue(tokenAddress) === 'native' || toValue(spenderAddress) === null) {
      allowance.value = 0n
      return
    }
    isFetchingAllowance.value = true
    try {
      allowance.value = await wallet.publicClient.readContract({
        abi: erc20ABI,
        address: toValue(tokenAddress),
        functionName: 'allowance',
        args: [wallet.connectedAddress, toValue(spenderAddress)]
      })
    }
    catch (error) {
      if (resetOnError)
        allowance.value = 0n
      console.debug('fetching allowance error:', error)
    }
    finally {
      isFetchingAllowance.value = false
    }
  }

  async function approve(amount: string, infiniteApproval = true) {
    console.debug('approving allowance', amount)

    const walletClient = await wallet.getWalletClient()
    if (!walletClient || !wallet.connectedAddress)
      return false

    isApproving.value = true

    const _amount = infiniteApproval ? BigInt(MAX_AMOUNT) : BigInt(amount)

    try {
      const { request } = await wallet.publicClient.simulateContract({
        abi: erc20ABI,
        address: toValue(tokenAddress),
        account: wallet.connectedAddress,
        functionName: 'approve',
        args: [toValue(spenderAddress), _amount]
      })
      const hash = await walletClient.writeContract(request)
      console.log("🚀 ~ file: erc20.ts:169 ~ approveAllowance ~ hash:", hash)
      const receipt = await wallet.publicClient.waitForTransactionReceipt({ hash })
      console.log("🚀 ~ file: erc20.ts:169 ~ approveAllowance ~ receipt:", receipt)
      await fetchAllowance()

      isApproving.value = false
      if (receipt)
        return true
      return false
    }
    catch (error) {
      isApproving.value = false
      return false
    }
  }

  onMounted(() => fetchAllowance())
  watch(connectedAddress, fetchAllowance)
  watch(() => toValue(spenderAddress), fetchAllowance)
  watch(() => toValue(tokenAddress), fetchAllowance)

  return { allowance, isEnoughAllowance, isFetchingAllowance, isApproving, fetchAllowance, approve }
}
