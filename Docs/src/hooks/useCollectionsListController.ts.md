# src/hooks/useCollectionsListController.ts

## Что делает файл

Хранит общий controller-хук для списков коллекций.

## Импорты и зависимости

1. `react`
2. `react-router-dom`
3. `contracts/collection.contracts.ts`

## Экспорты и контракты

1. Экспортируется `useCollectionsListController(options)`.
2. Хук управляет:
   - загрузкой списка;
   - фильтрами и сортировкой;
   - пагинацией;
   - sync с URL;
   - retry.

## Нетривиальная логика

1. Инициализирует state из query string.
2. Возвращает state обратно в URL, но теперь без `replace`, чтобы браузерная history вела себя ближе к обычной вкладке.
3. Сбрасывает страницу на `1` при смене ключевых фильтров.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/pages/CollectionsPage/CollectionsPage.tsx`
