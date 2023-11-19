import type { Address } from "viem"

export const useTokenStore = defineStore('token', () => {
  const staticTokens = ref<Token[]>([
    {
      address: 'native',
      name: 'eth',
      decimals: 18,
      symbol: 'eth',
    },
    {
      address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      name: 'weth',
      decimals: 18,
      symbol: 'weth',
    },
    {
      address: '0x29f2D40B0605204364af54EC677bD022dA425d03',
      name: 'WBTC',
      decimals: 18,
      symbol: 'WBTC',
    },
  ])
  const userTokens = ref <Token[]>([])

  const all = computed<Token[]>(() => [...userTokens.value, ...staticTokens.value])

  /**
   * Adds a user token to the list of tokens.
   * @param details The details of the token to be added.
   */
  function addUserToken(details: Token){
    if (all.value.find(t => t.address === details.address))
      return
    userTokens.value.push(details)
  }
  return { all, userTokens, staticTokens, addUserToken }
})

export type Token = {
  symbol: string
  name: string
  address: Address | 'native'
  decimals: number
}
