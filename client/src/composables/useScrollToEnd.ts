import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";

export function useScrollToEnd() {
  const containerRef = ref<HTMLElement | null>(null);
  const endRef = ref<HTMLElement | null>(null);

  const atBottom = ref(true);
  const intersecting = ref(false);

  function handleScroll({ target }: Event) {
    if (target instanceof HTMLElement) {
      atBottom.value =
        target.scrollTop + target.clientHeight >= target.scrollHeight;
    }
  }

  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    intersecting.value = isIntersecting;
  });

  onMounted(() => {
    containerRef.value?.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    if (endRef.value) {
      observer.observe(endRef.value);
    }
  });

  onBeforeUnmount(() => {
    containerRef.value?.removeEventListener("scroll", handleScroll);

    observer.disconnect();
  });

  watchEffect(() => {
    if (atBottom.value && !intersecting.value) {
      containerRef.value?.scrollTo({
        top: containerRef.value.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  return { containerRef, endRef };
}
