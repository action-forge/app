<script lang="ts" setup>
defineProps({ proposal: { type: Object, default: () => ({}) } })

const activeOutcome = ref(0)
const activeAction = ref(0)
const actionTypes = ['Send', 'Swap', 'Delegate']
const inToken = ref({
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '0x0000000000000000000'
})
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
      <div class="flex gap-5">
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
            <input class="unstyled-input h-10 w-full" placeholder="0x000000000000000000000000000000000000000000">
          </div>
        </div>
      </div>

      <!-- Amount and duration -->
      <div class="flex gap-5">
        <div class="flex flex-col w-full">
          <div class="field-title pb-3">
            Amount
          </div>
          <div class="input-wrapper flex items-center relative text-xs leading-3 px-2">
            <input class="unstyled-input h-10 w-full" placeholder="100">
            <span>{{ inToken.symbol }}</span>
          </div>
        </div>
      </div>

      <!-- cta -->

      <div>
        <button class="w-full flex items-center justify-center bg-blue-lapis text-white rounded-full font-medium p-3.5">
          Attach
        </button>
      </div>
    </div>
  </div>
</template>
