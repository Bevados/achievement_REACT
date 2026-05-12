# src/components/Entries/EntriesGrid.tsx

## Что делает файл

Компонент рендерит список карточек `EntryView` и отвечает за layout списка.
На desktop он строит masonry feel поверх CSS Grid, а на mobile/tablet остаётся простым и устойчивым. Также он служит общей точкой проброса private edit callback в отдельные карточки.

## Импорты и зависимости

1. `react` (`useEffect`, `useRef`, `useState`) — измерение высоты карточек и хранение `rowSpans`.
2. `contracts/collection.contracts.ts` — тип `EntryView`.
3. `./EntryCard` — отдельная карточка списка.

## Экспорты и контракты

1. Экспортируется `EntriesGrid`.
2. Пропсы:
   - `entries: EntryView[]`
   - `emptyMessage: string`
   - `showActions?: boolean`
   - `onEditEntry?: (entry: EntryView) => void`

## Нетривиальная логика

1. На desktop grid получает `auto-rows` и объект `rowSpans`, который вычисляется на основе реальной DOM-высоты карточек.
2. `ResizeObserver` следит и за контейнером, и за отдельными item-wrapper-элементами, чтобы masonry корректно пересчитывался после resize и после появления изображения.
3. Для сохранения строчного порядка используется обычный `entries.map(...)`, а не CSS columns.
4. `onEditEntry` пробрасывается в `EntryCard` только в private-режиме, поэтому сам grid остаётся общим для private/public detail без логики modal-state.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
