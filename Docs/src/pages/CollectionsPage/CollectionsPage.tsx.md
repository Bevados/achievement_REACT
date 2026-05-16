# src/pages/CollectionsPage/CollectionsPage.tsx

## Что делает файл

Рендерит private-страницу списка коллекций пользователя.

## Импорты и зависимости

1. `src/hooks/useCollectionsListController.ts` — URL-state списка.
2. `src/hooks/usePrivateCollectionsQueries.ts` — TanStack Query для списка и collection CRUD.
3. `CollectionForm`, `CollectionsFilters`, `CollectionsGrid`, `CollectionsPagination`, `BaseModal` — UI-слой.
4. `src/utils/routing.utils.ts` — readable href с `id + slug`.

## Экспорты и контракты

1. Default export `CollectionsPage`.
2. Страница показывает только private-список коллекций владельца.
3. URL-state списка берётся из controller-hook, а server-state — из TanStack Query hooks.

## Нетривиальная логика

1. URL-state списка и server-state намеренно разделены: фильтры живут в controller-hook, а загрузка и CRUD — в Query hooks.
2. Create/edit/delete коллекции больше не делают ручной reload, а полагаются на invalidate query keys.
3. Inline-кнопки на карточке позволяют редактировать и удалять коллекцию без перехода в detail.

## Где используется

1. `src/App.tsx`
