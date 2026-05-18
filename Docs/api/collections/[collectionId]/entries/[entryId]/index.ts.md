# api/collections/[collectionId]/entries/[entryId]/index.ts

## Что делает файл

Это private serverless entrypoint для маршрута `/api/collections/:collectionId/entries/:entryId`.
Файл защищает маршрут через `verifyAuth` и маршрутизирует detail/update/delete карточки.

## Импорты и зависимости

1. `../../../../../lib/middleware/auth`
2. `../../../../../lib/controllers/collection.controller`
3. `../../../../../lib/http/api-response`

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Поддерживаемые методы:
   - `GET`
   - `PATCH`
   - `DELETE`
3. Неподдерживаемые методы получают `405`.

## Нетривиальная логика

1. Маршрут работает только в private owner-контексте.
2. Fallback `500` возвращает единый русский текст внутренней ошибки сервера.

## Где используется

1. Вызывается платформой Vercel как обработчик `api/collections/:collectionId/entries/:entryId`.
2. Используется клиентом через `src/api/collections.api.ts`.
