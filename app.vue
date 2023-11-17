<script lang="ts" setup>
import '@unocss/reset/tailwind.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
</template>
