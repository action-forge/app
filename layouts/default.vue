<script lang="ts" setup>
defineOptions({ name: 'DefaultLayout' })
</script>

<template>
  <div id="__layout" class="flex flex-col w-full h-full relative">
    <Navbar />
    <main class="flex flex-grow w-full h-full">
      <slot />
    </main>

    <Footer />
  </div>
</template>
