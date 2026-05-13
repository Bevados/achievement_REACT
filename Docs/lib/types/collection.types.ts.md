# lib/types/collection.types.ts

## Что делает файл

Файл соединяет общий контрактный слой с backend-only document-моделью MongoDB.
Он переэкспортирует общие типы из `contracts/` и добавляет `CollectionDocument`/`EntryDocument`.

## Импорты и зависимости

1. `mongodb` (`ObjectId`) — backend-only тип идентификаторов.
2. `contracts/collection.contracts.ts` — общие контрактные типы.

## Экспорты и контракты

1. Реэкспортирует всё из `contracts/collection.contracts.ts`.
2. Добавляет `CollectionDocument`:
   - Mongo `_id?: ObjectId`
   - enum `category`
   - optional `customCategory`
   - server timestamps
3. Добавляет `EntryDocument`:
   - Mongo `_id?: ObjectId`
   - `collectionId: ObjectId`
   - `priceCents?: number`
   - `dateStart/dateEnd?: Date`

## Нетривиальная логика

1. `CollectionDocument` хранит `customCategory` отдельно от enum `category`, чтобы пользовательская категория не разрушала текущую типизацию и индексы.
2. Frontend по-прежнему не знает о Mongo-specific деталях вроде `ObjectId` и `priceCents`.

## Где используется

1. `lib/services/collection.service.ts`
2. `lib/repositories/collection.repository.ts`
