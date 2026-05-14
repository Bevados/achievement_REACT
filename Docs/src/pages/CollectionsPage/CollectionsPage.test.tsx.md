# src/pages/CollectionsPage/CollectionsPage.test.tsx

## Что делает файл

Тестирует private CRUD entrypoint страницы списка коллекций.
После подключения inline-действий на карточке тесты покрывают не только создание, но и редактирование/удаление коллекции прямо из списка.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./CollectionsPage`
5. `../../api/collections.api` — мокает `createCollection`, `updateCollection`, `deleteCollection` и `getOwnerCollections`.
6. `../../hooks/useCollectionsListController` — мокается, чтобы тест был сосредоточен на modal UX и submit-flow.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяются сценарии:
   - CTA `Создать коллекцию` открывает modal;
   - валидный submit вызывает `createCollection`;
   - маленькая кнопка на карточке открывает edit-modal и submit вызывает `updateCollection`;
   - маленькая кнопка удаления вызывает `deleteCollection`;
   - после успеха вызывается `reloadCollections`;
   - при ошибке текст ошибки показывается внутри формы.

## Нетривиальная логика

1. Хук списка мокается полностью, потому что задача теста — не server-driven list, а факт, что private page корректно поднимает create/edit/delete flow коллекции.
2. Рендер страницы оборачивается в `MemoryRouter`, потому что карточки коллекций внутри списка используют `Link`.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/pages/CollectionsPage/CollectionsPage.tsx`.
