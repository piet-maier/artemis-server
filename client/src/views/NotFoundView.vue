<script lang="ts" setup>
import { ref } from "vue";
const srcs = [
  "https://c.tenor.com/aGj-frNYMFEAAAAC/tenor.gif",
  "https://c.tenor.com/NkREwRhR13cAAAAd/tenor.gif",
  "https://c.tenor.com/PQJeTeX547oAAAAd/tenor.gif",
  "https://c.tenor.com/uzCw1a_IdXgAAAAd/tenor.gif",
  "https://c.tenor.com/A8rvNRKtUCIAAAAd/tenor.gif",
  "https://c.tenor.com/b2iK29wNiCEAAAAd/tenor.gif",
  "https://c.tenor.com/ecQ8WyXHvVcAAAAd/tenor.gif",
];
const selectedSrc = ref(srcs[Math.floor(Math.random() * srcs.length)]);
function randomSrc() {
  let next;
  do {
    next = srcs[Math.floor(Math.random() * srcs.length)];
  } while (next === selectedSrc.value);

  selectedSrc.value = next;
}
</script>
<template>
  <div
    class="flex min-h-[calc(100dvh-117px)] flex-col items-center justify-center px-4 py-16 sm:min-h-[calc(100dvh-149px)] sm:px-6"
  >
    <div class="flex flex-row items-center justify-center px-4 py-16">
      <h1 class="mr-4 border-r pr-5 text-6xl font-medium">404</h1>
      <h2 class="text-xl text-foreground-muted">Not Found</h2>
    </div>
    <img
      class="h-150 cursor-help rounded-xl"
      :src="selectedSrc"
      @click="randomSrc"
    />
  </div>
</template>
