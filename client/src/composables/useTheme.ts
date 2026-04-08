import { useStorage } from "@/composables/useStorage";
import { watch, type Ref } from "vue";

const PREFIX = "theme-";

/**
 * This composable adds the value of the returned `ref` object as a class with the prefix "theme-" to the HTML element.
 *
 * @example
 * const theme = useTheme();
 *
 * theme.value = "dark";
 *
 * document.documentElement.className; // -> "theme-dark"
 */
export function useTheme(initialValue = "") {
  const themeValue = useStorage("theme", initialValue) as Ref<string>;

  watch(
    themeValue,
    () => {
      const html = document.documentElement;

      html.classList.add("transition-none");

      for (const name of html.classList) {
        if (name.startsWith(PREFIX)) {
          html.classList.remove(name);
        }
      }

      if (themeValue.value) {
        html.classList.add(PREFIX + themeValue.value);
      }

      // https://paco.me/writing/disable-theme-transitions
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = window.getComputedStyle(html).opacity;

      html.classList.remove("transition-none");
    },
    { immediate: true },
  );

  return themeValue;
}
