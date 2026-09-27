import router from "@/router/index";
import { socket } from "@/socket";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useConnectionStore = defineStore("connection", () => {
  const open = ref(false);

  const navigation = ref<Record<string, { id: number; unixTime: number }[]>>(
    {},
  );

  const plot = ref<Record<string, number>>({});

  function openSocket() {
    socket.on("connect", () => {
      open.value = true;

      socket.emit("navigation", (record) => {
        navigation.value = record;
      });
    });

    socket.on("disconnect", () => {
      open.value = false;
    });

    socket.on("grid:create", (type, id, unixTime) => {
      if (!(type in navigation.value)) {
        // Add the new array at the start of the object.
        navigation.value = { [type]: [], ...navigation.value };
      }

      navigation.value[type].unshift({ id, unixTime });
    });

    socket.connect();
  }

  function createGrid(type: string) {
    if (type !== "") {
      socket.emit("grid:create", type, (id, unixTime) => {
        navigation.value[type] ??= [];

        navigation.value[type].unshift({ id, unixTime });

        // noinspection JSIgnoredPromiseFromCall
        router.push("/grid/" + type + "/" + id);
      });
    }
  }

  return { open, navigation, plot, openSocket, createGrid };
});
