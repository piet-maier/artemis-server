<script lang="ts" setup>
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import PageFooter from "@/components/PageFooter.vue";
import PageHeader from "@/components/PageHeader.vue";
import { useConnectionStore } from "@/stores/connection";
import { RouterView } from "vue-router";
import { usePlayerStore } from "./stores/player";

const { openSocket } = useConnectionStore();

const { readPlayers, subscribe } = usePlayerStore();

openSocket();

readPlayers();

subscribe();
</script>

<template>
  <PageHeader />

  <RouterView />

  <PageFooter />

  <LoadingIndicator />
</template>
