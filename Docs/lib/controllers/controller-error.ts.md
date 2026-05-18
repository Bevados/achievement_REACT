# lib/controllers/controller-error.ts

## Что делает файл

Это централизованный mapper ошибок для HTTP-контроллеров.
Файл переводит типы ошибок в единый API-формат и корректные HTTP-статусы.

## Импорты и зависимости

1. `@vercel/node` (`VercelResponse`) — тип ответа.
2. `zod` (`ZodError`) — распознавание ошибок входной валидации.
3. `../http/api-response` — `sendError` и `mapValidationIssues` для унифицированного payload.

## Экспорты и контракты

1. `handleControllerError(res, error)`:
   возвращает API-ошибку с кодом и статусом на основе типа входной ошибки.
2. `isErrorWithName(error, name)`:
   локальный helper для narrowing по `error.name`.

## Нетривиальная логика

1. `ZodError` маппится в `422 VALIDATION_ERROR` c массивом `details`.
2. Ошибки бизнес-слоя маппятся по имени: `ForbiddenError -> 403`, `NotFoundError -> 404`, `ValidationError -> 422`, `TransactionError -> 500`.
3. Публичные сообщения ошибок выровнены под русский пользовательский API-UX.

## Где используется

1. `lib/controllers/collection.controller.ts`.
2. Может переиспользоваться в следующих контроллерах для сохранения единого контракта ошибок.
