<script lang="ts" setup>
const wallet = useWalletStore()

function copy () {
  wallet.connectedAddress && useClipboard().copy(wallet.connectedAddress)
}

</script>

<template>
  <button
    class=" flex items-center gap-3 border border-green-light rounded-full p-2.75 px-5 font-semibold"
    @click="!wallet.isConnected && wallet.connect()"
  >
    <span v-if="!wallet.isConnected" class="flex items-center">
      Connect Wallet
    </span>
    <span v-else class="group flex items-center gap-2">
      <span class="group-hover:hidden inline">
        {{ wallet.connectedAddressShort }}
      </span>
      <span class="group-hover:inline hidden">
        Disconnect
      </span>
    </span>
    <IconCopy v-if="wallet.isConnected" class="w-5 h-5 -mt-1" @click="copy" />
  </button>
</template>
