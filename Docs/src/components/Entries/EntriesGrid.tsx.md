# src/components/Entries/EntriesGrid.tsx

## Что делает файл

Рендерит список карточек `EntryView` и отвечает за layout списка.
На desktop использует masonry feel поверх CSS Grid, а на mobile/tablet остаётся простой одноколонной или двухколоночной сеткой без лишней сложности.

## Импорты и зависимости

1. `react` — `useEffect`, `useRef`, `useState` для измерения высоты карточек и хранения `rowSpans`.
2. `contracts/collection.contracts.ts` — `EntryView`.
3. `./EntryCard` — отдельная карточка списка.

## Экспорты и контракты

1. Экспортируется `EntriesGrid`.
2. Пропсы:
   - `entries: EntryView[]`
   - `emptyMessage: string`
   - `showActions?: boolean`
   - `onEditEntry?: (entry: EntryView) => void`
   - `onDeleteEntry?: (entry: EntryView) => void`

## Нетривиальная логика

1. На desktop `ResizeObserver` пересчитывает `gridRowEnd: span N` по реальной высоте карточки.
2. Порядок карточек остаётся порядком исходного массива `entries.map(...)`.
3. Private edit/delete callbacks только пробрасываются вниз в `EntryCard`; modal-state и confirm-flow grid на себя не берёт.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
