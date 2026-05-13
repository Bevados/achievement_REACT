# src/components/Entries/EntryForm.tsx

## Что делает файл

Компонент рендерит private modal-форму карточки `Entry` для create/edit сценариев.
На шаге `5.5` форма переведена на `react-hook-form`, валидирует completed-правила через Zod и отдаёт наружу уже нормализованный payload, но ещё не делает CRUD-запросы сама.

## Импорты и зависимости

1. `react` (`useMemo`, `useState`) — хранит локальный `dateMode` и пересобирает resolver при смене режима даты.
2. `react-hook-form` — управляет form-state, submit и ошибками.
3. `contracts/collection.contracts.ts` — даёт тип итогового payload `CreateEntryDto` и enum статусов.
4. `src/config/entries.config.ts` — локализованные labels статусов.
5. `src/utils/crud-form.utils.ts` — shared resolver, нормализация `price/tags/dateStart/dateEnd`.

## Экспорты и контракты

1. Экспортируется default-компонент `EntryForm`.
2. Пропсы:
   - `mode: 'create' | 'edit'`
   - `initialValues?: Partial<EntryFormValues>`
   - `onCancel: () => void`
   - `onSubmit?: (values: CreateEntryDto) => void | Promise<void>`
3. Внутренний `dateMode: 'single' | 'range'` остаётся только UI-state и не попадает в DTO/API.

## Нетривиальная логика

1. Resolver переиспользует shared business rules:
   - для `completed` обязательны `rating` и `dateStart`;
   - `dateEnd` не может быть раньше `dateStart`.
2. Переключение `range -> single` очищает `dateEnd` и снимает связанные ошибки, чтобы форма не держала скрытое невалидное значение.
3. Нормализация submit-полей:
   - `price` превращается в `number`;
   - `tags` превращаются в массив без дублей;
   - даты из `<input type="date">` превращаются в ISO-строки.
4. `noValidate` отключает встроенную browser-валидацию, чтобы UX контролировался RHF/Zod-слоем.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — create modal для карточки.
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — edit modal для карточки.
