# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Тестирует private detail-страницу коллекции: loading/error/empty/success состояния, private action-entrypoints и modal UX.
После шага `5.6.1` файл также покрывает реальный submit-flow редактирования коллекции.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `react-router-dom`
5. `./CollectionDetailPage`
6. `../../api/collections.api`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяются сценарии:
   - loading;
   - error + retry;
   - empty entries;
   - success state;
   - private modal entrypoints;
   - успешное редактирование коллекции;
   - показ submit-ошибки в edit-модалке.

## Нетривиальная логика

1. Тест мокает и detail, и list API, потому что страница загружает коллекцию и карточки независимо.
2. Проверка update-flow убеждается, что `PATCH` не просто вызван, а ещё и обновляет локально отрисованный detail-state без полного reload.
3. Error-path проверяет, что сообщение о провале submit остаётся внутри edit-модалки, а не теряется после неуспешного запроса.

## Где используется

1. Запускается в `npm.cmd run test`.
