<script setup lang="ts">
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import PageFooter from "@/components/PageFooter.vue";
import PageHeader from "@/components/PageHeader.vue";
import { socket } from "@/socket";
import { usePlayerStore } from "@/stores/player";
import { onUnmounted } from "vue";
import { RouterView } from "vue-router";

const { subscribe } = usePlayerStore();

subscribe();

socket.connect();

onUnmounted(() => {
  socket.disconnect();
});
</script>

<template>
  <PageHeader />

  <RouterView />

  <PageFooter />

  <LoadingIndicator />
</template>
