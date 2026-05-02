# src/components/Collections/CollectionsPagination.tsx

## Что делает файл

Файл содержит общий UI-блок пагинации для списков коллекций.
Показывает текущую страницу, total и кнопки перехода Назад/Вперед.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` (`PaginationMeta`) - тип метаданных пагинации.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionsPagination`.
2. Входные параметры:
   - `meta`, `page`, `isLoading`;
   - callbacks `onPreviousPage`, `onNextPage`.

## Нетривиальная логика

1. Кнопка Назад блокируется на первой странице.
2. Кнопка Вперед блокируется при отсутствии `meta` или при достижении последней страницы.
3. Поведение блокировок учитывает `isLoading`, чтобы исключить повторные клики во время запроса.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`.
2. `src/pages/CollectionsPage/CollectionsPage.tsx`.
