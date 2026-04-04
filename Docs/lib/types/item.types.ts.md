# lib/types/item.types.ts

## Что делает файл

Файл описывает TypeScript-контракты сущности `Item` и DTO для операций create/update.
Это центральный источник типов для item-цепочки на backend.

## Импорты и зависимости

1. `mongodb` (`ObjectId`) - тип `_id` для документов, хранящихся в MongoDB.

## Экспорты и контракты

1. `Item` - полный тип документа в БД:
2. `_id?: ObjectId`, `name`, `description?`, `owner`, `completed`, `createdAt`, `updatedAt`.
3. `CreateItemDto` - контракт входа для создания item через API:
4. `name` обязательный, `description` и `completed` опциональны.
5. `UpdateItemDto` - контракт частичного обновления (PATCH):
6. Все поля опциональны.
7. Инварианты:
8. Поля `owner`, `createdAt`, `updatedAt` не должны приходить с клиента в create DTO.
9. `UpdateItemDto` не содержит `_id` и `owner`, чтобы клиент не менял идентичность документа.

## Нетривиальная логика

1. Разделение на `Item` и DTO устраняет риск «переотправки» внутренних полей БД с клиента.
2. Тип `Item` использует `ObjectId`, но наружу API обычно возвращает сериализованные данные; это важно учитывать при дальнейшем рефакторинге контрактов.
3. DTO используются вместе с Zod-схемами в `lib/validation/item.schema.ts`, что связывает compile-time и runtime валидацию.

## Где используется

1. `lib/validation/item.schema.ts` - привязка Zod-схем к `CreateItemDto` и `UpdateItemDto`.
2. `lib/services/item.service.ts` - построение доменной сущности `Item` и прием DTO.
3. `lib/repositories/item.repository.ts` - типизация операций с MongoDB коллекцией `items`.
