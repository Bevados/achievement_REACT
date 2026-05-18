# lib/middleware/auth.ts

## Что делает файл

Это middleware аутентификации для serverless API-функций.
Файл извлекает Bearer-токен из заголовка `Authorization`, проверяет его через Firebase Admin и записывает `req.userId` для следующих слоёв.

## Импорты и зависимости

1. `@vercel/node` (`VercelResponse`) — типизация HTTP-ответа Vercel API.
2. `../../api/_firebaseAdmin` — инициализированный Firebase Admin SDK для проверки ID-токена.
3. `../types/request.types` (`AuthenticatedRequest`) — тип запроса с полем `userId`.
4. `../http/api-response` (`sendError`) — единый API-envelope для ошибок.

## Экспорты и контракты

1. Экспортируется функция `verifyAuth(req, res): Promise<void>`.
2. Контракт входа: `req.headers.authorization` должен содержать строку формата `Bearer <token>`.
3. Контракт выхода:
   - при успехе функция устанавливает `req.userId`
   - при ошибке отправляет `401` в едином API envelope
4. Пользовательские сообщения об ошибках возвращаются на русском.

## Нетривиальная логика

1. Проверяется не только наличие заголовка, но и обязательный префикс `Bearer `.
2. Любая ошибка в `verifyIdToken` обрабатывается одинаково: `401` без утечки внутренних деталей.
3. Middleware использует исключение после отправки ответа, чтобы верхний слой прекратил выполнение контроллера.

## Где используется

1. В private API entrypoints `api/collections/*`.
2. Косвенно влияет на `lib/controllers/collection.controller.ts`, потому что контроллеры ожидают валидный `req.userId`.
