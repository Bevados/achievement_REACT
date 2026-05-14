# src/pages/CollectionsPage/CollectionsPage.tsx

## Что делает файл

Рендерит private-страницу списка коллекций пользователя.

## Импорты и зависимости

1. `react`
2. `src/api/collections.api.ts`
3. `CollectionForm`
4. `CollectionsFilters`, `CollectionsGrid`, `CollectionsPagination`
5. `BaseModal`
6. `useCollectionsListController`
7. `src/utils/routing.utils.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionsPage`.

## Нетривиальная логика

1. Detail href строятся через `getPrivateCollectionHref`, поэтому адреса читаемые и содержат `id + slug`.
2. Create/edit/delete коллекции доступны прямо со страницы списка.
3. Inline-кнопки на карточке позволяют редактировать и удалять коллекцию без перехода в detail.

## Где используется

1. `src/App.tsx`
