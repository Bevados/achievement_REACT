# lib/repositories/collection.repository.ts

## Что делает файл

Файл реализует слой прямой работы с MongoDB для домена Collection/Entry.
Он инкапсулирует CRUD-операции, серверную пагинацию, сортировку и фильтрацию.
Repository не формирует HTTP-ответы и не содержит бизнес-правил UI/контроллера.

## Импорты и зависимости

1. mongodb: ObjectId и типы результатов Mongo-операций (InsertOneResult, UpdateResult, DeleteResult), а также типы Filter/SortDirection.
2. ../../api/\_mongodb: getCollection для получения Mongo-коллекций collections и entries.
3. ../types/collection.types: доменные документы и DTO query-параметров для типобезопасной сборки фильтров и сортировки.

## Экспорты и контракты

1. Операции коллекций:
   - findOwnerCollections(ownerId, query): список коллекций владельца с фильтрами, сортировкой и пагинацией + meta.total.
   - findPublicCollections(query): список публичных examples с системным ownerId `system_examples`.
   - findCollectionById(ownerId, collectionId): получить одну коллекцию владельца по id.
   - findCollectionByIdRaw(collectionId): получить коллекцию по id без owner-фильтра (для 403/404 диагностики в service).
   - createCollection(data): создать коллекцию.
   - updateCollectionById(ownerId, collectionId, updateData): обновить коллекцию владельца.
   - deleteCollectionById(ownerId, collectionId): удалить коллекцию владельца.
2. Операции карточек entries:
   - findCollectionEntries(ownerId, collectionId, query): список карточек конкретной коллекции владельца с фильтрами/пагинацией.
   - findEntryById(ownerId, collectionId, entryId): получить карточку владельца по id.
   - findEntryByIdRaw(entryId): получить карточку по id без owner-фильтра.
   - createEntry(data): создать карточку.
   - updateEntryById(ownerId, collectionId, entryId, updateData): обновить карточку владельца.
   - deleteEntryById(ownerId, collectionId, entryId): удалить карточку владельца.
   - deleteEntriesByCollectionId(ownerId, collectionId): удалить все карточки коллекции (под каскадное удаление).
   - changeCollectionEntriesCount(ownerId, collectionId, delta): атомарно изменить счетчик entriesCount на коллекции.
3. Инварианты слоя:
   - Все private-запросы фильтруются по ownerId.
   - collectionId и entryId в Mongo-фильтрах приводятся к ObjectId.
   - Сортировка принимает только whitelisted поля из enum-маппинга.
   - Поле sortBy=price для entries маппится в Mongo-поле priceCents.
   - Публичный поток примеров изолирован через SYSTEM_EXAMPLES_OWNER_ID.
   - Все mutating методы поддерживают optional ClientSession для сервисных транзакций.

## Нетривиальная логика

1. Для пагинации возвращается объект meta с total и totalPages, чтобы клиент мог строить навигацию страниц без дополнительных запросов.
2. Для списка коллекций реализованы два режима фильтра:
   - private: ownerId + optional category/search.
   - public: ownerId=system_examples + isPublic=true + optional category/search.
3. Для entries поддержаны фильтры status/tag и межполевая фильтрация рейтинга через диапазон minRating..maxRating.
4. Для update-операций перед записью в Mongo удаляются критичные поля (\_id, ownerId, collectionId), чтобы исключить их случайную перезапись через $set.
5. Поиск по search реализован через case-insensitive regex по `title` и `description` (через `$or`) для более полного MVP-результата.
6. Для decrement счетчика entriesCount используется условие `entriesCount > 0`, чтобы исключить уход счетчика в отрицательные значения.
7. Методы create/update/delete и счетчик принимают optional `session`, что позволяет сервису объединять multi-document операции в одну транзакцию.

## Где используется

1. Используется сервисами `collection.service.ts` для чтения/мутаций и access-check семантики.
2. Косвенная цепочка вызова после подключения: api/\* -> controllers -> services -> this repository.
3. Использует единый helper подключения MongoDB из api/\_mongodb.ts.
