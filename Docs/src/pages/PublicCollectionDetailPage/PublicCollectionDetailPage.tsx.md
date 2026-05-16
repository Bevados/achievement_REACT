# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx

## Что делает файл

Рендерит public detail-страницу example-коллекции в read-only режиме.

## Импорты и зависимости

1. `react-router-dom` — route params и ссылки назад.
2. `EntriesFilters`, `EntriesGrid`, `EntriesPagination` — общий UI для списка карточек.
3. `src/config/collections.config.ts` — label категории коллекции.
4. `useEntriesListController.ts` — URL-state фильтров и пагинации.
5. `usePublicCollectionsQueries.ts` — public Query hooks для detail и entries.

## Экспорты и контракты

1. Экспортируется default-компонент `PublicCollectionDetailPage`.
2. Страница использует route-param `collectionId` и совместима с optional slug в URL.

## Нетривиальная логика

1. Страница использует `useEntriesListState()` только как слой URL-state, а detail и entries загружает отдельными public Query hooks.
2. Retry-кнопка перезапрашивает обе query-ветки: и detail коллекции, и список карточек.
3. Показывает обе даты коллекции: `createdAt` и `updatedAt`.
4. Имеет верхнюю и нижнюю точки возврата к списку примеров, без дублирующей CTA-кнопки.
5. Empty-state карточек зависит от `hasActiveFilters`: пустая коллекция и пустой результат фильтрации показывают разные сообщения.

## Где используется

1. `src/App.tsx`
