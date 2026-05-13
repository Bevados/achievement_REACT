# contracts/collection.contracts.ts

## Что делает файл

Файл хранит общий контрактный слой домена Collection/Entry, который используется и на frontend, и на backend.
Здесь описаны enum-константы, DTO входа, view-модели выхода, пагинация и общий формат API-ответа.

## Импорты и зависимости

1. Файл не зависит от MongoDB, Node-only API или UI-кода.
2. Эти типы используются runtime-схемами в `contracts/collection.contracts.schema.ts` и backend-слоем через `lib/types/collection.types.ts`.

## Экспорты и контракты

1. Enum-like константы и типы:
   - `COLLECTION_CATEGORIES` / `CollectionCategory`
   - `ENTRY_STATUSES` / `EntryStatus`
   - `SORT_ORDERS` / `SortOrder`
   - `COLLECTION_SORT_FIELDS` / `CollectionSortField`
   - `ENTRY_SORT_FIELDS` / `EntrySortField`
   - `SYSTEM_EXAMPLES_OWNER_ID`
2. DTO для коллекций:
   - `CreateCollectionDto`
   - `UpdateCollectionDto`
3. DTO для карточек:
   - `CreateEntryDto`
   - `UpdateEntryDto`
4. Query и пагинация:
   - `BaseListQueryDto`
   - `CollectionListQueryDto`
   - `EntryListQueryDto`
   - `PaginationMeta`
   - `PaginatedResult<T>`
5. API-envelope:
   - `ApiErrorPayload`
   - `ApiSuccessResponse<T>`
   - `ApiErrorResponse`
   - `ApiResponse<T>`

## Нетривиальная логика

1. Для коллекций добавлено поле `customCategory?: string`, но базовый `category` остаётся enum.
2. Это означает, что “своя категория” хранится как безопасная комбинация:
   - `category = 'other'`
   - `customCategory = '<текст пользователя>'`
3. Такой подход не ломает текущие фильтры, сортировки и backend-инварианты по enum-категориям.
4. Для Entry одна дата и период по-прежнему хранятся как `dateStart/dateEnd`, а не как отдельные UI-режимы в DTO.

## Где используется

1. `contracts/collection.contracts.schema.ts`
2. `lib/types/collection.types.ts`
3. `lib/services/collection.service.ts`
4. `src/api/collections.api.ts`
5. Компоненты и страницы, которые читают `CollectionView`/`EntryView`
