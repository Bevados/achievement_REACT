# lib/repositories/collection.repository.ts

## Что делает файл

Файл реализует слой прямой работы с MongoDB для домена коллекций и карточек.
Repository инкапсулирует CRUD-операции, пагинацию, сортировку, фильтрацию и низкоуровневые Mongo-запросы.
Он не формирует HTTP-ответы и не хранит UI-логику.

## Импорты и зависимости

1. `mongodb` даёт `ObjectId`, `ClientSession` и типы Mongo-операций.
2. `../../api/_mongodb` (`getCollection`) используется для получения коллекций `collections` и `entries`.
3. `../types/collection.types` поставляет доменные типы документов, query DTO и `SYSTEM_EXAMPLES_OWNER_ID`.

## Экспорты и контракты

1. Экспортируются методы работы с коллекциями: `findOwnerCollections`, `findPublicCollections`, `findCollectionById`, `findCollectionByIdRaw`, `createCollection`, `updateCollectionById`, `deleteCollectionById`.
2. Экспортируются методы работы с карточками: `findCollectionEntries`, `findEntryById`, `findEntryByIdRaw`, `createEntry`, `updateEntryById`, `deleteEntryById`, `deleteEntriesByCollectionId`, `changeCollectionEntriesCount`.
3. Внутренние helper-функции `resolvePagination`, `buildCollectionSort`, `buildEntrySort`, `buildCollectionFilter`, `buildPublicCollectionFilter`, `buildEntryFilter`, `escapeRegex` формируют Mongo-фильтры и служебные параметры.
4. Инварианты слоя:
4.1. Все приватные запросы фильтруются по `ownerId`.
4.2. `collectionId` и `entryId` в Mongo-фильтрах приводятся к `ObjectId`.
4.3. Сортировка принимает только whitelisted поля из enum-маппинга.
4.4. Все mutating-методы поддерживают optional `ClientSession`.

## Нетривиальная логика

1. Для списков возвращается `meta` с `page`, `limit`, `total` и `totalPages`, чтобы клиент мог строить пагинацию без второго API-слоя.
2. Для коллекций есть два режима фильтрации:
2.1. приватный список по `ownerId`;
2.2. публичный список по `SYSTEM_EXAMPLES_OWNER_ID` и `isPublic=true`.
3. Поиск по `search` идёт через `$or` по `title` и `description` с флагом `i`.
4. Перед созданием Mongo `$regex` пользовательский ввод проходит через `escapeRegex`, чтобы спецсимволы не превращались в произвольный regex-шаблон.
5. В update-операциях из `$set` заранее исключаются критичные поля `_id`, `ownerId` и `collectionId`, чтобы их нельзя было случайно перезаписать.
6. При уменьшении `entriesCount` используется дополнительный фильтр `entriesCount > 0`, чтобы счётчик не уходил в отрицательные значения.

## Где используется

1. `lib/services/collection.service.ts` - использует repository для чтения, мутаций и access-check логики.
2. Вызовы проходят по цепочке `api/* -> controllers -> services -> repository`.
3. Repository работает через общий helper подключения к MongoDB из `api/_mongodb.ts`.
