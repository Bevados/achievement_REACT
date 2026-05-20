# lib/types/collection.types.ts

## Что делает файл

Собирает серверные document-типы и re-export shared контрактов для коллекций и карточек.

## Импорты и зависимости

1. `mongodb` — `ObjectId`.
2. `../../contracts/collection.contracts.js` — shared frontend/backend типы и enum-значения.

## Экспорты и контракты

1. Re-export всех shared collection/entry contracts.
2. `CollectionDocument` и `EntryDocument` для MongoDB.
3. Вспомогательные типы query/result для repository и service layer.
4. `SYSTEM_EXAMPLES_OWNER_ID` как маркер публичного системного owner.

## Нетривиальная логика

1. Файл разделяет transport contracts и серверные document-модели с `ObjectId`.
2. Shared contracts импортируются и переэкспортируются через явное `.js`, потому что этот типовой модуль участвует в backend ESM build на Vercel.

## Где используется

1. `lib/repositories/collection.repository.ts`.
2. `lib/services/collection.service.ts`.
3. Backend tests, работающие с server-side моделями.
