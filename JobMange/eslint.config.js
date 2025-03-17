import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    "env": {
      "browser": true,
      "es6": true,
    },
    "extends": [
      "eslint:recommended",  //自带的规则
      "plugin:react/recommended", //react的规则
    ],
    "parserOptions": {
      "ecmaVersion": 2020,
      "sourceType": "module",
    },
    "plugins":["prettier", "react"],
    "rules": {
      "prettier/prettier": "error",
      // 其他规则
    }
  }
];