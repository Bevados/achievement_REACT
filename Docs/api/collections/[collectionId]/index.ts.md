# api/collections/[collectionId]/index.ts

## Что делает файл

Это serverless entrypoint для маршрута /api/collections/:collectionId.
Файл проверяет авторизацию и делегирует операции чтения/обновления/удаления одной коллекции в контроллер.

## Импорты и зависимости

1. @vercel/node (VercelResponse) - тип ответа.
2. ../../../lib/controllers/collection.controller - handlers getCollection/updateCollection/deleteCollection.
3. ../../../lib/http/api-response - sendError для единых fallback-ошибок.
4. ../../../lib/middleware/auth - verifyAuth.
5. ../../../lib/types/request.types (AuthenticatedRequest) - request с userId.

## Экспорты и контракты

1. export default handler(req, res):
   GET -> getCollection
   PATCH -> updateCollection
   DELETE -> deleteCollection
   иначе -> 405 METHOD_NOT_ALLOWED.
2. Для неотправленного ответа в catch возвращает 500 INTERNAL_ERROR.

## Нетривиальная логика

1. Маршрут приватный: verifyAuth всегда выполняется первым.
2. Валидация collectionId выполняется в контроллере через Zod-схему params.
3. Относительные импорты помогают локальному Vercel runtime корректно резолвить зависимости без alias `@lib/*`.

## Где используется

1. Vercel file-based routing для пути /api/collections/:collectionId.
