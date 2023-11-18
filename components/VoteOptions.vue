<script lang="ts" setup>

defineProps({ proposal: { type: Object, required: true } })



</script>

<template>
  <div class="flex flex-col gap-3 text-2.5 text-title">
    <div v-for="result in proposal.results" :key="result.choice" class="flex flex-col gap-1.5">
      <div class="flex items-center gap-4 justify-between">
        <div class="capitalize">
          {{ result.choice }}
        </div>
        <div>
          {{ result.votes }}
          {{ proposal.space.symbol }}
          {{ result.percentage }}%
        </div>
      </div>
      <Progress :level="result.percentage" />
    </div>
  </div>
</template>
