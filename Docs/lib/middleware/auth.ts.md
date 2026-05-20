# lib/middleware/auth.ts

## Что делает файл

Проверяет Bearer token в private API запросах и дописывает decoded Firebase user в `req.user`.

## Импорты и зависимости

1. `@vercel/node` — тип `VercelResponse`.
2. `../../api/_firebaseAdmin.js` — Firebase Admin SDK.
3. `../types/request.types.js` — `AuthenticatedRequest`.
4. `../http/api-response.js` — helper для унифицированных auth-ошибок.

## Экспорты и контракты

1. Экспортирует `verifyAuth(req, res)`.
2. При успехе функция не возвращает значение и только мутирует `req.user`.
3. При провале сама отправляет HTTP-ошибку и бросает исключение для остановки handler flow.

## Нетривиальная логика

1. Middleware отделяет отсутствие заголовка, невалидный формат и невалидный токен.
2. Тексты auth-ошибок приведены к русской policy backend-а.
3. Импорт `../../api/_firebaseAdmin.js` использует явное расширение для совместимости с Vercel Node ESM runtime.

## Где используется

1. Все private `api/collections*` handlers.
