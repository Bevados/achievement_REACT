# api/collections/[collectionId]/index.ts

## Что делает файл

Поднимает private Vercel entrypoint для detail-операций над одной коллекцией: чтение, редактирование и удаление.

## Импорты и зависимости

1. `@vercel/node` — тип `VercelResponse`.
2. `lib/controllers/collection.controller.js` — detail CRUD-обработчики коллекции.
3. `lib/http/api-response.js` — стандартная отправка ошибок.
4. `lib/middleware/auth.js` — проверка Bearer token.
5. `lib/types/request.types.js` — типизированный private request.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Route обслуживает private `/api/collections/:collectionId`.
3. Доступ разрешён только владельцу коллекции.

## Нетривиальная логика

1. Auth выполняется до делегирования в controller, чтобы business layer получал уже авторизованный request.
2. Все относительные imports переведены на явные `.js` для стабильной сборки Vercel serverless functions в Node ESM режиме.
3. Ошибки из controller/service layer приводятся к общему JSON envelope через `sendError`.

## Где используется

1. Private detail page `/collections/:collectionId/:collectionSlug?`.
2. CRUD-операции редактирования и удаления коллекции.
