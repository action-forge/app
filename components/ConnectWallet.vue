<script lang="ts" setup>
const wallet = useWalletStore()

</script>

<template>
  <button
    class="group flex items-center border border-green-light rounded-full p-2.75 px-5"
    @click="!wallet.isConnected ? wallet.connect() : wallet.disconnect()"
  >
    <span class="font-semibold" :class="[wallet.isConnected && 'group-hover:hidden']">
      {{ wallet.isConnected ? wallet.connectedAddressShort : 'Connect Wallet' }}
    </span>
    <span class="font-semibold hidden" :class="[wallet.isConnected && 'group-hover:inline']">
      Disconnect
    </span>
  </button>
</template>
