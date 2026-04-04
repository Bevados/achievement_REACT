# lib/services/item.service.ts

## Что делает файл

Это сервисный слой для `items` между контроллером и репозиторием.
Файл отвечает за подготовку данных к сохранению и за применение бизнес-правил перед доступом к базе.

## Импорты и зависимости

1. `../repositories/item.repository` - низкоуровневые операции с MongoDB.
2. `../types/item.types` - типы `Item`, `CreateItemDto`, `UpdateItemDto` для строгой типизации входа/выхода.

## Экспорты и контракты

1. `getItems(userId: string)` - возвращает item пользователя.
2. `createNewItem(userId: string, data: CreateItemDto)` - создает объект `Item`, добавляя системные поля.
3. `updateExistingItem(id: string, userId: string, data: UpdateItemDto)` - обновляет item и проставляет `updatedAt`.
4. `removeItem(id: string, userId: string)` - удаляет item пользователя.
5. Инварианты:
6. `owner` всегда формируется на сервере из `userId`, а не доверяется клиенту.
7. `createdAt/updatedAt` формируются на сервере для консистентности времени и аудита.

## Нетривиальная логика

1. В `createNewItem` поле `completed` нормализуется через `data.completed ?? false`, чтобы в БД не было неопределенного состояния.
2. На update `updatedAt` всегда перезаписывается, даже если пользователь меняет только одно поле.
3. Слой пока легкий, но именно сюда логично переносить будущие правила (например, лимиты, аудит, каскадные действия).

## Где используется

1. Используется в `lib/controllers/item.controller.ts`.
2. Вызывает `lib/repositories/item.repository.ts` для реального CRUD в MongoDB.
3. Является промежуточным звеном serverless endpoint `api/items/index.ts`.
