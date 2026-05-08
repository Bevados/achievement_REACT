# src/components/Entries/EntriesGrid.tsx

## Что делает файл

Компонент рендерит список карточек `entries` или empty-state.
На desktop он дополнительно собирает masonry feel поверх CSS Grid, не ломая порядок массива.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — тип `EntryView`.
2. `./EntryCard` — карточка одной записи.

## Экспорты и контракты

1. Экспортируется `EntriesGrid`.
2. Пропсы:
   - `entries: EntryView[]`
   - `emptyMessage: string`
   - `showActions?: boolean`

## Нетривиальная логика

1. Проп `showActions` пробрасывается в каждую `EntryCard`, чтобы public detail мог скрывать private action-зону.
2. Через `ResizeObserver` и `grid-row-end: span N` компонент вычисляет высоту каждого элемента и убирает forced equal-height rows на desktop.
3. Порядок карточек сохраняется через обычный `entries.map(...)`; CSS columns не используются.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
