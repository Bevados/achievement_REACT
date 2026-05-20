# api/collections/index.ts

## Что делает файл

Поднимает private Vercel entrypoint для списка коллекций пользователя: чтение списка и создание новой коллекции.

## Импорты и зависимости

1. `@vercel/node` — тип `VercelResponse`.
2. `lib/controllers/collection.controller.js` — HTTP-обработчики коллекций.
3. `lib/http/api-response.js` — унифицированная отправка ошибок.
4. `lib/middleware/auth.js` — проверка Bearer token.
5. `lib/types/request.types.js` — типизированный `AuthenticatedRequest`.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Route обслуживает private `/api/collections`.
3. Перед входом в controller всегда выполняется `verifyAuth`.

## Нетривиальная логика

1. Handler не хранит бизнес-логику: он только проверяет auth и делегирует в controller.
2. Все относительные server imports используют явные `.js`, чтобы production build на Vercel был совместим с Node ESM resolver.
3. Общий `catch` приводит неожиданные ошибки к единому API envelope через `sendError`.

## Где используется

1. Private frontend flow `/collections`.
2. CRUD-мутации создания коллекции.
