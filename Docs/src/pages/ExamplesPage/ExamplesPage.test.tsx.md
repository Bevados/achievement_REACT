# src/pages/ExamplesPage/ExamplesPage.test.tsx

## Что делает файл

Файл проверяет минимально обязательные UI-сценарии страницы examples.
Фокус тестов: корректный рендер состояний `loading`, `error`, `empty`, `success`.

## Импорты и зависимости

1. `vitest` - тестовый раннер и моки.
2. `@testing-library/react` и `@testing-library/user-event` - рендер и пользовательские действия.
3. `src/pages/ExamplesPage/ExamplesPage.tsx` - тестируемый компонент.
4. `src/hooks/useCollectionsListController.ts` - замокан как источник состояния страницы.
5. `contracts/collection.contracts.ts` - типизация мок-данных (`CollectionView`, `PaginationMeta`).

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Содержит набор unit/integration тестов поведения страницы при разных состояниях контроллера.

## Нетривиальная логика

1. Вместо сетевых запросов мокается `useCollectionsListController`, чтобы детерминированно задавать состояние.
2. Проверка `error` включает клик по кнопке retry и валидацию вызова `reloadCollections`.
3. Для `success` проверяется рендер карточки и метаданных пагинации.

## Где используется

1. Запускается Vitest-командой проекта (`npm test`).
2. Закрывает минимальное требование шага по рендеру `loading/empty/error/success` для examples.
