# lib/validation/collection.schema.ts

## Что делает файл

Файл выполняет роль compatibility-layer для backend-импортов.
Реальные Zod-схемы контрактного слоя вынесены в `contracts/collection.contracts.schema.ts`, а этот файл их переэкспортирует.

## Импорты и зависимости

1. ../../contracts/collection.contracts.schema - источник фактических runtime-схем.

## Экспорты и контракты

1. Экспортирует полный набор контрактных schema-экспортов из `contracts/collection.contracts.schema.ts`.
2. Внешний контракт для backend-кода сохраняется прежним: импорты из `lib/validation/collection.schema.ts` продолжают работать.

## Нетривиальная логика

1. Основная цель файла - плавная миграция к `contracts/` без массового refactor всех backend-импортов в один шаг.
2. Контрактная логика проверки осталась прежней и поддерживается файлом-источником в `contracts/`.

## Где используется

1. Импортируется backend-кодом, где сохранены legacy-пути на время миграции.
2. Источник схем, используемых контроллерами, теперь находится в `contracts/collection.contracts.schema.ts`.
