<script lang="ts" setup>
import { getFormattedAmount, scaleToString } from '@hubble-exchange/utils'
import { AbiCoder, Contract, getBytes } from 'ethers'
import { checksumAddress, getAddress, type Address } from 'viem'
import { actionForgeABI } from '~~/config/abi'

const props = defineProps({ proposal: { type: Object, default: () => ({}) } })
const wallet = useWalletStore()
const token = useTokenStore()

const activeOutcome = ref(0)
const activeAction = ref(0)
const actionTypes = ['Send', 'Borrow GHO', 'Swap To sDai']
const inputAmount = ref('')
const isLoading = ref(false)
const inToken = ref<Token>({
  address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  name: 'weth',
  decimals: 18,
  symbol: 'weth'
})

const inputAddress = ref('')
const inTokenAddress = computed(() => inToken.value.address)
const sanitizedInputAmount = computed(() => {
  if (inputAmount.value === '') return '0'
  try {
    return scaleToString(inputAmount.value, inToken.value.decimals)
  } catch (error) {
    return '0'
  }
})
const spenderAddress = computed(() => wallet.contracts.ActionForge)
const { balance } = useERC20Balance(inTokenAddress)
const { isEnoughAllowance, approve } = useERC20Allowance(inTokenAddress, spenderAddress, sanitizedInputAmount)
const inBalance = computed(() => getFormattedAmount(balance.value, inToken.value.decimals))
function useMax () {
  inputAmount.value = inBalance.value.formattedFull
}

watch(activeAction, () => {
  if (activeAction.value !== 0) {
    inToken.value = token.staticTokens[0]
  }
})



async function takeAction () {
  if (!wallet.isConnected) return

  isLoading.value = true
  const walletClient = await wallet.getWalletClient(true)

  if (!walletClient || !wallet.connectedAddress) return

  const amount = sanitizedInputAmount.value
  if (!isEnoughAllowance.value && inTokenAddress.value !== 'native') {
    const isApproved = await approve(amount)
    if (!isApproved) {
      isLoading.value = false
      return
    }
  }


  try {
    const blankBytes32 = '0x' + '0'.repeat(64) as Address
    let to = getAddress(wallet.connectedAddress)

    let token: Address | null = null
    if (inTokenAddress.value !== 'native') {
      token = getAddress(inTokenAddress.value)
      to = getAddress(inputAddress.value)
    }


    const _amount = BigInt(amount)
    const actions = []
    for (let i = 0; i < props.proposal.choices.length; i++) {
      if (i !== activeOutcome.value) {
        actions.push({
          actionType: 3,
          txData: blankBytes32
        })
      } else if (activeAction.value === 0) {
        actions.push({
          actionType: 0,
          txData: getBytes(AbiCoder.defaultAbiCoder().encode(['address', 'address', 'uint256'], [to, token, _amount]))
        })
      } else if (activeAction.value === 1) {
        actions.push({
          actionType: 1,
          txData: getBytes(AbiCoder.defaultAbiCoder().encode(['address', 'uint256'], [to, _amount]))
        })
      } else if (activeAction.value === 2) {
        actions.push({
          actionType: 2,
          txData: getBytes(AbiCoder.defaultAbiCoder().encode(['address', 'uint256'], [to, _amount]))
        })
      }
    }

    const proposal = {
      snapshotId: checksumAddress(props.proposal.id),
      actionForgeId: blankBytes32,
      endTime: BigInt(props.proposal.end),
      actions: actions,
      executed: false,
      winnerOption: 0
    }
    console.log('🚀 ~ file: ActionWidget.vue:105 ~ takeAction ~ proposal:', proposal)

    const contract = new Contract(wallet.contracts.ActionForge, actionForgeABI, walletClient)
    let tx
    if (inTokenAddress.value === 'native') {
      await contract.registerProposal.estimateGas(proposal, { value: _amount })
      tx = await contract.registerProposal(proposal, { value: _amount })
    }
    else {
      await contract.registerProposal.estimateGas(proposal)
      tx = await contract.registerProposal(proposal)
    }

    console.log('🚀 ~ file: ActionWidget.vue:67 ~ takeAction ~ hash', tx)
    const receipt = await wallet.publicClient.waitForTransactionReceipt({ hash: tx.hash })
    console.log('🚀 ~ file: ActionWidget.vue:92 ~ takeAction ~ receipt:', receipt)

  } catch (error) {
    console.log('🚀 ~ file: ActionWidget.vue:80 ~ takeAction ~ error', error)
  }

  isLoading.value = false

}
</script>

<template>
  <div class="w-full border border-blue-carolina rounded-xl bg-white-nav">
    <!-- header -->
    <div class="w-full flex items-center border-b border-blue-carolina px-4 py-3">
      <span class="text-sm font-medium leading-3">Attach Action</span>
    </div>

    <!-- body -->

    <div class="flex flex-col p-4 gap-4">
      <!-- choose choice and action type -->
      <div class="flex gap-5">
        <div class="flex flex-col  w-full">
          <div class="field-title pb-3">
            Proposal Outcome
          </div>
          <div class="input-wrapper flex relative text-xs leading-3">
            <Dropdown v-model="activeOutcome" :items="proposal.choices" class="w-full" :drop-class="'w-full'" />
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="field-title pb-3">
            Action Type
          </div>
          <div class="input-wrapper flex relative text-xs leading-3">
            <Dropdown v-model="activeAction" :items="actionTypes" class="w-full" :drop-class="'w-full'" />
          </div>
        </div>
      </div>

      <!-- Token and destination address -->
      <div v-if="activeAction === 0" class="flex gap-5">
        <div class="flex flex-col  w-full">
          <div class="field-title pb-3">
            Token
          </div>
          <div class="input-wrapper flex relative text-xs leading-3">
            <TokenDropdown v-model="inToken" class="w-full" :drop-class="'w-full'" />
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="field-title pb-3">
            To
          </div>
          <div class="input-wrapper flex relative text-xs leading-3 px-2">
            <input v-model="inputAddress" class="unstyled-input h-10 w-full" placeholder="0x0000...0000">
          </div>
        </div>
      </div>

      <!-- Amount and duration -->
      <div class="flex gap-5">
        <div class="flex flex-col w-full">
          <div class="flex items-center field-title pb-3">
            <span>Amount</span>
            <button class="ml-auto text-gray-400" @click="useMax()">
              {{ inBalance.formatted }}
            </button>
          </div>
          <div class="input-wrapper flex items-center relative text-xs leading-3 px-2">
            <input v-model="inputAmount" class="unstyled-input h-10 w-full" placeholder="100">
            <span class="uppercase">{{ inToken.symbol }}</span>
          </div>
        </div>
      </div>

      <!-- cta -->

      <div>
        <button
          class="w-full flex items-center justify-center bg-blue-lapis text-white rounded-full font-medium p-3.5"
          @click="takeAction()"
        >
          <IconLoader v-if="isLoading" class="w-5 h-5 animate-spin mr-4 -mt-0.5" />

          {{ !isEnoughAllowance ? 'Approve & ' : '' }}

          Attach
        </button>
      </div>
    </div>
  </div>
</template>
