<script lang="ts" setup>
import '@unocss/reset/sanitize/assets.css'
import '@unocss/reset/tailwind.css'
import '~~/asset/css/main.css'
import '~~/asset/css/fonts.css'
</script>

<template>
  <NuxtLayout>
    <NuxtPage :page-key="route => route.fullPath" />
  </NuxtLayout>
</template>
