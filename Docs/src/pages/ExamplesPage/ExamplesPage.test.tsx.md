# src/pages/ExamplesPage/ExamplesPage.test.tsx

## Что делает файл

Файл проверяет минимально обязательные UI-сценарии страницы examples.
Фокус тестов: корректный рендер состояний `loading`, `error`, `empty`, `success`.

## Импорты и зависимости

1. `vitest` используется как тестовый раннер и система моков.
2. `@testing-library/react` и `@testing-library/user-event` нужны для рендера и пользовательских действий.
3. `react-router-dom` (`MemoryRouter`) обязателен, потому что список коллекций теперь рендерит `CollectionCard` c `Link`.
4. `src/pages/ExamplesPage/ExamplesPage.tsx` - тестируемый компонент.
5. `src/hooks/useCollectionsListController.ts` мокается как источник состояния страницы.
6. `contracts/collection.contracts.ts` задает типы мок-данных (`CollectionView`, `PaginationMeta`).

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Содержит набор unit/integration тестов поведения страницы при разных состояниях контроллера.

## Нетривиальная логика

1. Вместо сетевых запросов мокается `useCollectionsListController`, чтобы детерминированно задавать состояние страницы.
2. Все рендеры проходят через локальный helper `renderPage()`, который оборачивает страницу в `MemoryRouter`.
3. Проверка `error` включает retry-клик и валидацию вызова `reloadCollections`.
4. Для `success` проверяется рендер карточки коллекции и метаданных пагинации.

## Где используется

1. Запускается Vitest-командой проекта (`npm test`).
2. Закрывает минимальное требование шага по рендеру `loading/empty/error/success` для examples.
