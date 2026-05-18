# api/examples/collections/index.ts

## Что делает файл

Это public serverless entrypoint для маршрута `/api/examples/collections`.
Файл отдаёт read-only список публичных example-коллекций.

## Импорты и зависимости

1. `../../../lib/controllers/collection.controller`
2. `../../../lib/http/api-response`

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Поддерживаемый метод:
   - `GET`
3. Неподдерживаемые методы получают `405`.

## Нетривиальная логика

1. Маршрут работает без auth и обслуживает только public examples.
2. Fallback `500` возвращает единый русский текст внутренней ошибки сервера.

## Где используется

1. Вызывается платформой Vercel как обработчик `api/examples/collections`.
2. Используется клиентом через `src/api/collections.api.ts`.
