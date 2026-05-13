# src/components/Entries/EntryCard.tsx

## Что делает файл

Рендерит одну карточку `EntryView` в read-only виде.
Карточка адаптируется к реальным данным записи: обязательный каркас виден всегда, а изображение, описание, meta-блок, теги и строка `Обновлено` появляются только когда для них есть данные.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — `EntryView` и `EntryStatus`.

## Экспорты и контракты

1. Экспортируется `EntryCard`.
2. Пропсы:
   - `entry: EntryView`
   - `showActions?: boolean`
   - `onEdit?: (entry: EntryView) => void`
   - `onDelete?: (entry: EntryView) => void`

## Нетривиальная логика

1. `showActions` переключает private/public режим карточки.
2. `onEdit` и `onDelete` делают кнопки действий рабочими только в private-контексте.
3. `formatDateRange()` превращает `dateStart/dateEnd` либо в одну дату, либо в период.
4. Рейтинг рисуется как 10-звездная шкала плюс числовое значение `N / 10`.
5. Карточка сохраняет естественную высоту, чтобы `EntriesGrid` мог строить плотную masonry-сетку без пустых вертикальных зон.

## Где используется

1. `src/components/Entries/EntriesGrid.tsx`
