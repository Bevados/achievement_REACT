# lib/validation/collection.schema.test.ts

## Что делает файл

Тестирует runtime-валидацию контрактов коллекций и карточек через Zod-схемы.

## Импорты и зависимости

1. `vitest` — тестовый раннер.
2. `contracts/collection.contracts.schema.ts` — схемы коллекций и карточек.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - `isPublic` нельзя передать в create/update коллекции
   - completed-entry требует `rating` и `dateStart`
   - `dateEnd` не может быть раньше `dateStart`
   - `customCategory` валиден для `category='other'`

## Нетривиальная логика

1. Тест на `customCategory` фиксирует новый контракт “своя категория через other + customCategory”.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `contracts/collection.contracts.schema.ts`.
