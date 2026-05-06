# src/components/Entries/EntriesGrid.tsx

## Что делает файл

Файл рендерит список карточек `Entry` в виде grid-layout.
Если список пуст, вместо карточек показывает единый empty-state message.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` (`EntryView`) задает тип элементов списка.
2. `src/components/Entries/EntryCard.tsx` рендерит отдельную карточку `Entry`.

## Экспорты и контракты

1. Экспортируется default-компонент `EntriesGrid`.
2. Входные данные:
2.1. `entries: EntryView[]`;
2.2. `emptyMessage: string`.
3. Если `entries.length === 0`, компонент не строит grid, а показывает empty-state блок.

## Нетривиальная логика

1. Компонент intentionally тонкий: логика загрузки и ошибок живет выше, а `EntriesGrid` отвечает только за success/empty presentation layer.
2. Empty-state вынесен в этот уровень, чтобы detail-page не дублировала каркас списка вручную.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` показывает через него список карточек текущей коллекции.
