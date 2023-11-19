<script lang="ts" setup>
defineProps({ dropClass: { type: String, default: '' } })

const target = ref()
const show = ref(false)

const token = useTokenStore()
const inputTokenAddress = ref('')
useErc20Details(inputTokenAddress, (details) => {
  token.addUserToken(details)
  active.value = details
})

const active = defineModel({ default: {
  address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
  name: 'weth',
  decimals: 18,
  symbol: 'weth'
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
      <div class="w-4 h-4 rounded-full" style="background: linear-gradient(45deg, #E64242 -0.09%, #E69442 49.91%, #E5E642 99.91%)" />
      <span class="uppercase">{{ active.symbol }}</span>
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
        <div class="px-4 py-2">
          <div class="border-b border-blue-carolina">
            <input v-model="inputTokenAddress" class="unstyled-input h-8" placeholder="erc20 token address">
          </div>
        </div>
        <button
          v-for="item in token.all"
          :key="item.symbol"
          class="w-full text-left uppercase block px-4 py-2 hover:bg-green-honey"
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
