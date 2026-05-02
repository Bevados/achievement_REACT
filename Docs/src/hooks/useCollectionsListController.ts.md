# src/hooks/useCollectionsListController.ts

## Что делает файл

Файл содержит общий кастомный хук для страниц списков коллекций.
Хук объединяет загрузку данных, фильтры, пагинацию, состояния loading/error и синхронизацию query-параметров с URL.

## Импорты и зависимости

1. `react` (`useState`, `useEffect`, `useCallback`) - управление состоянием и загрузкой.
2. `react-router-dom` (`useSearchParams`) - двусторонняя синхронизация состояния страницы с query string.
3. `contracts/collection.contracts.ts` - типы query, сортировки, категории, pagination и элементов списка.

## Экспорты и контракты

1. Экспортируется `useCollectionsListController(options)`.
2. Обязательные входные параметры:
   - `fetchCollections(query)` - функция фактической загрузки (public/private).
   - `fallbackErrorMessage` - fallback-текст ошибки.
3. Опциональный параметр: `pageSize` (по умолчанию 12).
4. Хук возвращает:
   - данные: `collections`, `meta`;
   - состояния: `isLoading`, `errorMessage`, `page`, `sortBy`, `sortOrder`, `category`, `searchInput`;
   - обработчики: смена фильтров, submit поиска, reset, pagination, retry.

## Нетривиальная логика

1. Инициализирует состояние из URL (`page/sortBy/sortOrder/category/search`) при первом рендере.
2. Автоматически синхронизирует состояние обратно в URL, удаляя параметры с дефолтными значениями.
3. Централизует загрузку данных и единообразную обработку ошибок.
4. Сбрасывает `page` на 1 при изменении сортировки, категории или подтверждении поиска.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx` - контроллер публичного списка examples.
2. `src/pages/CollectionsPage/CollectionsPage.tsx` - контроллер приватного списка пользователя.
