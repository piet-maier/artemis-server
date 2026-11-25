import { useRoute, useRouter } from "vue-router";

export function useGameNavigation() {
  const route = useRoute();
  const router = useRouter();

  function toggleView() {
    const target = route.path.startsWith("/grid") ? "chart" : "grid";

    if (
      typeof route.params.type === "string" &&
      typeof route.params.grid === "string"
    ) {
      router.push({
        name: `${target}-game`,
        params: {
          type: route.params.type,
          grid: route.params.grid,
        },
      });
    } else {
      router.push({
        name: `${target}-latest`,
      });
    }
  }

  return { toggleView };
}
