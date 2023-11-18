<script lang="ts" setup>
defineProps({ dropClass: { type: String, default: '' } })

const target = ref()
const show = ref(false)
const tokenList = ref([
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '0x0000000000000000000'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 18,
    address: '0x0000000000000000000'
  }
])
const active = defineModel({ default: {
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  address: '0x0000000000000000000'
} })

onClickOutside(target, () => {
  show.value = false
})
</script>

<template>
  <div ref="target">
    <button
      id="menu-button"
      type="button"
      class="inline-flex capitalize items-center h-10 w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 hover:bg-gray-50"
      aria-expanded="true"
      aria-haspopup="true"
      @click="show = !show"
    >
      {{ active.symbol }}
      <IconArrowBack class="ml-auto w-4 h-4" />
    </button>

    <!-- dropdown -->
    <div
      :class="[!show && 'hidden', dropClass]"
      class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
        <button
          v-for="item in tokenList"
          :key="item.symbol"
          class="w-full text-left capitalize block px-4 py-2 hover:bg-green-honey"
          role="menuitem"
          tabindex="-1"
          @click="(active = item) && (show = false)"
        >
          {{ item.symbol }}
        </button>
      </div>
    </div>
  </div>
</template>
