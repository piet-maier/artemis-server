<script setup lang="ts">
import { format } from "date-fns";

defineProps<{ date: Date }>();
</script>

<template>
  <time :datetime="date.toISOString()">{{ format(date, "PPpp") }}</time>
</template>
