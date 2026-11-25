import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/chart",
      name: "chart-latest",
      component: () => import("@/views/ChartView.vue"),
    },
    {
      path: "/chart/:type/:grid",
      name: "chart-game",
      component: () => import("@/views/ChartView.vue"),
    },
    {
      path: "/grid",
      name: "grid-latest",
      component: () => import("@/views/GridView.vue"),
    },
    {
      path: "/grid/:type/:grid",
      name: "grid-game",
      component: () => import("@/views/GridView.vue"),
    },
    {
      path: "/player-config",
      name: "player-config",
      component: () => import("@/views/PlayerConfigView.vue"),
    },
    {
      path: "/:catchAll(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

export default router;
