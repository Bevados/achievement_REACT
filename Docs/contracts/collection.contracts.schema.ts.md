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

1. Для коллекций введена поддержка `customCategory`, но без отказа от enum `category`.
2. `customCategory` валидируется как аккуратная пользовательская строка длиной до 60 символов.
3. Схемы коллекций и карточек используют пользовательские русские сообщения для обязательности, длины строк, URL, цены, рейтинга и бизнес-правил completed-статуса.
4. Схемы карточек сохраняют уже принятые бизнес-правила:
   - `rating` обязателен для `completed`
   - `dateStart` обязателен для `completed`
   - `dateEnd >= dateStart`
5. Query-схемы продолжают проверять диапазоны рейтинга, цены и дат, тоже с русскими сообщениями.

## Где используется

1. API-handlers в `api/*`
2. Backend-валидация через compatibility-реэкспорт
3. Тесты `lib/validation/collection.schema.test.ts`
