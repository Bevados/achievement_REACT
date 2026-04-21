# api/collections/index.ts

## Что делает файл

Это serverless entrypoint для маршрута /api/collections.
Файл проверяет авторизацию и маршрутизирует HTTP-метод к нужному controller-handler.

## Импорты и зависимости

1. @vercel/node (VercelResponse) - тип ответа.
2. @lib/controllers/collection.controller - handlers getCollections/createCollection.
3. @lib/http/api-response - sendError для fallback-ошибок.
4. @lib/middleware/auth - verifyAuth, проверка Bearer-токена.
5. @lib/types/request.types (AuthenticatedRequest) - request с userId.

## Экспорты и контракты

1. export default handler(req, res):
   GET -> controller.getCollections
   POST -> controller.createCollection
   иначе -> 405 METHOD_NOT_ALLOWED в API envelope.
2. При непойманной ошибке возвращает 500 INTERNAL_ERROR, если ответ еще не отправлен.

## Нетривиальная логика

1. verifyAuth вызывается до switch по методам, поэтому маршрут полностью приватный.
2. Проверка res.headersSent защищает от двойного ответа в catch-блоке.

## Где используется

1. Vercel file-based routing автоматически использует файл для пути /api/collections.
