
import type { NuxtLink } from '#build/components';

<template>
  <footer class="flex items-center w-full border-t border-blue-carolina px-6 py-4 bg-white-nav">
    <span> © 2023 - all rights reserved</span>

    <span class="flex items-center gap-3 ml-auto">
      <NuxtLink to="/" title="twitter - action forge" target="_blank">
        <IconTwitter class="w-8 h-8" />
      </NuxtLink>
      <NuxtLink to="/" title="snapshot - action forge" target="_blank">
        <IconSnapshot class="w-8 h-8" />
      </NuxtLink>
      <NuxtLink to="https://github.com/action-forge" title="github - action forge" target="_blank">
        <IconGithub class="w-8 h-8" />
      </NuxtLink>
    </span>
  </footer>
</template>
