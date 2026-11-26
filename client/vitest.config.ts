import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude],
      root: fileURLToPath(new URL("./", import.meta.url)),
      setupFiles: ["./test/global.ts"],
      coverage: {
        include: ["src/**/*.ts", "src/**/*.vue"],
      },
    },
  }),
);
