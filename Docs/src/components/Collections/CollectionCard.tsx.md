# src/components/Collections/CollectionCard.tsx

## Что делает файл

Рендерит одну карточку коллекции для public/private списков.

## Импорты и зависимости

1. `lucide-react`
2. `react-router-dom`
3. `contracts/collection.contracts.ts`
4. `src/config/collections.config.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionCard`.
2. Пропсы:
   - `collection: CollectionView`
   - `to?: string`
   - `onEdit?: (collection: CollectionView) => void`
   - `onDelete?: (collection: CollectionView) => void`

## Нетривиальная логика

1. Если `to` передан, кликабельной становится вся карточка.
2. Inline-кнопки `Редактировать` и `Удалить` живут отдельно от `Link`, чтобы не конфликтовать с переходом по карточке.
3. На карточке показываются обе даты: `createdAt` и `updatedAt`.
4. Текстовый CTA `Подробнее` убран, потому что переход идёт кликом по всей карточке.
5. Категория отображается через `getCollectionCategoryLabel`, поэтому корректно работает и `customCategory`.

## Где используется

1. `src/components/Collections/CollectionsGrid.tsx`
