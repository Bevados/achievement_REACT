# api/collections/index.ts

## Что делает файл

Это private serverless entrypoint для маршрута `/api/collections`.
Файл защищает маршрут через `verifyAuth` и маршрутизирует `GET` и `POST` в контроллер коллекций.

## Импорты и зависимости

1. `../../lib/middleware/auth` — проверка Bearer-токена.
2. `../../lib/controllers/collection.controller` — handlers списка и создания коллекций.
3. `../../lib/http/api-response` — единый формат ошибок.

## Экспорты и контракты

1. Default export: `handler(req, res)`.
2. Поддерживаемые методы:
   - `GET` — список private-коллекций
   - `POST` — создание private-коллекции
3. Неподдерживаемые методы получают `405`.

## Нетривиальная логика

1. Любая непойманная ошибка возвращает единый `500 INTERNAL_ERROR`.
2. Fallback-ответы backend теперь отдают русское сообщение о внутренней ошибке сервера.

## Где используется

1. Вызывается платформой Vercel как обработчик `api/collections`.
2. Используется клиентом через `src/api/collections.api.ts`.
