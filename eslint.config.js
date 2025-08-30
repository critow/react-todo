import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: { react: { version: 'detect' } },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React
      'react/react-in-jsx-scope': 'off',
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Import style
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
            {
              group: ['../../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
            {
              group: ['../../../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
            {
              group: ['../../../../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
            {
              group: ['./../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
            {
              group: ['./../../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
            {
              group: ['./../../../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
            {
              group: ['./../../../../../*'],
              message: 'Используйте алиас ~ вместо глубоких относительных импортов.',
            },
          ],
        },
      ],
    },
  },
  // Node окружение для конфигов/скриптов
  {
    files: ['*.cjs'],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'commonjs',
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'module',
    },
    rules: {
      // Разрешаем escape-последовательности в регэкспах утилитных скриптов
      'no-useless-escape': 'off',
      // В node-скриптах доступны process, __dirname и т.п.
      'no-undef': 'off',
    },
  },
  {
    files: [
      'vite.config.ts',
      'vite.config.js',
      'tailwind.config.js',
      'postcss.config.js',
      'eslint.config.js',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  eslintConfigPrettier,
]
