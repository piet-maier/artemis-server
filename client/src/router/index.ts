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
      path: "/grid/:type/:grid",
      name: "grid",
      component: () => import("@/views/GridView.vue"),
    },
    {
      path: "/player-config",
      name: "player-config",
      component: () => import("@/views/PlayerConfigView.vue"),
    },
  ],
});

export default router;
