import { onMounted, onUnmounted } from "vue";

export function useWindowEvent<Type extends keyof WindowEventMap>(
  type: Type,
  listener: (this: Window, ev: WindowEventMap[Type]) => any,
) {
  onMounted(() => {
    window.addEventListener(type, listener);
  });

  onUnmounted(() => {
    window.removeEventListener(type, listener);
  });
}
