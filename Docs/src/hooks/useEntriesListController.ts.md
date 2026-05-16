# src/hooks/useEntriesListController.ts

## Что делает файл

Хранит общий controller-хук и отдельный state-хук для server-driven списка карточек коллекции с фильтрами и пагинацией.

## Импорты и зависимости

1. `react` — reducer, эффекты и legacy manual-fetch state.
2. `react-router-dom` — `useSearchParams`.
3. `contracts/collection.contracts.ts` — типы карточек, статусов, сортировок и query DTO.

## Экспорты и контракты

1. `EntriesQuery` — нормализованный shape query-параметров списка карточек.
2. `useEntriesListState(pageSize?)` — URL-state для фильтров, сортировки и пагинации без загрузки данных.
3. `useEntriesListController(options)` — legacy/manual-fetch обёртка над `useEntriesListState()` для совместимости со старыми сценариями.

## Нетривиальная логика

1. Input-state фильтров отделён от applied-state, чтобы пользователь мог заполнить поля до нажатия `Применить`.
2. URL-state синхронизируется через reducer, без прямых `setState` в эффекте.
3. Query-параметры дат конвертируются в начало/конец дня в ISO.
4. Empty-state зависит от `hasActiveFilters`: без фильтров коллекция считается пустой, с фильтрами — просто ничего не найдено.

## Где используется

1. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx` — через `useEntriesListState()` и public Query hooks.
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — через `useEntriesListState()` и private Query hooks.
3. Тип `EntriesQuery` используется в private и public query keys.
