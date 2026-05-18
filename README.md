# Achievement Collections MVP

Учебный fullstack-проект на React + TypeScript с публичными example-коллекциями и приватным CRUD для пользовательских коллекций и карточек.

## Локальная разработка

- `npm run dev` — frontend на Vite
- `npm run dev:api` — локальный backend runtime на `http://127.0.0.1:3000`

Во время локальной разработки Vite проксирует запросы `/api/*` в отдельный backend-процесс.  
Файлы `api/*` остаются production-entrypoints для деплоя на Vercel.

## Основные команды

- `npm run test:smoke` — короткий smoke-набор критических сценариев
- `npm run test` — полный тестовый набор
- `tsc -b` — TypeScript-проверка
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run docs:check` — проверка синхронизации Docs
- `npm run release:check` — единый локальный pre-release gate

## Локальный pre-release gate

`npm run release:check` последовательно запускает:

1. `npm run test:smoke`
2. `npm run test`
3. `tsc -b`
4. `npm run build`
5. `npm run lint`
6. `npm run docs:check`

Скрипт останавливается на первом failing шаге и используется как основной локальный release-check для MVP.

## CI

В репозитории настроен GitHub Actions workflow `Release Check`, который запускает `npm run release:check` на `push` в `master` и на `pull_request`.

## Архитектура

- `src/` — frontend
- `api/` — Vercel-style API entrypoints
- `lib/` — controllers / services / repositories / middleware
- `contracts/` — shared DTO и schema-контракты
- `Docs/` — зеркальная документация по коду
- `scripts/` — служебные скрипты проекта

Backend flow:

`api/* -> lib/controllers -> lib/services -> lib/repositories -> MongoDB`

## Основные маршруты

Public:

- `/`
- `/examples`
- `/examples/:collectionId/:collectionSlug?`

Private:

- `/collections`
- `/collections/:collectionId/:collectionSlug?`
- `/profile`

## Документация

- Карта связей файлов: [DOCS_FILE_MAP.md](DOCS_FILE_MAP.md)
- Визуальная карта исполнения: [DOCS_EXECUTION_VISUAL.md](DOCS_EXECUTION_VISUAL.md)
- Подробная документация по исходникам: папка `Docs/`
