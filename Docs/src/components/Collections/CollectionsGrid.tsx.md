# src/components/Collections/CollectionsGrid.tsx

## Что делает файл

Компонент рендерит сетку карточек коллекций или empty-state, если коллекций нет.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — тип `CollectionView`.
2. `./CollectionCard` — карточка одной коллекции.

## Экспорты и контракты

1. Экспортируется `CollectionsGrid`.
2. Пропсы:
   - `collections: CollectionView[]`
   - `emptyMessage: string`
   - `getCollectionHref?: (collection) => string | undefined`

## Нетривиальная логика

1. `getCollectionHref` позволяет странице самой решать, куда ведет карточка: в private detail или в public detail.
2. Компонент не знает о роутинге напрямую и остается переиспользуемым list-shell.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`
2. `src/pages/CollectionsPage/CollectionsPage.tsx`
