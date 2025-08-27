<script lang="ts" setup>
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import PageFooter from "@/components/PageFooter.vue";
import PageHeader from "@/components/PageHeader.vue";
import { useConnectionStore } from "@/stores/connection";
import { RouterView } from "vue-router";

const { openSocket } = useConnectionStore();

openSocket();
</script>

<template>
  <PageHeader />

  <RouterView />

  <PageFooter />

  <LoadingIndicator />
</template>
