# api/examples/collections/index.ts

## Что делает файл

Vercel entrypoint для публичного списка example-коллекций.

## Импорты и зависимости

1. `@vercel/node` даёт типы `VercelRequest` и `VercelResponse`.
2. `lib/controllers/collection.controller.js` обрабатывает read-only public collection flow.
3. `lib/http/api-response.js` формирует унифицированный error-response.

## Экспорты и контракты

1. Экспортируется default `handler(req, res)`.
2. Поддерживается только `GET`.
3. Любой неподдерживаемый метод получает `405 METHOD_NOT_ALLOWED`.

## Нетривиальная логика

1. Route-слой не дублирует логирование ошибок: финальный ответ об ошибке возвращается без второго `console.error`.
2. Если ответ уже отправлен deeper-слоем, handler просто завершает выполнение.

## Где используется

1. Путь `/api/examples/collections`.
2. `src/api/collections.api.ts` в `getPublicCollections`.
