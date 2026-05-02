# src/components/Collections/CollectionCard.tsx

## Что делает файл

Файл рендерит одну универсальную карточку коллекции.
Карточка используется как в публичном списке примеров, так и в приватном списке пользователя.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` (`CollectionView`) - общий контракт данных коллекции.
2. `src/config/collections.config.ts` (`collectionCategoryLabels`) - словарь локализованных названий категорий.
3. Внешних store/API-зависимостей нет: компонент чисто презентационный.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionCard`.
2. Входные данные: `collection: CollectionView`.
3. Ключевые инварианты:
4. Карточка отображает category, entriesCount, title и updatedAt.
5. Если нет `coverImageUrl`, показывается декоративная заглушка вместо изображения.
6. Если `isPublic=true`, выводится badge "Публичная".

## Нетривиальная логика

1. Категория переводится из slug в человекочитаемую подпись через общий config-словарь `collectionCategoryLabels`.
2. Дата обновления форматируется в локальный вид `ru-RU` через `toLocaleDateString`.
3. Есть fallback для пустого описания, чтобы верстка не "ломалась" на пустых данных.

## Где используется

1. `src/components/Collections/CollectionsGrid.tsx` - рендер каждой карточки в списке.
2. Через `CollectionsGrid` используется на страницах `ExamplesPage` и `CollectionsPage`.
