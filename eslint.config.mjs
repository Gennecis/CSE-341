import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginReact.configs.flat.recommended,
  eslintPluginPrettier,
  {
    rules: {
      "prettier/prettier": "error",
    },
  },
];
