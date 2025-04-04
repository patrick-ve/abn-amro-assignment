<template>
  <header class="fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-20 bg-black/50 backdrop-blur-md px-6 container mx-auto py-8">
    <div class="flex-1">
      <slot name="left" />
    </div>

    <div class="flex-1 flex justify-center">
      <slot name="center">
        <img src="/abnflix_logo.png" alt="ABNFlix Logo" class="h-32">
      </slot>
    </div>

    <div class="flex-1 flex justify-end">
      <slot name="right" />
    </div>
  </header>
</template>
