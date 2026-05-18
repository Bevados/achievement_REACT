# package.json

## Назначение

Хранит npm scripts и список зависимостей проекта.

## Ключевые scripts

- `dev` — запускает Vite frontend dev server.
- `dev:api` — запускает локальный backend runner для `/api`.
- `build` — делает TypeScript build-check и production build через Vite.
- `lint` — запускает ESLint по проекту.
- `test` — запускает полный Vitest suite.
- `test:smoke` — запускает только короткий smoke-suite для критических MVP-сценариев.
- `docs:check` — проверяет актуальность и полноту документации в `Docs`.
- `release:check` — единый локальный pre-release gate.

## release:check

`release:check` последовательно запускает:

1. `npm run test:smoke`
2. `npm run test`
3. `tsc -b`
4. `npm run build`
5. `npm run lint`
6. `npm run docs:check`

Скрипт завершается с ошибкой на первом failing шаге и не должен менять tracked-файлы репозитория.
