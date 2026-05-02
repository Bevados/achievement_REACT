# src/config/collections.config.ts

## Что делает файл

Файл хранит UI-словарь названий категорий коллекций.
Нужен для преобразования slug-категорий в человекочитаемые подписи на русском языке.
Также хранит переиспользуемые опции сортировки для списков коллекций.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` (`CollectionCategory`, `CollectionSortField`, `SortOrder`) - типы для словаря и опций сортировки.

## Экспорты и контракты

1. Экспортируется `collectionCategoryLabels`.
2. Экспортируется `collectionSortByOptions`.
3. Экспортируется `collectionSortOrderOptions`.
4. Тип `collectionCategoryLabels`: `Record<CollectionCategory, string>`.
5. Инвариант: для каждой категории из контрактов обязана существовать подпись.
6. Опции сортировки строго типизированы и синхронизированы с контрактными enum-полями.

## Нетривиальная логика

1. Логика минимальна, но типизация по контрактным типам защищает от расхождений между UI и backend-контрактом при расширении enum.

## Где используется

1. `src/components/Collections/CollectionCard.tsx` - вывод подписи категории на карточке.
2. `src/pages/ExamplesPage/ExamplesPage.tsx` - select-опции сортировки и порядка.
