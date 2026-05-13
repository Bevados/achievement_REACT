# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Тестирует private detail-страницу коллекции.
Покрывает loading/error/empty/success состояния, modal UX, реальные create/update submit-flow и delete flow для коллекции и карточек.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `react-router-dom`
5. `./CollectionDetailPage`
6. `../../api/collections.api`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяется private detail-экран коллекции с CRUD-flow карточек и самой коллекции.

## Нетривиальная логика

1. Loading и error + retry.
2. Empty-state и success-state списка карточек.
3. Открытие private modal-form для коллекции и карточки.
4. Успешное редактирование коллекции и показ submit-ошибки коллекции.
5. Успешное создание и редактирование карточки и показ submit-ошибки карточки.
6. Успешное удаление коллекции с навигацией обратно на `/collections`.
7. Ошибка удаления коллекции.
8. Успешное удаление карточки с reload списка и обновлением `entriesCount`.
9. Ошибка удаления карточки.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Защищает `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` от регрессий CRUD-flow.
