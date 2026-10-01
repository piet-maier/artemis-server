<script lang="ts" setup>
import { useConnectionStore } from "@/stores/connection";
import { usePlayerStore } from "@/stores/player";
import { RouterView } from "vue-router";

const { on } = useConnectionStore();

const { readPlayers, subscribe } = usePlayerStore();

on();

readPlayers();

subscribe();
</script>

<template>
  <RouterView />
</template>
