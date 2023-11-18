<script lang="ts" setup>

import { isHex } from 'viem'

const userInput = ref('')
const snapshot = useSnapshot()

function onUserInput () {
  if (userInput.value === '') return

  const snapshotId = userInput.value.split('proposal/').pop()?.slice(0, 66)
  if (isHex(snapshotId) && snapshotId.length === 66)
    snapshot.snapshotId = snapshotId
  else
    snapshot.snapshotId = null

}

// onMounted(() => {
//   snapshot.snapshotId = '0x6c9437b45e8a88978bca68238048fca8c670ed356fa7d4ae9ab9e7e93788c538'
// })
</script>

<template>
  <div class="flex w-full items-center gap-2.5">
    <!-- Search -->
    <div class="flex-grow w-full flex border border-blue-carolina rounded-full px-7.5 py-3.5 shadow-input">
      <input
        v-model="userInput"
        class="unstyled-input h-7 text-xs font-medium w-full"
        type="text"
        placeholder="Snapshot URL or Proposal ID"
        @input="onUserInput"
      >
    </div>

    <!-- Dots -->
    <svg width="28" height="15" viewBox="0 0 28 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="13" width="15" height="15" rx="7.5" fill="#2F4858" />
      <rect width="15" height="15" rx="7.5" fill="#2F4858" />
      <rect x="6" width="15" height="15" rx="7.5" fill="#9EE493" />
    </svg>

    <button class="group flex items-center gap-4 p-3 px-5 border border-blue-carolina rounded-full shadow-input whitespace-nowrap hover:text-black text-sm leading-0">
      Your Actions

      <IconArrow class="w-8 h-8 text-blue-carolina group-hover:-mr-2 group-hover:ml-2 transition-all-300" />
    </button>
  </div>
</template>


