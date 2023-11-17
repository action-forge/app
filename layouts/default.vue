<script lang="ts" setup>
defineOptions({ name: 'DefaultLayout' })
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <Navbar />
    <main class="flex flex-grow w-full h-full">
      <slot />
    </main>

    <Footer />
  </div>
</template>
