# api/examples/collections/index.ts

## Что делает файл

Это публичный serverless entrypoint для маршрута /api/examples/collections.
Файл не требует авторизации и делегирует чтение публичных коллекций в контроллер.

## Импорты и зависимости

1. @vercel/node (VercelRequest, VercelResponse) - типы HTTP.
2. ../../../lib/controllers/collection.controller - handler getPublicCollections.
3. ../../../lib/http/api-response - sendError для единых fallback-ошибок.

## Экспорты и контракты

1. export default handler(req, res):
   GET -> getPublicCollections
   иначе -> 405 METHOD_NOT_ALLOWED.
2. В catch возвращает 500 INTERNAL_ERROR при отсутствии уже отправленного ответа.

## Нетривиальная логика

1. Это единственный endpoint блока collections, который intentionally публичный (без verifyAuth).
2. Ошибки также возвращаются в unified API envelope, как и в приватных маршрутах.
3. Относительные импорты выбраны специально для стабильной работы local `vercel dev` без зависимости от alias `@lib/*`.

## Где используется

1. Vercel file-based routing для пути /api/examples/collections.
