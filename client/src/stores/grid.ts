import { socket } from "@/socket";
import type { Change, Data } from "@/type";
import { isEmpty } from "lodash";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useGridStore = defineStore("grid", () => {
  const date = ref<Date>();

  const data: Data = reactive({
    head: [],
    body: [],
    foot: {},
  });

  function readGrid(grid: number) {
    socket.emit("grid:read", grid, (unixTime, { head, body, foot }) => {
      date.value = new Date(+unixTime);

      body.push({});

      data.head = head;
      data.body = body;
      data.foot = foot;
    });
  }

  function changeData({ player, number, cell }: Change, foot: number) {
    if (cell !== "") {
      data.body[number][player] = +cell;
    } else {
      delete data.body[number][player];
    }

    if (!isEmpty(data.body[data.body.length - 1])) {
      data.body.push({});
    } else {
      while (data.body.length > 1 && isEmpty(data.body[data.body.length - 2])) {
        data.body.pop();
      }
    }

    data.foot[player] = foot;
  }

  return { date, data, readGrid, changeData };
});
