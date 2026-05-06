# api/collections/[collectionId]/entries/index.ts

## Что делает файл

Это serverless entrypoint для маршрута /api/collections/:collectionId/entries.
Файл проверяет авторизацию и делегирует получение/создание карточек (entries) контроллеру.

## Импорты и зависимости

1. @vercel/node (VercelResponse) - тип ответа.
2. ../../../../lib/controllers/collection.controller - handlers getEntries/createEntry.
3. ../../../../lib/http/api-response - sendError для 405/500.
4. ../../../../lib/middleware/auth - verifyAuth.
5. ../../../../lib/types/request.types (AuthenticatedRequest) - request с userId.

## Экспорты и контракты

1. export default handler(req, res):
   GET -> getEntries
   POST -> createEntry
   иначе -> 405 METHOD_NOT_ALLOWED.
2. Внутренние исключения обрабатываются fallback-ответом 500, если headers еще не отправлены.

## Нетривиальная логика

1. Авторизация обязательна для всех методов маршрута.
2. Параметр collectionId и query/тело запроса валидируются уже в collection.controller.
3. Относительные пути снижают риск `FUNCTION_INVOCATION_FAILED` в local `vercel dev`.

## Где используется

1. Vercel file-based routing для пути /api/collections/:collectionId/entries.
