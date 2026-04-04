import { socket } from "@/socket";
import type { Change, Data } from "@/type";
import { isEmpty } from "lodash";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useGridStore = defineStore("grid", () => {
  const data: Data = reactive({
    head: [],
    body: [],
    foot: {},
  });

  function readGrid(type: string, grid: string) {
    socket.emit("grid:read", type, grid, ({ head, body, foot }) => {
      body.push({});

      data.head = head;
      data.body = body;
      data.foot = foot;
    });
  }

  function changeData({ name, number, cell }: Change, foot: number) {
    if (cell !== "") {
      data.body[number][name] = +cell;
    } else {
      delete data.body[number][name];
    }

    if (!isEmpty(data.body[data.body.length - 1])) {
      data.body.push({});
    } else {
      while (data.body.length > 1 && isEmpty(data.body[data.body.length - 2])) {
        data.body.pop();
      }
    }

    data.foot[name] = foot;
  }

  return { data, readGrid, changeData };
});
