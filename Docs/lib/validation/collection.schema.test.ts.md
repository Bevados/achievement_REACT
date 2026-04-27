# lib/validation/collection.schema.test.ts

## Что делает файл

Файл проверяет контракт private API для коллекций: поле `isPublic` не должно приниматься в пользовательских create/update payload.
Это тест на зафиксированное бизнес-решение о разделении пользовательских данных и системных examples.

## Импорты и зависимости

1. vitest (`describe`, `it`, `expect`) - тестовый раннер и assertions.
2. ../../contracts/collection.contracts.schema - createCollectionSchema и updateCollectionSchema.

## Экспорты и контракты

1. Файл не экспортирует runtime API.
2. Контракты, которые проверяются:
   - createCollectionSchema отвергает `isPublic`.
   - updateCollectionSchema отвергает `isPublic`.

## Нетривиальная логика

1. Проверки построены как negative tests (`toThrow`), потому что целевое поведение - запрет лишнего ключа в strict-схемах.
2. Тесты защищают от будущей регрессии, когда `isPublic` может случайно вернуться в private schema.

## Где используется

1. Запускается Vitest вместе с backend unit-тестами.
2. Поддерживает шаг 2.2.4 как часть tests-first по контрактам API.
3. Является связующим тестом между общими контрактами (`contracts/collection.contracts.ts`) и runtime-валидацией (`contracts/collection.contracts.schema.ts`).
