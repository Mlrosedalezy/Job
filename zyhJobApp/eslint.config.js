// 导入必要的模块和对象
import { configs as jsConfigs } from '@eslint/js';
import { globals as browserGlobals } from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import { ESLintUtils, configs as typescriptEslintConfigs } from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

export default [
  // 忽略 dist 目录
  {
    ignores: ['dist']
  },
  {
    // 扩展规则集
    extends: [
      jsConfigs.recommended,
      ...typescriptEslintConfigs.recommended
    ],
    // 匹配的文件类型
    files: ['**/*.{ts,tsx}'],
    // 语言选项
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptEslintParser,
      globals: browserGlobals
    },
    // 插件配置
    plugins: {
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin
    },
    // 规则配置
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  }
];