import { ref, watch } from "vue";

const PREFIX = "theme-";

export function useTheme(initialValue = "") {
  const themeValue = ref(initialValue);

  watch(
    themeValue,
    () => {
      const html = document.documentElement;

      for (const name of html.classList) {
        if (name.startsWith(PREFIX)) {
          html.classList.remove(name);
        }
      }

      if (themeValue.value) {
        html.classList.add(PREFIX + themeValue.value);
      }
    },
    { immediate: true },
  );

  return themeValue;
}
