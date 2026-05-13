# src/pages/CollectionsPage/CollectionsPage.test.tsx

## Что делает файл

Тестирует private CRUD entrypoint модалки создания коллекции на странице списка коллекций.
После шага `5.6.1` тесты покрывают не только открытие модалки, но и success/error submit-flow.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./CollectionsPage`
5. `../../api/collections.api` — мокает `createCollection` и `getOwnerCollections`.
6. `../../hooks/useCollectionsListController` — мокается, чтобы тест был сосредоточен на modal UX и submit-flow.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяются сценарии:
   - CTA `Создать коллекцию` открывает modal;
   - валидный submit вызывает `createCollection`;
   - после успеха вызывается `reloadCollections`;
   - при ошибке текст ошибки показывается внутри формы.

## Нетривиальная логика

1. Хук списка мокается полностью, потому что задача теста — не server-driven list, а факт, что private page корректно поднимает create-modal и обрабатывает submit-flow коллекции.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/pages/CollectionsPage/CollectionsPage.tsx`.
