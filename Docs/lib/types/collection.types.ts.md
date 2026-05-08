# lib/types/collection.types.ts

## Что делает файл

Файл теперь выступает backend-oriented адаптером для типов домена Collection/Entry.
Он re-export'ит общий контракт из `contracts/collection.contracts.ts` и хранит только backend-only Document-типизацию для MongoDB.

## Импорты и зависимости

1. mongodb (ObjectId) - типы `_id` и `collectionId` для MongoDB-документов.
2. ../../contracts/collection.contracts - общий контрактный слой (DTO/View/query/response), который re-export'ится из этого файла.

## Экспорты и контракты

1. Re-export общего контрактного слоя:
   - enum-like константы, DTO, view-типы, query-параметры, pagination и API response envelope.
2. Доменные backend-only типы хранения:
   - CollectionDocument.
   - EntryDocument (collectionId хранится как ObjectId-ссылка, цена в БД хранится как integer cents).

## Нетривиальная логика

1. Контрактный слой вынесен отдельно в `contracts/`, чтобы frontend и backend использовали одинаковые API-типы без Mongo-зависимостей.
2. В этом файле остаются только persistence-типы (`CollectionDocument`, `EntryDocument`) для DB-слоя.
3. В EntryDocument поле collectionId хранится как ObjectId, чтобы связь Entry -> Collection была нативной для MongoDB.
4. Для дат entry backend хранит `dateStart` и `dateEnd`, что позволяет различать одну дату и период без двусмысленности.

## Где используется

1. `lib/repositories/collection.repository.ts` - использует `CollectionDocument`/`EntryDocument` и контрактные query-типы.
2. `lib/services/collection.service.ts` - использует Document-типы и re-export'нутые DTO/View типы.
3. `contracts/collection.contracts.ts` - реальный источник общего контрактного слоя, который этот файл переэкспортирует для совместимости.
