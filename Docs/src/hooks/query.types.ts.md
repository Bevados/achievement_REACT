# src/hooks/query.types.ts

## Что делает файл

Хранит общие типы query-параметров для списков коллекций и карточек.
Файл нужен, чтобы Query hooks не зависели от legacy/manual-fetch controller-слоя.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` даёт типы категорий, статусов, сортировок и направлений сортировки.

## Экспорты и контракты

1. `CollectionsQuery`
2. `EntriesQuery`

## Нетривиальная логика

1. Файл не содержит runtime-логики и существует как единая точка для shared query-shape между state hooks и Query hooks.

## Где используется

1. `src/hooks/usePrivateCollectionsQueries.ts`
2. `src/hooks/usePrivateEntriesQueries.ts`
3. `src/hooks/usePublicCollectionsQueries.ts`
4. `src/hooks/useCollectionsListController.ts`
5. `src/hooks/useEntriesListController.ts`
