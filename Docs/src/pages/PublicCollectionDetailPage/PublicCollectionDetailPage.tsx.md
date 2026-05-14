# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx

## Что делает файл

Рендерит public detail-страницу example-коллекции в read-only режиме.

## Импорты и зависимости

1. `react`
2. `react-router-dom`
3. `src/api/collections.api.ts`
4. `EntriesFilters`, `EntriesGrid`, `EntriesPagination`
5. `useEntriesListController`

## Экспорты и контракты

1. Экспортируется default-компонент `PublicCollectionDetailPage`.
2. Страница использует route-param `collectionId` и совместима с optional slug в URL.

## Нетривиальная логика

1. Страница использует тот же filter/list controller, что и private detail, но остаётся полностью read-only.
2. Показывает обе даты коллекции: `createdAt` и `updatedAt`.
3. Имеет верхнюю и нижнюю точки возврата к списку примеров, без дублирующей CTA-кнопки.
4. Empty-state карточек тоже зависит от `hasActiveFilters`: пустая коллекция и пустой результат фильтрации показывают разные сообщения.

## Где используется

1. `src/App.tsx`
