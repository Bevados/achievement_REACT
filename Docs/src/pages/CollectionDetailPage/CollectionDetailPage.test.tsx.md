# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Тестирует private detail-страницу коллекции.

## Импорты и зависимости

1. `vitest` — тестовые сценарии, моки API и `window.confirm`.
2. `@testing-library/react` — рендер страницы и проверки DOM.
3. `@testing-library/user-event` — сценарии private CRUD и filter UX.
4. `react-router-dom` (`MemoryRouter`, `Routes`, `Route`) — тестовый роутинг detail-страницы.
5. `../../api/collections.api` — mocked client API для загрузки и CRUD-операций.
6. `../../../contracts/collection.contracts` — тип `EntryView`.
7. `./CollectionDetailPage` — тестируемая страница.

## Экспорты и контракты

1. Файл ничего не экспортирует.
2. Покрывает page-level контракт private detail flow:
   - загрузка коллекции и списка карточек;
   - modal CRUD для collection и entry;
   - delete-flow с подтверждением;
   - возврат к списку коллекций;
   - работа фильтров и повторной загрузки.

## Что проверяется

1. Loading / error / empty / success состояния.
2. Открытие modal-форм коллекции и карточки.
3. Submit create/update/delete flow для private CRUD.
4. Корректная работа scoped-query внутри modal-форм, когда на странице есть одноимённые поля фильтров.
5. Возврат на список коллекций после удаления.
6. Различие между пустой private-коллекцией без фильтров и пустым результатом после активного фильтра.

## Нетривиальная логика

1. Страница одновременно содержит форму фильтров и modal-формы CRUD, поэтому для полей с одинаковыми label используются `within(...)` и scoped-queries по диалогу.
2. Delete-сценарии проверяют не только вызов API, но и side effects: навигацию после удаления коллекции и пересчёт списка/счётчика после удаления карточки.
3. Маршрут detail-страницы тестируется через `MemoryRouter`, чтобы page-flow максимально повторял реальное поведение приложения.

## Где используется

1. Запускается через `npm.cmd run test`.
