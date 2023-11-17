<template>
  <nav class="flex items-center w-full border-b border-blue-carolina px-6 py-4 bg-white-nav" style="box-shadow: 0px 1px 41.7px 0px rgba(62, 89, 138, 0.05)">
    <NuxtLink class="flex items-center gap-2" to="/" title="Action Forge">
      <IconBrand class="w-10 h-10" />
      <span class="font-semibold text-5 -tracking-0.05">
        ActionForge
      </span>
    </NuxtLink>

    <ConnectWallet class="ml-auto" />
  </nav>
</template>
