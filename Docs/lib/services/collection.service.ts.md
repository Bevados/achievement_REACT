# lib/services/collection.service.ts

## Что делает файл

Service слой содержит бизнес-логику коллекций и карточек между controller и repository.

## Импорты и зависимости

1. `mongodb` (`ObjectId`) — связь с entry documents.
2. `api/_mongodb.ts` — транзакции.
3. `lib/repositories/collection.repository.ts` — чтение и мутации Mongo.

## Экспорты и контракты

1. Public API:
   - `getPublicCollections`
   - `getPublicCollectionById`
   - `getPublicCollectionEntries`
2. Private API:
   - `getOwnerCollections`
   - `getCollectionById`
   - `getCollectionEntries`
   - CRUD коллекций и entries

## Нетривиальная логика

1. Public detail читает только коллекции из `system_examples` и бросает `NotFoundError`, если example недоступен.
2. Private access по-прежнему проходит через access-check и `ForbiddenError`.
3. Для entry действует service-level бизнес-валидация: completed-entry обязан иметь `rating` и `dateStart`, а `dateEnd` не может быть раньше `dateStart`.
4. Мутации entries и collection delete сохраняют транзакционный сценарий.

## Где используется

1. `lib/controllers/collection.controller.ts`
