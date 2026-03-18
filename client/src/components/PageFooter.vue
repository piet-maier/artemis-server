<script lang="ts" setup>
const packageVersion = __PACKAGE_VERSION__;
</script>

<template>
  <footer
    class="container py-4 text-center text-sm leading-loose text-foreground-default-muted tabular-nums sm:py-8"
  >
    {{ packageVersion }}
  </footer>
</template>
