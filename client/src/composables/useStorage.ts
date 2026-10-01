import { ref, watch } from "vue";

/**
 * This composable writes any changes made to the returned `ref` object to the browser's local storage.
 *
 * @example
 * const item = useStorage<number>("item");
 *
 * item.value = 1;
 *
 * localStorage.getItem("item"); // -> "1"
 */
export function useStorage<Item>(
  name: string,
  initialValue: Item | null = null,
) {
  const data = ref(initialValue);

  const storageValue = localStorage.getItem(name);

  if (storageValue !== null) {
    data.value = JSON.parse(storageValue);
  }

  watch(
    data,
    () => {
      if (data.value === null) {
        localStorage.removeItem(name);
      } else {
        localStorage.setItem(name, JSON.stringify(data.value));
      }
    },
    { deep: true },
  );

  return data;
}
