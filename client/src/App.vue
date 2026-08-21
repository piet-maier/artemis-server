<script lang="ts" setup>
import { useConnectionStore } from "@/stores/connection";
import { RouterView } from "vue-router";

const { on } = useConnectionStore();

on();
</script>

<template>
  <RouterView />
</template>
