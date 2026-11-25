<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="flex min-h-[calc(100dvh-117px)] flex-col items-center justify-center gap-6 px-4 py-16 sm:min-h-[calc(100dvh-149px)] sm:px-6"
  >
    <div class="flex items-center">
      <h1 class="mr-4 border-r pr-5 text-2xl font-medium">404</h1>

      <h2 class="text-sm text-foreground-muted">Not Found</h2>
    </div>

    <RouterLink
      class="rounded-md border px-4 py-2 text-sm font-medium focus-ring transition-colors hover:bg-background-default-hover"
      to="/"
    >
      Return to Homepage
    </RouterLink>
  </div>
</template>
