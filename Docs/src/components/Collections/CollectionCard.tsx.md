# src/components/Collections/CollectionCard.tsx

## Что делает файл

Компонент рендерит одну карточку коллекции для public/private списков.
Он показывает обложку, категорию, количество карточек, описание и ссылку на detail-страницу, если маршрут передан через `to`.

## Импорты и зависимости

1. `react-router-dom` (`Link`) — кликабельный переход на detail-route.
2. `contracts/collection.contracts.ts` — тип `CollectionView`.
3. `src/config/collections.config.ts` — helper `getCollectionCategoryLabel`.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionCard`.
2. Пропсы:
   - `collection: CollectionView`
   - `to?: string`

## Нетривиальная логика

1. Если `to` не передан, карточка остаётся статичной и не оборачивается в `Link`.
2. Категория отображается через `getCollectionCategoryLabel`, поэтому карточка автоматически показывает пользовательский текст, если коллекция использует `other + customCategory`.

## Где используется

1. `src/components/Collections/CollectionsGrid.tsx`
