# lib/controllers/controller-error.ts

## Что делает файл

Это централизованный mapper ошибок для HTTP-контроллеров.
Файл переводит типы ошибок (валидация, forbidden, not found, транзакции) в единый API-формат и корректные HTTP-статусы.

## Импорты и зависимости

1. @vercel/node (VercelResponse) - тип ответа.
2. zod (ZodError) - распознавание ошибок входной валидации.
3. ../http/api-response - sendError и mapValidationIssues для унифицированного payload.

## Экспорты и контракты

1. handleControllerError(res, error):
   Возвращает API-ошибку с кодом и статусом на основе типа входной ошибки.
2. Локальный helper isErrorWithName(error, name):
   Сужает тип неизвестной ошибки по имени класса через error.name.

## Нетривиальная логика

1. ZodError маппится в 422 VALIDATION_ERROR c массивом details.
2. Ошибки бизнес-слоя маппятся по имени: ForbiddenError -> 403, NotFoundError -> 404, ValidationError -> 422, TransactionError -> 500.
3. Для неизвестных исключений возвращается 500 INTERNAL_ERROR без утечки внутреннего stack trace.

## Где используется

1. lib/controllers/item.controller.ts.
2. lib/controllers/collection.controller.ts.
3. Может переиспользоваться в следующих контроллерах для сохранения единого контракта ошибок.
