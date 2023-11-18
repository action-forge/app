<script setup lang="ts">
const props = defineProps({ level: { type: Number, default: 0 }, disabled: { type: Boolean, default: false } })
</script>

<template>
  <div
    class="w-full border rounded-full border-normal"
    :class="[!props.disabled && 'bg-white-nav', props.disabled && 'bg-gray']"
  >
    <div
      class="h-2 rounded-full bg-blue-lapis"
      :style="{ width: `${props.level}%`, backgroundImage: 'linear-gradient(90deg, #9EE493 0%, #369 54.69%)' }"
    />
  </div>
</template>
