# contracts/collection.contracts.ts

## Что делает файл

Файл хранит общий контрактный слой домена Collection/Entry, который можно безопасно использовать и на frontend, и на backend.
Здесь находятся enum-константы, DTO входа, view-модели выхода, пагинация и общий формат API-ответа.

## Импорты и зависимости

1. Файл не импортирует инфраструктурные зависимости и не зависит от MongoDB/Node-only кода.
2. Типы и константы из этого файла используются runtime-схемами в `contracts/collection.contracts.schema.ts`.

## Экспорты и контракты

1. Enum-like константы и типы:
   - `COLLECTION_CATEGORIES` / `CollectionCategory`.
   - `ENTRY_STATUSES` / `EntryStatus`.
   - `SORT_ORDERS` / `SortOrder`.
   - `COLLECTION_SORT_FIELDS` / `CollectionSortField`.
   - `ENTRY_SORT_FIELDS` / `EntrySortField`.
   - `SYSTEM_EXAMPLES_OWNER_ID`.
2. DTO для входных данных API:
   - `CreateCollectionDto`, `UpdateCollectionDto`.
   - `CreateEntryDto`, `UpdateEntryDto`.
3. DTO для query и пагинации:
   - `BaseListQueryDto`, `CollectionListQueryDto`, `EntryListQueryDto`.
   - `PaginationMeta`, `PaginatedResult<T>`.
4. API response envelope:
   - `ApiErrorPayload`, `ApiSuccessResponse<T>`, `ApiErrorResponse`, `ApiResponse<T>`.

## Нетривиальная логика

1. Контрактный слой отделен от persistence-типа (ObjectId, priceCents, Date в БД), чтобы фронтенд не зависел от backend-деталей.
2. Поле `SYSTEM_EXAMPLES_OWNER_ID` остается в контракте как часть публичной API-семантики examples.
3. `EntrySortField` использует `price` (API-термин), а не `priceCents` (внутренний DB-термин).

## Где используется

1. `contracts/collection.contracts.schema.ts` - runtime-валидация поверх этих контрактов.
2. `lib/types/collection.types.ts` - re-export контрактов плюс backend-only Document-типы.
3. `lib/services/collection.service.ts` - DTO/View/пагинация типы сервиса.
4. `lib/repositories/collection.repository.ts` - query-DTO и сортировки.
