# contracts/collection.contracts.schema.ts

## Что делает файл

Файл хранит общие Zod-схемы контрактного слоя Collection/Entry.
Схемы валидируют params/query/body по тем же правилам, что и backend-контроллеры, и могут использоваться как единый runtime-контракт.

## Импорты и зависимости

1. `zod` - runtime-валидация и нормализация входных данных.
2. `./collection.contracts` - enum-константы и DTO-типы, чтобы схема и TypeScript-контракты были согласованы.

## Экспорты и контракты

1. Базовые схемы идентификаторов:
   - `objectIdSchema`.
   - `collectionIdParamSchema`.
   - `collectionAndEntryIdsParamSchema`.
2. Body-схемы:
   - `createCollectionSchema`, `updateCollectionSchema`.
   - `createEntrySchema`, `updateEntrySchema`.
3. Query-схемы:
   - `baseListQuerySchema`.
   - `collectionListQuerySchema`.
   - `entryListQuerySchema`.

## Нетривиальная логика

1. `price` проверяется как number >= 0 с максимум 2 знаками после точки.
2. `tags` ограничены по размеру и дедуплицируются на уровне схемы.
3. PATCH-схемы требуют непустой payload (минимум одно поле).
4. Для query действует `z.coerce.number`, чтобы корректно читать строковые query-параметры.
5. Для entry list есть межполевая проверка `minRating <= maxRating`.

## Где используется

1. `lib/controllers/collection.controller.ts` - основная валидация входа в API.
2. `lib/validation/collection.schema.ts` - compatibility re-export для обратной совместимости импортов.
3. `lib/validation/collection.schema.test.ts` - контрактные тесты private schema-правил.
