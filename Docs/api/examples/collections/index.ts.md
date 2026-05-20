# api/examples/collections/index.ts

## Что делает файл

Поднимает public Vercel entrypoint для списка example-коллекций в read-only режиме.

## Импорты и зависимости

1. `@vercel/node` — типы `VercelRequest` и `VercelResponse`.
2. `lib/controllers/collection.controller.js` — public read-only handlers.
3. `lib/http/api-response.js` — отправка унифицированных ошибок.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Route обслуживает public `/api/examples/collections`.
3. Auth middleware здесь не используется.

## Нетривиальная логика

1. Route остаётся полностью read-only и делегирует логику public выборки controller/service layer.
2. Явные `.js` в imports нужны для стабильной serverless сборки на Vercel в ESM-режиме.
3. Ошибки приводятся к общему envelope через `sendError`.
4. Верхний `catch` дополнительно логирует неожиданные route-level ошибки, чтобы preview/prod расследование на Vercel не теряло первичный stack trace.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`.
2. Public TanStack Query hooks для списка examples.
