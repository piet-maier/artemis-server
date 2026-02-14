import pluginVitest from "@vitest/eslint-plugin";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";
import skipFormatting from "eslint-config-prettier/flat";
import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.ts", "**/*.vue"],
  },
  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),
  ...pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },
  skipFormatting,
);
