<script lang="ts" setup>
defineProps({ items: { type: Array<string>, default: () => [] }, dropClass: { type: String, default: '' } })
const target = ref()
const show = ref(false)
const active = defineModel({ default: 0 })

onClickOutside(target, () => {
  show.value = false
})
</script>

<template>
  <div ref="target">
    <button
      id="menu-button"
      type="button"
      class="inline-flex capitalize items-center w-full h-10 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 hover:bg-gray-50 text-left"
      aria-expanded="true"
      aria-haspopup="true"
      @click="show = !show"
    >
      {{ items[active] }}
      <IconArrowBack class="ml-auto w-4 h-4" />
    </button>

    <!-- dropdown -->
    <div
      :class="[!show && 'hidden', dropClass]"
      class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
        <button
          v-for="(item, index) in items"
          :key="item"
          class="w-full text-left capitalize block px-4 py-2 hover:bg-green-honey"
          role="menuitem"
          tabindex="-1"
          :title="item"
          @click="(active = index) && (show = false)"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>
