# api/collections/[collectionId]/entries/[entryId]/index.ts

## Что делает файл

Это serverless entrypoint для маршрута /api/collections/:collectionId/entries/:entryId.
Файл проверяет авторизацию и делегирует обновление/удаление конкретной карточки в контроллер.

## Импорты и зависимости

1. @vercel/node (VercelResponse) - тип ответа.
2. ../../../../../lib/controllers/collection.controller - handlers updateEntry/deleteEntry.
3. ../../../../../lib/http/api-response - sendError для стандартного fallback.
4. ../../../../../lib/middleware/auth - verifyAuth.
5. ../../../../../lib/types/request.types (AuthenticatedRequest) - request с userId.

## Экспорты и контракты

1. export default handler(req, res):
   PATCH -> updateEntry
   DELETE -> deleteEntry
   иначе -> 405 METHOD_NOT_ALLOWED.
2. Для unexpected-ошибок возвращается 500 INTERNAL_ERROR при условии, что ответ еще не отправлен.

## Нетривиальная логика

1. Обязательная аутентификация перед маршрутизацией по методу.
2. Валидация collectionId/entryId и body централизована в контроллере.
3. Относительные импорты нужны для надёжной работы serverless-роута в локальном режиме Vercel.

## Где используется

1. Vercel file-based routing для пути /api/collections/:collectionId/entries/:entryId.
