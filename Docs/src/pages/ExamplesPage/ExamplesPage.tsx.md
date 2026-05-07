# src/pages/ExamplesPage/ExamplesPage.tsx

## Что делает файл

Страница показывает публичный список example-коллекций.

## Импорты и зависимости

1. `src/api/collections.api.ts` — `getPublicCollections`.
2. `CollectionsGrid`, `CollectionsFilters`, `CollectionsPagination` — общий list UI.
3. `useCollectionsListController` — общий контроллер состояний списка.

## Экспорты и контракты

1. Экспортируется `ExamplesPage`.
2. Страница рендерит состояния `loading`, `error`, `empty`, `success`.
3. Карточки examples теперь ведут на `/examples/:collectionId`.

## Нетривиальная логика

1. Страница использует тот же list-controller, что и private collections page.
2. Отличие от private-страницы теперь сведено к источнику данных и public route для карточек.

## Где используется

1. `src/App.tsx` — guest route `/examples`.
