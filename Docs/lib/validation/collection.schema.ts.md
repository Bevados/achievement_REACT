# lib/validation/collection.schema.ts

## Что делает файл

Файл хранит Zod-схемы для валидации API-контрактов домена Collection/Entry.
Сюда входят схемы для body (create/update), query (списки с пагинацией и фильтрами) и path params (ObjectId).

## Импорты и зависимости

1. zod (z) - runtime-валидация входных данных и нормализация query.
2. ../types/collection.types - enum-константы и DTO-типы, чтобы runtime-схемы совпадали с TypeScript-контрактом.

## Экспорты и контракты

1. Базовые схемы идентификаторов:
   - objectIdSchema.
   - collectionIdParamSchema.
   - collectionAndEntryIdsParamSchema.
2. Body-схемы коллекций:
   - createCollectionSchema.
   - updateCollectionSchema (запрещает пустой PATCH).
3. Body-схемы карточек:
   - createEntrySchema.
   - updateEntrySchema (запрещает пустой PATCH).
4. Query-схемы:
   - baseListQuerySchema.
   - collectionListQuerySchema.
   - entryListQuerySchema.
5. Зафиксированные инварианты:
   - private create/update коллекций не принимает `isPublic`.
   - price принимается только как number >= 0 и максимум 2 знака после точки.
   - limit по умолчанию 10, допустимый диапазон 1..100.
   - tags: максимум 10 тегов, длина каждого 1..20 символов.
   - rating: целое 1..10.
   - date: валидная ISO datetime-строка (через z.iso.datetime).
   - URL-поля валидируются через z.url() (без deprecated z.string().url()).

## Нетривиальная логика

1. В query-схемах используется z.coerce.number, чтобы корректно валидировать строковые query-параметры без ручного парсинга в контроллере.
2. Collection list query ориентирован на category/search/sort и не принимает `isPublic` от клиента в private API.
3. Для tags применяется дедупликация через Set, чтобы устранить повторяющиеся значения еще на границе API.
4. Для update-схем используется refine с проверкой на непустой объект, чтобы PATCH не принимал пустой body.
5. Для entryListQuerySchema добавлена межполевая проверка minRating <= maxRating.
6. Для URL-полей используется preprocess (trim), затем z.url().max(2048), чтобы сохранить прежнее поведение очистки строк и убрать deprecated API.

## Где используется

1. Будет импортироваться в контроллерах коллекций и карточек для проверки req.body, req.query и req.params.
2. Ошибки схем должны преобразовываться в единый ответ API с HTTP 422 для невалидных данных.
3. Схемы задают входной контракт для service/repository-слоев и уменьшают количество защитного кода ниже по стеку.
