# lib/services/collection.service.ts

## Что делает файл

Файл хранит бизнес-логику коллекций и карточек.
Сервис проверяет доступ, преобразует DTO в document-модель, валидирует доменные правила и возвращает `View`-модели для API.

## Импорты и зависимости

1. `mongodb` — транзакции и `ObjectId`.
2. `api/_mongodb` — подключение к базе.
3. `../repositories/collection.repository` — низкоуровневые операции с MongoDB.
4. `../types/collection.types` — document- и contract-типы.

## Экспорты и контракты

1. Ошибки доменного слоя:
   - `ForbiddenError`
   - `NotFoundError`
   - `TransactionError`
   - `ValidationError`
2. CRUD-методы для коллекций и карточек.
3. Методы публичных и приватных read-only выборок.

## Нетривиальная логика

1. `toCollectionView` теперь пробрасывает `customCategory` в `CollectionView`.
2. При создании коллекции “своя категория” сохраняется как:
   - `category: 'other'`
   - `customCategory: normalized string | undefined`
3. `updateCollection` вычисляет итоговую категорию после merge с текущим состоянием коллекции.
4. Если итоговая категория не `other`, сервис принудительно очищает `customCategory`, чтобы не хранить противоречивые данные.
5. Для карточек сохраняются уже введённые инварианты completed-status и `dateStart/dateEnd`.

## Где используется

1. `api/collections/*`
2. `api/examples/collections/*`
3. Тесты `lib/services/collection.service.test.ts`
