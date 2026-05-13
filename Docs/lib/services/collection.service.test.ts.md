# lib/services/collection.service.test.ts

## Что делает файл

Файл тестирует бизнес-логику `collection.service`.
Покрывает доступ, create/update/delete сценарии, транзакции и доменные инварианты коллекций и карточек.

## Импорты и зависимости

1. `vitest` — тестовый раннер и моки.
2. `mongodb` (`ObjectId`) — тестовые идентификаторы.
3. `../../api/_mongodb` — замокан для транзакций.
4. `../repositories/collection.repository` — замокан как источник данных.
5. `./collection.service` — тестируемый сервис.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые сценарии:
   - mapping owner/public views
   - create/update/delete коллекций и карточек
   - completed-entry business rules
   - transaction behavior
   - custom category mapping and cleanup

## Нетривиальная логика

1. Отдельный тест проверяет, что `customCategory` доходит до `CollectionView`.
2. Отдельный тест защищает от регрессии, где после смены категории с `other` на preset в документе могла остаться старая пользовательская категория.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `lib/services/collection.service.ts`.
