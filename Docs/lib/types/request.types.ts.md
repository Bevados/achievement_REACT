# lib/types/request.types.ts

## Что делает файл

Файл хранит типы request-объектов для backend-слоя, включая расширенный запрос после аутентификации.

## Импорты и зависимости

1. `@vercel/node` (`VercelRequest`) — базовый тип входящего запроса.

## Экспорты и контракты

1. `AuthenticatedRequest` — расширяет `VercelRequest` и добавляет `userId?: string`.
2. После успешного `verifyAuth` downstream-слои могут рассчитывать на заполненный `req.userId`.

## Нетривиальная логика

1. Тип нужен именно для serverless backend-цепочки и не используется на клиенте.
2. `userId` остаётся optional на уровне типа, потому что поле заполняется runtime-middleware, а не самим request-объектом платформы.

## Где используется

1. `lib/middleware/auth.ts`.
2. Private API handlers в `api/collections/*`.
3. `lib/controllers/collection.controller.ts`.
