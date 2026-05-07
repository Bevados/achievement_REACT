# src/pages/CollectionsPage/CollectionsPage.tsx

## Что делает файл

Страница показывает приватный список коллекций текущего пользователя.

## Импорты и зависимости

1. `src/api/collections.api.ts` — `getOwnerCollections`.
2. `CollectionsGrid`, `CollectionsFilters`, `CollectionsPagination` — общий list UI.
3. `useCollectionsListController` — контроллер списка.

## Экспорты и контракты

1. Экспортируется `CollectionsPage`.
2. Карточки private-коллекций ведут на `/collections/:collectionId`.

## Нетривиальная логика

1. Страница использует те же list-компоненты, что и public examples page, но дает другой `getCollectionHref`.

## Где используется

1. `src/App.tsx` — private route `/collections`.
