# src/components/Entries/EntryForm.tsx

## Что делает файл

Компонент рендерит private modal-форму карточки `Entry` для create/edit сценариев.
После шага `5.6.2` форма не только валидирует данные и нормализует payload, но и поддерживает page-level submit error UX для реальных create/update API-запросов.

## Импорты и зависимости

1. `react` (`useMemo`, `useState`) — хранит локальный `dateMode` и пересобирает resolver при смене режима даты.
2. `react-hook-form` — управляет form-state, submit и ошибками.
3. `contracts/collection.contracts.ts` — даёт типы итогового payload для create/update и enum статусов.
4. `src/config/entries.config.ts` — локализованные labels статусов.
5. `src/utils/crud-form.utils.ts` — shared resolver и нормализация `price/tags/dateStart/dateEnd`.

## Экспорты и контракты

1. Экспортируется default-компонент `EntryForm`.
2. Пропсы:
   - `mode: 'create' | 'edit'`
   - `initialValues?: Partial<EntryFormValues>`
   - `onCancel: () => void`
   - `onSubmit?: (values: CreateEntryDto | UpdateEntryDto) => void | Promise<void>`
   - `submitError?: string | null`
3. Внутренний `dateMode: 'single' | 'range'` остаётся только UI-state и не попадает в DTO/API.

## Нетривиальная логика

1. Resolver переиспользует shared business rules:
   - для `completed` обязательны `rating` и `dateStart`;
   - `dateEnd` не может быть раньше `dateStart`.
2. Переключение `range -> single` очищает `dateEnd` и снимает связанные ошибки.
3. Нормализация submit-полей:
   - `price` превращается в `number`;
   - `tags` превращаются в массив без дублей;
   - даты из `<input type="date">` превращаются в ISO-строки.
4. Форма не делает fetch сама: submit-ошибка приходит через `submitError` от страницы, чтобы API-слой оставался снаружи.
5. Helper-text отражает текущее состояние UX: create/edit карточки уже подключены, а delete ещё нет.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — create modal для карточки.
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — edit modal для карточки.
