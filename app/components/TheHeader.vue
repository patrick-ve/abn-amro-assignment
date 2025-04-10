<template>
  <div class="fixed top-0 left-0 right-0 z-50 h-20 bg-black/50 backdrop-blur-md">
    <header class="container flex items-center justify-between h-full px-6 py-8 mx-auto">
      <div class="flex-1">
        <slot name="left" />
      </div>

      <div class="flex justify-center flex-1">
        <slot name="center">
          <img src="/abnflix_logo.png" alt="ABNFlix Logo" class="h-32">
        </slot>
      </div>

      <div class="flex justify-end flex-1">
        <slot name="right" />
      </div>
    </header>
  </div>
</template>
