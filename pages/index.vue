<script lang="ts" setup>
const snapshot = useSnapshot()
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full">
    <ActionBar class="mx-auto max-w-209" :class="[snapshot.snapshotId && 'mt-30']" />
    <div v-if="snapshot.snapshotId" class="mx-auto max-w-216 py-9 w-full">
      <Snapshot />
    </div>
  </div>
</template>
