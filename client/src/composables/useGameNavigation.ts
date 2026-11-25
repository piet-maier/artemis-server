import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useGameNavigation() {
  const route = useRoute();
  const router = useRouter();

  const targetRoute = computed(() => {
    const target = route.path.startsWith("/grid") ? "chart" : "grid";

    if (
      typeof route.params.type === "string" &&
      typeof route.params.grid === "string"
    ) {
      return {
        name: `${target}-game`,
        params: {
          type: route.params.type,
          grid: route.params.grid,
        },
      };
    }

    return {
      name: `${target}-latest`,
    };
  });

  const href = computed(() => router.resolve(targetRoute.value).href);

  return {
    targetRoute,
    href,
  };
}
