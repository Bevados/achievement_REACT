# src/pages/CollectionsPage/CollectionsPage.test.tsx

## Что делает файл

Тестирует private entrypoint модалки создания коллекции на странице списка коллекций.
После шага `5.5` тест также фиксирует, что форма открывается уже с активной submit-кнопкой, а не в permanently-disabled состоянии.

## Импорты и зависимости

1. `vitest` — раннер и мок общего list-controller hook.
2. `@testing-library/react` — рендер страницы.
3. `@testing-library/user-event` — клик по CTA.
4. `./CollectionsPage`
5. `../../hooks/useCollectionsListController` — замокан, чтобы тест был сосредоточен на modal UX.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - CTA `Создать коллекцию` открывает modal;
   - внутри modal есть `CollectionForm`;
   - submit-кнопка доступна для RHF/Zod-сценария следующего шага.

## Нетривиальная логика

1. Хук списка мокается полностью, потому что задача теста — не server-driven list, а факт, что private page корректно поднимает create-modal.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/pages/CollectionsPage/CollectionsPage.tsx`.
