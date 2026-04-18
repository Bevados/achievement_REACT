# lib/services/collection.service.ts

## Что делает файл

Файл реализует бизнес-логику домена Collection/Entry между контроллерами и repository.
Он проверяет доступ к ресурсам, конвертирует поля между API и БД, поддерживает инварианты счетчиков и возвращает View-модели.

## Импорты и зависимости

1. mongodb (ObjectId) - формирование ObjectId для связки Entry -> Collection на записи.
2. ../repositories/collection.repository - операции чтения/записи в MongoDB.
3. ../types/collection.types - DTO, Document и View-контракты домена.

## Экспорты и контракты

1. Error-модель сервиса:
   - ForbiddenError.
   - NotFoundError.
   - TransactionError.
2. Операции коллекций:
   - getOwnerCollections(ownerId, query).
   - getPublicCollections(query).
   - getCollectionById(ownerId, collectionId).
   - createCollection(ownerId, data).
   - updateCollection(ownerId, collectionId, data).
   - deleteCollection(ownerId, collectionId).
3. Операции карточек:
   - getCollectionEntries(ownerId, collectionId, query).
   - getEntryById(ownerId, collectionId, entryId).
   - createEntry(ownerId, collectionId, data).
   - updateEntry(ownerId, collectionId, entryId, data).
   - deleteEntry(ownerId, collectionId, entryId).
4. Зафиксированные инварианты:
   - 403 для чужих данных и 404 для отсутствующих.
   - private create/update коллекций не принимает `isPublic`; в write-модели всегда `isPublic=false`.
   - price хранится в БД как cents, наружу отдается в dollars.
   - date в БД хранится как Date (UTC), наружу отдается как ISO string.
   - createEntry/deleteEntry поддерживают entriesCount через repository helper.
   - createEntry/deleteEntry/deleteCollection выполняются в Mongo-транзакции с rollback при ошибке.

## Нетривиальная логика

1. Access-check реализован двухэтапно: owner lookup + raw lookup, чтобы корректно различать Forbidden и NotFound.
2. Маппинг Document -> View централизован (`toCollectionView`, `toEntryView`), что исключает утечки ObjectId/Date в API-слой.
3. Нормализация тегов (`trim + lowercase + dedupe`) выполняется в service при записи, а не в repository.
4. Транзакционная обертка `runInTransaction` централизует `startTransaction/commit/abort/endSession` и гарантирует откат при падении шага внутри мутации.
5. Каскадное удаление коллекции оркестрируется в строгом порядке: access-check -> delete entries -> delete collection (в одной транзакции).
6. Конверсия цены выполняется с округлением до cents (`Math.round`) для защиты от float-ошибок.

## Где используется

1. Следующий подшаг 2.2.5: контроллеры коллекций/карточек будут вызывать этот сервис.
2. Сервис использует repository-слой как единственную точку доступа к MongoDB.
3. Unit-тесты сервиса находятся в `lib/services/collection.service.test.ts`.
