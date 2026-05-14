# src/components/Entries/EntriesFilters.tsx

## Что делает файл

Рендерит общий блок фильтров карточек `entries` для private/public detail-страниц коллекций.

## Импорты и зависимости

1. `react`
2. `contracts/collection.contracts.ts`
3. `src/config/entries.config.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `EntriesFilters`.
2. Компонент полностью controlled по значениям фильтров, но локально хранит только состояние раскрытия панели.

## Нетривиальная логика

1. Если уже есть активные фильтры, панель стартует раскрытой.
2. Панель больше не размонтируется мгновенно: раскрытие и скрытие анимируется через `grid-template-rows` и `opacity`.
3. Компонент переиспользуется и в private, и в public detail, различается только источник данных у страницы.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
