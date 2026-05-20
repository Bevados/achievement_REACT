# lib/controllers/collection.controller.ts

## Что делает файл

Реализует HTTP-controller слой для всех API операций над коллекциями и карточками: парсит request, валидирует входные данные и делегирует работу в service layer.

## Импорты и зависимости

1. `../services/collection.service.js` — бизнес-логика CRUD и read-only выборок.
2. `../../contracts/collection.contracts.schema.js` — shared Zod-схемы.
3. `./controller-error.js` — единая обработка ошибок controller-слоя.
4. `../http/api-response.js` — helper-функции для query parsing и envelope-ответов.
5. `../types/request.types.js` — private request c auth-контекстом.

## Экспорты и контракты

1. Экспортирует handlers для private и public коллекций/entries.
2. Каждый handler принимает `VercelRequest` или `AuthenticatedRequest` и `VercelResponse`.
3. Controller не хранит бизнес-логику и не работает с MongoDB напрямую.

## Нетривиальная логика

1. Controller собирает params/query/body в единую форму и прогоняет через shared schema.
2. Public и private handlers используют один service layer, но с разными источниками auth/public контекста.
3. Relative imports используют явные `.js`, чтобы весь controller-слой корректно собирался в Vercel Node ESM runtime.

## Где используется

1. Все маршруты `api/collections/*`.
2. Все маршруты `api/examples/collections/*`.
