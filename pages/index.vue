<script lang="ts" setup>
const snapshot = useSnapshot()
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <ActionBar class="mx-auto max-w-209" :class="[snapshot.snapshotId && 'mt-30']" />
    <div v-if="snapshot.snapshotId" class="mx-auto max-w-216 py-9 w-full">
      <Snapshot />
      <div class="h-1 w-30 border-b border-blue-carolina mx-auto my-8" />
      <div class="flex gap-10">
        <ActionWidget v-if="snapshot.proposal" :proposal="snapshot.proposal" />
        <MyActions />
      </div>
    </div>
  </div>
</template>
