<script lang="ts" setup>
const wallet = useWalletStore()

</script>

<template>
  <button
    class="flex items-center border border-green-light rounded-full p-2.75 px-5"
    @click="!wallet.isConnected ? wallet.connect() : wallet.disconnect()"
  >
    <span class="font-semibold">
      {{ wallet.isConnected ? wallet.connectedAddressShort : 'Connect Wallet' }}
    </span>
  </button>
</template>
