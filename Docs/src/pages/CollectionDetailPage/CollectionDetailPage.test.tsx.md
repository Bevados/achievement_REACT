# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Тестирует private detail-страницу коллекции: loading/error/empty/success состояния, private action-entrypoints и modal UX.
После шага `5.6.2` файл покрывает реальные submit-flow для create/update и коллекции, и карточек.

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
   - показ submit-ошибки коллекции;
   - успешное создание карточки;
   - успешное редактирование карточки;
   - показ submit-ошибки карточки.

## Нетривиальная логика

1. Тест мокает и detail, и list API, потому что страница загружает коллекцию и карточки независимо.
2. Проверка create-entry flow убеждается, что после `POST` detail-страница и перезагружает список карточек, и локально обновляет `entriesCount`.
3. Проверка update-entry flow убеждается, что `PATCH` уходит с правильным `entryId`, а затем вызывается `reloadEntries`.
4. Error-path для карточки проверяет, что сообщение о провале submit остаётся внутри entry-модалки.

## Где используется

1. Запускается в `npm.cmd run test`.
