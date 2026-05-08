# src/components/Entries/EntriesPagination.tsx

## Что делает файл

Файл содержит общий UI-блок пагинации для списков карточек `entries`.
Показывает текущую страницу, общее число карточек и кнопки перехода Назад/Вперед.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` (`PaginationMeta`) — тип метаданных пагинации.

## Экспорты и контракты

1. Экспортируется default-компонент `EntriesPagination`.
2. Входные параметры:
   - `meta`, `page`, `isLoading`;
   - callbacks `onPreviousPage`, `onNextPage`.

## Нетривиальная логика

1. Кнопка Назад блокируется на первой странице.
2. Кнопка Вперед блокируется при отсутствии `meta` или достижении последней страницы.
3. Поведение блокировок учитывает `isLoading`.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
