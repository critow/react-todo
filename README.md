# React Todo

Небольшое приложение на React + TypeScript + Vite с TailwindCSS и dnd-kit.

Стек
- React + TypeScript + Vite
- TailwindCSS
- dnd-kit (сортировка задач перетаскиванием)
- ESLint + Prettier + Husky + lint-staged + Commitlint
- Vitest (тесты)

Запуск
- Установка: `yarn`
- Dev-сервер: `yarn dev`
- Линт: `yarn lint`
- Формат-проверка: `yarn format:check`
- Проверка типов: `yarn typecheck`
- Тесты: `yarn test`

CI
- Workflow: `.github/workflows/ci.yml` — запускает lint, формат-проверку, typecheck и тесты на push/PR (Node 18/20).

Бэйдж CI
Замените `<OWNER>` и `<REPO>` на свой GitHub логин и имя репозитория:

![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)

GitHub Pages
- Автодеплой из ветки `main` настроен в `.github/workflows/pages.yml`.
- В процессе сборки `BASE_URL` выставляется как `/<REPO>/`, чтобы Vite корректно резолвил ассеты.
- После первого пуша в `main` зайдите в Settings → Pages и убедитесь, что Source = “GitHub Actions”.
- Ссылка будет формата: `https://<OWNER>.github.io/<REPO>/`.
