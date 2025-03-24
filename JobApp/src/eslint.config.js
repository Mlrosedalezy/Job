// import globals from "globals";
// import pluginJs from "@eslint/js";
// import pluginReact from "eslint-plugin-react";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.{js,mjs,cjs,jsx}"]},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ];

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    react(),
    // 添加 eslint 插件配置
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.jsx', 'src/*.js', 'src/*.jsx']
    })
  ],
  resolve: {
    alias: {
    },
  },
})
