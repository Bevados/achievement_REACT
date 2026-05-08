# src/components/Entries/EntriesFilters.tsx

## Что делает файл

Файл содержит общий UI-блок фильтров для списков карточек `entries` на detail-страницах коллекций.
Компонент отображает сортировку, порядок, статус и диапазоны для дат, цены и рейтинга, а сам блок фильтров можно открыть и скрыть по кнопке.

## Импорты и зависимости

1. `react` (`FormEvent`, `useId`, `useState`) — submit-обработка, локальное состояние раскрытия и привязка кнопки к панели фильтров.
2. `contracts/collection.contracts.ts` — типы `EntryStatus`, `EntrySortField`, `SortOrder` и список статусов.
3. `src/config/entries.config.ts` — подписи статусов и опции сортировки/порядка.

## Экспорты и контракты

1. Экспортируется default-компонент `EntriesFilters`.
2. Компонент полностью контролируемый:
   - получает текущие значения фильтров;
   - принимает callbacks для изменения полей;
   - вызывает `onApply` и `onReset`.
3. Раскрытие/сворачивание фильтров хранится локально в UI-компоненте и не влияет на query-контракт.

## Нетривиальная логика

1. UI одинаков для private и public detail-страниц, различается только fetcher и `showActions` у карточек.
2. Для дат используются поля `type="date"`, а конвертация в ISO-query выполняется уже в controller hook, а не в UI-компоненте.
3. Если у списка уже есть активные фильтры, компонент автоматически раскрывает панель, чтобы пользователь сразу видел действующие условия.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx`
