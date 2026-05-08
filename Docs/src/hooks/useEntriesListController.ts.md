# src/hooks/useEntriesListController.ts

## Что делает файл

Файл содержит общий кастомный хук для detail-страниц списков карточек `entries`.
Хук объединяет server-driven фильтры, сортировку, пагинацию, loading/error и синхронизацию query-параметров с URL.

## Импорты и зависимости

1. `react` — `useState`, `useEffect`, `useCallback`.
2. `react-router-dom` (`useSearchParams`) — sync filter-state с URL.
3. `contracts/collection.contracts.ts` — типы query, сортировки, статуса, pagination и элементов списка.

## Экспорты и контракты

1. Экспортируется `useEntriesListController(options)`.
2. Обязательные входные параметры:
   - `collectionId`
   - `fetchEntries(collectionId, query)`
   - `fallbackErrorMessage`
3. Опциональный параметр:
   - `pageSize` (по умолчанию 12)
4. Хук возвращает:
   - данные: `entries`, `meta`
   - состояние фильтров и полей ввода
   - loading/error
   - обработчики apply/reset/pagination/reload

## Нетривиальная логика

1. Держит отдельно input-state и applied-state для фильтров диапазонов, чтобы запросы уходили только после `Применить`.
2. Конвертирует `type="date"` поля в ISO-границы суток:
   - `From` -> начало дня
   - `To` -> конец дня
3. Автоматически сбрасывает `page` на 1 при применении фильтров и при смене сортировки/статуса.
4. Переиспользуется и в private, и в public detail-страницах, различается только fetcher.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
