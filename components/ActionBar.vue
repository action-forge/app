<script lang="ts" setup>

import { isHex } from 'viem'

const userInput = ref('')
const snapshot = useSnapshot()

function onUserInput () {
  if (userInput.value === '') return snapshot.snapshotId = null

  const snapshotId = userInput.value.split('proposal/').pop()?.slice(0, 66)
  if (isHex(snapshotId) && snapshotId.length === 66)
    snapshot.snapshotId = snapshotId
  else
    snapshot.snapshotId = null

}

function toggleMine () {
  snapshot.showAction = !snapshot.showAction
}

// onMounted(() => {
//   snapshot.snapshotId = '0xa57e0d81ef4fc66ade39318040a6eb960ddb4cc50c73a4589bd29d77579b64c2'
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
        placeholder="Enter Snapshot Proposal URL or ID"
        @input="onUserInput"
      >
    </div>

    <!-- Dots -->
    <svg width="28" height="15" viewBox="0 0 28 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="13" width="15" height="15" rx="7.5" fill="#2F4858" />
      <rect width="15" height="15" rx="7.5" fill="#2F4858" />
      <rect x="6" width="15" height="15" rx="7.5" fill="#9EE493" />
    </svg>

    <button class="group flex items-center gap-4 p-3 px-5 border border-blue-carolina rounded-full shadow-input whitespace-nowrap hover:text-black text-sm leading-0" @click="toggleMine()">
      Your Actions

      <IconArrow class="w-8 h-8 text-blue-carolina group-hover:-mr-2 group-hover:ml-2 transition-all-300" />
    </button>
  </div>
</template>


