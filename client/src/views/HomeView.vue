<script lang="ts" setup>
import BarChart from "@/components/BarChart.vue";
import Card from "@/components/Card.vue";
import ComboBox from "@/components/ComboBox.vue";
import { socket } from "@/socket";
import { useConnectionStore } from "@/stores/connection";
import { isEmpty } from "lodash";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const connection = useConnectionStore();

const { navigation, plot } = storeToRefs(connection);

const { createGrid } = connection;

const type = ref("");

socket.emit("plot", (data) => {
  plot.value = data;
});
</script>

<template>
  <main
    v-if="!isEmpty(navigation) && !isEmpty(plot)"
    class="container grid items-center justify-items-center gap-4 py-4 sm:py-8 lg:grid-cols-7"
  >
    <Card
      :disabled="!type"
      class="w-full max-w-sm lg:col-span-3"
      header="Create Grid"
      submit="Create"
      @submit="createGrid(type)"
    >
      <ComboBox
        v-model="type"
        :list="Object.keys(navigation).sort()"
        string="Type"
      />
    </Card>

    <Card class="w-full lg:col-span-4">
      <BarChart
        :data="Object.entries(plot).map(([y, x]) => ({ x, y }))"
        class="h-auto w-full"
      />
    </Card>
  </main>
</template>
