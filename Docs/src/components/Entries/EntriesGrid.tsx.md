# src/components/Entries/EntriesGrid.tsx

## Что делает файл

Компонент рендерит список карточек `entries` или empty-state.

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

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
