# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx

## Что делает файл

Файл реализует публичную detail-страницу example-коллекции.
Страница показывает саму коллекцию и её карточки в read-only режиме, без private action-кнопок и без modal-форм.

## Импорты и зависимости

1. `react` (`useCallback`, `useEffect`, `useState`)
2. `react-router-dom` (`Link`, `useParams`)
3. `contracts/collection.contracts.ts`
4. `src/api/collections.api.ts`
5. `src/components/Entries/EntriesFilters.tsx`
6. `src/components/Entries/EntriesGrid.tsx`
7. `src/components/Entries/EntriesPagination.tsx`
8. `src/config/collections.config.ts` — helper `getCollectionCategoryLabel`
9. `src/hooks/useEntriesListController.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `PublicCollectionDetailPage`.
2. Страница работает только с публичными example-данными и не принимает пропсы.

## Нетривиальная логика

1. Для категории используется тот же `getCollectionCategoryLabel`, что и в private UI, поэтому public detail тоже корректно отображает пользовательский текст, если example-коллекция использует `other + customCategory`.
2. Несмотря на общий helper категорий, страница остаётся полностью read-only и не получает form-entrypoints.

## Где используется

1. `src/App.tsx` рендерит страницу на public-route `/examples/:collectionId`.
