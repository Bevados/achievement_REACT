# lib/repositories/collection.repository.ts

## Что делает файл

Repository инкапсулирует MongoDB-запросы для коллекций и карточек.

## Импорты и зависимости

1. `mongodb` — ObjectId, filters, sort и CRUD-результаты.
2. `api/_mongodb.ts` — доступ к Mongo collections.
3. `lib/types/collection.types.ts` — backend document-типы и `SYSTEM_EXAMPLES_OWNER_ID`.

## Экспорты и контракты

1. Private queries:
   - owner collections
   - collection by id
   - collection entries
   - CRUD коллекций и entries
2. Public queries:
   - `findPublicCollections`
   - `findPublicCollectionById`
   - `findPublicCollectionEntries`

## Нетривиальная логика

1. Public queries жестко фильтруют `ownerId=system_examples` и `isPublic=true`.
2. Search-строка экранируется перед Mongo `$regex`.
3. Для public entries используется тот же entry-filter и sort helper, что и в private list.

## Где используется

1. `lib/services/collection.service.ts`
