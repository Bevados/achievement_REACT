# src/hooks/useCollectionsListController.ts

## Что делает файл

Хранит только URL-state для списка коллекций.
Хук больше не содержит manual-fetch controller-логику и отвечает только за фильтры, поиск, сортировку и пагинацию через query-параметры.

## Импорты и зависимости

1. `react` используется для reducer и синхронизации состояния.
2. `react-router-dom` даёт `useSearchParams`.
3. `contracts/collection.contracts.ts` даёт списки валидных значений для категорий и сортировок.

## Экспорты и контракты

1. `useCollectionsListState()` — состояние и действия для списка коллекций.

## Нетривиальная логика

1. Значения читаются из `URLSearchParams` и нормализуются в reducer-state.
2. Обратная синхронизация в URL идёт без `replace`, чтобы back/forward в браузере работали естественно.
3. При смене фильтров и сортировки страница сбрасывается на `1`.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/pages/ExamplesPage/ExamplesPage.tsx`
3. Private/public Query hooks используют shape query через `src/hooks/query.types.ts`.
