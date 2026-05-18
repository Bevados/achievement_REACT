# scripts/dev-backend.ts

## Что делает файл

Файл поднимает отдельный локальный backend server для разработки вместо нестабильного `vercel dev`.
Он обслуживает те же актуальные `/api/*` маршруты, что и production entrypoints, но запускается как обычный Node-процесс через `npm run dev:api`.

## Импорты и зависимости

1. `node:http` — HTTP server для локального runtime.
2. `@vercel/node` — типы для совместимости request/response с существующими handlers.
3. Актуальные `api/collections/*` и `api/examples/collections/*` entrypoint-файлы.

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Запуск выполняется через npm-скрипт `npm run dev:api`.
3. По умолчанию сервер слушает `127.0.0.1:3000`, но порт можно переопределить через `LOCAL_API_PORT`.

## Нетривиальная логика

1. Роутер сопоставляет URL-путь с шаблонами `/api/*` и вызывает уже существующие handlers из `api/`.
2. Локальный runtime адаптирует `IncomingMessage` и `ServerResponse` к минимальному контракту `VercelRequest` / `VercelResponse`.
3. Query string и path params складываются в `req.query`, чтобы не переписывать backend-контроллеры.
4. Невалидный JSON сразу возвращает `400 INVALID_JSON` с русским пользовательским сообщением.
5. В runtime больше нет legacy `/api/items`: локальный сервер обслуживает только актуальные `collections` и `examples`.

## Где используется

1. `npm run dev:api` — локальный backend runtime.
2. `vite.config.ts` — frontend proxy направляет `/api` запросы именно в этот сервер.
3. Все существующие `api/*` entrypoints и `lib/*` backend-слои переиспользуются без дублирования логики.
