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
  // FSD layering: restrict upward imports
  {
    files: ['src/entities/**/*.ts', 'src/entities/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['~/features/*', '~/widgets/*', '~/pages/*', '~/app/*'],
              message: 'Слой entities не должен импортировать из верхних слоёв.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.ts', 'src/features/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['~/widgets/*', '~/pages/*', '~/app/*'],
              message: 'Слой features не должен импортировать из верхних слоёв.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/widgets/**/*.ts', 'src/widgets/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['~/pages/*', '~/app/*'],
              message: 'Слой widgets не должен импортировать из верхних слоёв.',
            },
          ],
        },
      ],
    },
  },
  // Enforce public API imports of other slices (shared исключён)
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['~/(entities|features|widgets|pages|app)/*/(ui|model|lib)/*'],
              message:
                'Импортируйте через public API среза (index.ts), без доступа к внутренним подпапкам.',
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
    files: ['src/widgets/todos/ui/TodosWidget.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
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
