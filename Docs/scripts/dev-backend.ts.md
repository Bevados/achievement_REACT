# scripts/dev-backend.ts

## Что делает файл

Файл поднимает отдельный локальный backend server для разработки вместо нестабильного `vercel dev`.
Он обслуживает те же `/api/*` маршруты, что и Vercel entrypoints, но запускается как обычный Node-процесс через `npm run dev:api`.

## Импорты и зависимости

1. `node:http` — HTTP server для локального runtime.
2. `@vercel/node` типы используются для совместимости request/response с существующими handlers.
3. `api/*` entrypoint-файлы импортируются как готовые route handlers.

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Запуск выполняется через npm-скрипт `npm run dev:api`.
3. По умолчанию сервер слушает `127.0.0.1:3000`, но порт можно переопределить через `LOCAL_API_PORT`.

## Нетривиальная логика

1. Роутер сопоставляет URL-путь с шаблонами `/api/*` и вызывает уже существующие handlers из `api/`.
2. Локальный runtime адаптирует `IncomingMessage` и `ServerResponse` к минимальному контракту `VercelRequest` / `VercelResponse`, который уже ожидают controllers и middleware.
3. Query string и path params складываются в `req.query`, чтобы не переписывать backend-контроллеры.
4. JSON body парсится до вызова handler, а невалидный JSON сразу возвращает `400 INVALID_JSON`.
5. Private routes продолжают использовать реальный `verifyAuth`, поэтому локальный backend проверяет Firebase token так же, как production API.

## Где используется

1. `npm run dev:api` — локальный backend runtime.
2. `vite.config.ts` — frontend proxy направляет `/api` запросы именно в этот сервер.
3. Все существующие `api/*` entrypoints и `lib/*` backend-слои переиспользуются без дублирования логики.
