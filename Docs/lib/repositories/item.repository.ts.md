# lib/repositories/item.repository.ts

## Что делает файл

Это слой прямой работы с MongoDB для коллекции `items`.
Файл выполняет низкоуровневые CRUD-операции и не содержит UI/HTTP-логики.
Его зона ответственности: сформировать корректный Mongo-запрос и вернуть результат операции.

## Импорты и зависимости

1. `mongodb` (`ObjectId`) - преобразование строкового id в MongoDB ObjectId для update/delete фильтров.
2. `../../api/_mongodb` (`getCollection`) - получение подключения к нужной коллекции MongoDB.
3. `../types/item.types` (`Item`) - типизация сущности item.

## Экспорты и контракты

1. `findUserItems(userId: string)` - возвращает массив item пользователя, отсортированный по `createdAt` по убыванию.
2. `createItem(data: Item)` - вставляет новый item в коллекцию.
3. `updateItem(id: string, userId: string, updateData: Partial<Item>)` - обновляет item по `_id` и `owner`.
4. `deleteItem(id: string, userId: string)` - удаляет item по `_id` и `owner`.
5. Инварианты:
 Для update/delete всегда применяется фильтр по владельцу (`owner: userId`).
 id для update/delete должен быть валидным ObjectId, иначе операция завершится ошибкой выше по стеку.

## Нетривиальная логика

1. Безопасность данных реализована на уровне фильтра в запросах (`_id + owner`), чтобы пользователь не мог изменить чужой документ.
2. `findUserItems` возвращает данные в порядке последних созданных, что напрямую влияет на UX списка.
3. Репозиторий возвращает сырые результаты MongoDB (insertOne/updateOne/deleteOne), а интерпретация результата остается в сервисе/контроллере.

## Где используется

1. Прямое использование в `lib/services/item.service.ts`.
2. Косвенная цепочка вызова: `api/items/index.ts -> lib/controllers/item.controller.ts -> lib/services/item.service.ts -> lib/repositories/item.repository.ts`.
3. Использует подключение из `api/_mongodb.ts`.
