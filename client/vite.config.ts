import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

const commit = execSync("git rev-parse --short HEAD")
  .toString()
  .replace(/\n/, "");

// https://vite.dev/config/
export default defineConfig({
  define: {
    __COMMIT__: JSON.stringify(commit),
  },
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
