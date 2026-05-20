# lib/services/collection.service.ts

## Что делает файл

Хранит бизнес-логику коллекций и карточек: access control, доменные инварианты, преобразование DTO в документы и сборку API view-моделей.

## Импорты и зависимости

1. `mongodb` — `ObjectId` и `ClientSession`.
2. `../../api/_mongodb.js` — подключение к БД и транзакционный контекст.
3. `../repositories/collection.repository.js` — MongoDB-операции.
4. `../types/collection.types.js` — типы документов, DTO и view-моделей.

## Экспорты и контракты

1. Экспортирует доменные ошибки `ForbiddenError`, `NotFoundError`, `TransactionError`, `ValidationError`.
2. Экспортирует CRUD-методы для private flow и read-only методы для public examples.
3. Возвращает уже нормализованные `CollectionView` и `EntryView` для controller-слоя.

## Нетривиальная логика

1. Сервис поддерживает инвариант `category='other' -> customCategory required` и очищает `customCategory`, если итоговая категория уже не `other`.
2. Для карточек соблюдаются правила `completed`-статуса и модели `dateStart/dateEnd`.
3. User-facing ошибки возвращаются на русском, а относительные imports используют `.js`, чтобы Vercel ESM build не падал на server code.

## Где используется

1. `lib/controllers/collection.controller.ts`.
2. Все `api/collections/*` и `api/examples/collections/*`.
3. Тесты service layer.
