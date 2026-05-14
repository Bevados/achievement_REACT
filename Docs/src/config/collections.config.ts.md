# src/config/collections.config.ts

## Что делает файл

Файл хранит UI-словарь названий категорий коллекций и опции сортировки для списков коллекций.
Также он содержит helper для отображения пользовательской категории.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — типы `CollectionCategory`, `CollectionSortField`, `CollectionView`, `SortOrder`.

## Экспорты и контракты

1. `collectionCategoryLabels`
2. `orderedCollectionCategoryOptions`
3. `collectionSortByOptions`
4. `collectionSortOrderOptions`
5. `getCollectionCategoryLabel(collection)`

## Нетривиальная логика

1. `collectionCategoryLabels` по-прежнему описывает только фиксированный enum.
2. `getCollectionCategoryLabel` — новая точка отображения категории:
   - если `category !== 'other'`, возвращает label из словаря;
   - если `category === 'other'` и есть `customCategory`, возвращает пользовательский текст;
   - если `category === 'other'`, но `customCategory` пуст, возвращает стандартное `Другое`.
3. Такой helper позволяет не дублировать условную логику по компонентам карточек и detail-страниц.
4. `orderedCollectionCategoryOptions` хранит только preset-категории без `other`, чтобы форма могла отдельно вывести `Своя категория` сверху, а основной список показать в стабильном алфавитном порядке.

## Где используется

1. `src/components/Collections/CollectionCard.tsx`
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
3. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
4. `src/components/Collections/CollectionsFilters.tsx`
