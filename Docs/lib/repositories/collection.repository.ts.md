# lib/repositories/collection.repository.ts

## Что делает файл

Хранит низкоуровневые MongoDB-операции для коллекций и карточек: выборки, создание, обновление, удаление и серверные фильтры.

## Импорты и зависимости

1. `mongodb` — типы фильтров, сортировок и результатов операций.
2. `../../api/_mongodb.js` — доступ к MongoDB collection helper.
3. `../types/collection.types.js` — документы, DTO и `SYSTEM_EXAMPLES_OWNER_ID`.

## Экспорты и контракты

1. Экспортирует CRUD-функции для collections и entries.
2. Экспортирует read-only выборки для public examples и private owner flow.
3. Все функции работают только с документами и не содержат бизнес-правил доступа.

## Нетривиальная логика

1. Repository собирает MongoDB-фильтры для status/date/price/rating/pagination/sort.
2. Public examples жёстко привязаны к `SYSTEM_EXAMPLES_OWNER_ID`.
3. Relative imports на `api/_mongodb.js` и `collection.types.js` используют явные `.js` для Vercel server-side ESM build.

## Где используется

1. `lib/services/collection.service.ts`.
2. Тесты repository/service слоя.
