# lib/validation/collection.schema.test.ts

## Что делает файл

Файл проверяет контрактные правила private API для коллекций и entries.
Он фиксирует запрет `isPublic` в private collection payload и entry-правила для `completed` и диапазона дат.

## Импорты и зависимости

1. vitest (`describe`, `it`, `expect`) - тестовый раннер и assertions.
2. ../../contracts/collection.contracts.schema - collection и entry runtime-схемы.

## Экспорты и контракты

1. Файл не экспортирует runtime API.
2. Контракты, которые проверяются:
   - createCollectionSchema отвергает `isPublic`.
   - updateCollectionSchema отвергает `isPublic`.
   - createEntrySchema требует `rating` и `dateStart` для `completed`.
   - updateEntrySchema не принимает перевод в `completed` без обязательных полей.
   - `dateEnd` не может быть раньше `dateStart`.

## Нетривиальная логика

1. Проверки построены как negative tests (`toThrow`), потому что целевое поведение - запрет лишнего ключа в strict-схемах.
2. Тесты защищают от будущей регрессии, когда `isPublic` может случайно вернуться в private schema.

## Где используется

1. Запускается Vitest вместе с backend unit-тестами.
2. Поддерживает шаг 2.2.4 как часть tests-first по контрактам API.
3. Является связующим тестом между общими контрактами (`contracts/collection.contracts.ts`) и runtime-валидацией (`contracts/collection.contracts.schema.ts`).
