<script lang="ts" setup>
const commit = __COMMIT__;
</script>

<template>
  <footer
    class="container py-4 text-center text-sm leading-loose text-foreground-muted sm:py-8"
  >
    {{ commit }}
  </footer>
</template>
