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
      class="w-full max-w-sm lg:col-span-3"
      :disabled="!type"
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

    <Card class="w-full lg:col-span-4" header="" submit="">
      <BarChart
        class="h-auto w-full"
        :data="Object.entries(plot).map(([y, x]) => ({ x, y }))"
      />
    </Card>
    <div class="col-span-3 col-start-3">
      <h2 class="my-4 text-center text-2xl font-bold">Todays Sponsor:</h2>
      <a href="https://raidshadowlegends.com/">
        <img
          class="h-1/4 rounded-2xl"
          src="https://m.media-amazon.com/images/M/MV5BNTM5OWU5NGQtZjg4Mi00ZDUzLWFkYmUtODA1ZDJmNTY4ZjFmXkEyXkFqcGc@._V1_.jpg"
        />
      </a>
    </div>
  </main>
</template>
