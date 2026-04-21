# lib/http/api-response.ts

## Что делает файл

Это набор HTTP-утилит для единого API-контракта backend.
Файл стандартизирует успешные и ошибочные ответы, а также нормализует query-параметры и форматирует Zod-ошибки.

## Импорты и зависимости

1. @vercel/node (VercelResponse) - тип ответа serverless-функции.
2. zod (ZodError) - тип для разбора ошибок валидации.

## Экспорты и контракты

1. sendSuccess(res, status, data): отправляет JSON вида { ok: true, data }.
2. sendError(res, status, code, message, details?): отправляет JSON вида { ok: false, error: { code, message, details? } }.
3. getSingleQueryValue(value): берет первое значение из string[] или возвращает string/undefined.
4. normalizeQueryObject(query): преобразует Record<string, string | string[] | undefined> в Record<string, string> без undefined.
5. mapValidationIssues(error): превращает Zod issues в плоский массив { path, message }.
6. ValidationIssuePayload: тип одного элемента details для ошибок валидации.

## Нетривиальная логика

1. sendError добавляет details только если параметр передан, чтобы не раздувать payload.
2. normalizeQueryObject нужен, потому что Vercel query может содержать массивы и undefined.
3. mapValidationIssues использует issue.path.join('.') для удобного отображения ошибок полей на клиенте.

## Где используется

1. Контроллеры backend для формирования единого envelope-ответа.
2. Middleware/auth и API entrypoint-файлы для консистентных fallback-ошибок.
