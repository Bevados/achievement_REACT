# src/config/entries.config.ts

## Что делает файл

Файл хранит UI-словарь сортировок и подписей статусов для списка карточек `entries`.
Нужен, чтобы `EntriesFilters` не держал текстовые опции и значения sort/status вшитыми в компонент.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` (`EntrySortField`, `EntryStatus`, `SortOrder`) — типы для опций сортировки и словаря статусов.

## Экспорты и контракты

1. Экспортируется `entrySortByOptions`.
2. Экспортируется `entrySortOrderOptions`.
3. Экспортируется `entryStatusLabels`.
4. Все структуры типизированы по контрактным enum-полям, чтобы UI-опции не расходились с backend/API.

## Нетривиальная логика

1. Логика минимальна, но вынос в config важен для переиспользования одного и того же набора опций на private и public detail-страницах.

## Где используется

1. `src/components/Entries/EntriesFilters.tsx` — select-опции сортировки и локализованные подписи статусов.
