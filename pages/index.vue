<script lang="ts" setup>
const snapshot = useSnapshot()
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <ActionBar class="mx-auto max-w-209" :class="[snapshot.snapshotId && 'mt-20']" />
    <div v-if="snapshot.showAction || snapshot.snapshotId" class="mx-auto max-w-216 py-9 w-full">
      <Snapshot v-if="snapshot.snapshotId" />
      <div class="h-1 w-30 border-b border-blue-carolina mx-auto my-8" />
      <div class="flex gap-10">
        <!-- v-if="snapshot.proposal && snapshot.proposal.state.toLowerCase() !== 'closed'" -->
        <ActionWidget v-if="snapshot.snapshotId" :proposal="snapshot.proposal" />
        <MyActions
          v-if="snapshot.showAction || snapshot.snapshotId"
          class="min-h-40"
          :class="[
            snapshot.showAction && !snapshot.snapshotId && 'mx-auto max-w-120',
          ]"
        />
      </div>
    </div>
  </div>
</template>
