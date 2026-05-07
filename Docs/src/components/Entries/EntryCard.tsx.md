# src/components/Entries/EntryCard.tsx

## Что делает файл

Компонент рендерит одну карточку `entry` в read-only виде.
Он показывает статус, заголовок, описание, optional meta-поля, теги и дату обновления.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — типы `EntryView` и `EntryStatus`.

## Экспорты и контракты

1. Экспортируется `EntryCard`.
2. Пропсы:
   - `entry: EntryView`
   - `showActions?: boolean`

## Нетривиальная логика

1. `showActions` управляет отображением disabled-кнопок `Редактировать` / `Удалить`.
2. Это позволяет использовать один и тот же UI и для private detail, и для public examples detail.
3. Optional meta и теги рендерятся только когда реально есть данные.

## Где используется

1. `src/components/Entries/EntriesGrid.tsx`
