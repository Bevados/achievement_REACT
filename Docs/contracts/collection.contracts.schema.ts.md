# contracts/collection.contracts.schema.ts

## Что делает файл

Файл хранит Zod-схемы для runtime-валидации контрактов коллекций и карточек.
Он проверяет create/update payloads, route params и query-объекты для списков.

## Импорты и зависимости

1. `zod` — runtime-валидация.
2. `./collection.contracts` — enum-константы и DTO-типы, над которыми строятся схемы.

## Экспорты и контракты

1. Схемы params:
   - `objectIdSchema`
   - `collectionIdParamSchema`
   - `collectionAndEntryIdsParamSchema`
2. Схемы коллекций:
   - `createCollectionSchema`
   - `updateCollectionSchema`
3. Схемы карточек:
   - `createEntrySchema`
   - `updateEntrySchema`
4. Схемы query:
   - `baseListQuerySchema`
   - `collectionListQuerySchema`
   - `entryListQuerySchema`

## Нетривиальная логика

1. Для коллекций поддерживается модель `category='other' + customCategory`, при этом `customCategory` обязателен для create-потока, если выбран `other`.
2. Схемы карточек проверяют бизнес-правила completed-статуса:
   - `rating` обязателен для `completed`
   - `dateStart` обязателен для `completed`
   - `dateEnd` не может быть раньше `dateStart`
3. Query-схемы валидируют диапазоны рейтинга, цены и дат с русскими пользовательскими сообщениями.

## Где используется

1. В API-handlers `api/collections/*` и `api/examples/collections/*`.
2. В backend-валидации через compatibility-реэкспорты.
3. В тестах `lib/validation/collection.schema.test.ts`.
