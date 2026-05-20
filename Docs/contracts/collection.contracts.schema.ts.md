# contracts/collection.contracts.schema.ts

## Что делает файл

Хранит shared Zod-схемы для API параметров, query и DTO коллекций и карточек.

## Импорты и зависимости

1. `zod` — базовый конструктор схем и refinement-проверок.
2. `./collection.contracts.js` — shared типы и enum-значения контрактов.

## Экспорты и контракты

1. Экспортирует schema-объекты для params, query, create/update DTO.
2. Используется и на backend, и на клиенте как единый источник контрактов.
3. Содержит инварианты для `completed` entry и пользовательской категории `other`.

## Нетривиальная логика

1. Схемы хранят условные проверки вроде `customCategory required for other`, `rating/dateStart required for completed`, `dateEnd >= dateStart`.
2. Импорт shared contracts переведён на `./collection.contracts.js`, потому что schema участвует в Vercel server-side ESM build.
3. Сообщения ошибок ориентированы на пользовательский русскоязычный UX, а не на технические формулировки Zod по умолчанию.

## Где используется

1. `lib/controllers/collection.controller.ts`.
2. Клиентские CRUD-формы через локальный RHF/Zod adapter.
3. Тесты контрактов и валидации.
