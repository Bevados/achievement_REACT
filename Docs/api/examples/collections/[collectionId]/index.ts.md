# api/examples/collections/[collectionId]/index.ts

## Что делает файл

Поднимает public Vercel entrypoint для detail-данных одной example-коллекции.

## Импорты и зависимости

1. `@vercel/node` — `VercelRequest` и `VercelResponse`.
2. `lib/controllers/collection.controller.js` — public detail handler.
3. `lib/http/api-response.js` — единая отправка ошибок.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Route обслуживает public `/api/examples/collections/:collectionId`.
3. API не принимает private auth и не отдаёт private actions.

## Нетривиальная логика

1. Detail route завязан на публичный owner `system_examples` через service/repository layer, а не на данные пользователя.
2. Relative imports используют `.js`, чтобы Vercel Node ESM builder собирал backend без ошибок по отсутствию расширения.
3. Ошибки нормализуются через `sendError`.

## Где используется

1. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`.
2. Public detail TanStack Query hook.
