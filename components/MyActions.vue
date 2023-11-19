<script lang="ts" setup>
const snapshot = useSnapshot()
const actionTypes = ['Send', 'Borrow GHO', 'Swap To sDai']

function getProposalLink (history: any) {
  return `https://snapshot.org/#/${history.space.id}/proposal/${history.id}`
}
</script>


<template>
  <div class="w-full border border-blue-carolina rounded-xl flex flex-col bg-white-nav p4">
    <div v-if="snapshot.history.length" class="w-full text-xs flex flex-col gap-3">
      <div v-for="history in snapshot.history" :key="history.title" class="flex flex-col border border-blue-carolina rounded p-2">
        <div class="flex items-center">
          <NuxtLink class="font-medium" :to="getProposalLink(history)" :external="true" target="_blank">
            {{ history.title }}
          </NuxtLink>
          <span
            class="text-2.5 px-2 pt-0.5 pb-0.25 text-white uppercase rounded-full"
            :class="[
              history.state.toLowerCase() === 'closed' && 'bg-red',
              history.state.toLowerCase() === 'active' && 'bg-green-6',
              history.state.toLowerCase() === 'pending' && 'bg-gray-500',
            ]"
          >
            {{ history.state }}
          </span>
        </div>
        <div class="flex items-center mt-1">
          Attached with : {{ history.choices[history.proposal_winnerOption] }}
        </div>
        <div class="flex items-center">
          Attached Type : {{ actionTypes[history.action_type] }}
        </div>

        <NuxtLink :to="`https://automation.chain.link/sepolia/${history.upkeepId}`" class="text-blue" :external="true" target="_blank">
          Inspect
        </NuxtLink>
      </div>
    </div>
    <span v-else class="m-auto">
      No Actions
    </span>
  </div>
</template>
