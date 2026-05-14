# src/hooks/useEntriesListController.ts

## Что делает файл

Хранит общий controller-хук для detail-списков карточек `entries`.

## Импорты и зависимости

1. `react`
2. `react-router-dom`
3. `contracts/collection.contracts.ts`

## Экспорты и контракты

1. Экспортируется `useEntriesListController(options)`.
2. Хук управляет:
   - server-driven фильтрами;
   - сортировкой;
   - пагинацией;
   - applied/input state диапазонов;
   - sync с URL;
   - retry;
   - признаком `hasActiveFilters`.

## Нетривиальная логика

1. Input-state и applied-state диапазонов разделены, поэтому запросы уходят только после `Применить`.
2. Date-inputs конвертируются в ISO-границы суток.
3. Query sync больше не использует `replace`, чтобы back/forward не ощущались "залипающими".
4. `hasActiveFilters` позволяет страницам различать пустую коллекцию без карточек и пустой результат после применения фильтров.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
