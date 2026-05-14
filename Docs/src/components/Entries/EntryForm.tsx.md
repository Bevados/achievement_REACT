# src/components/Entries/EntryForm.tsx

## Что делает файл

Рендерит private modal-форму карточки `Entry` для create/edit сценариев.
Форма уже подключена к `react-hook-form + zod`, поддерживает реальные create/update submit-callbacks, а также стала компактнее по layout и удобнее на небольших экранах.

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
4. Обязательные поля отмечаются `*`, причём для `rating` и `date` обязательность зависит от текущего `status`, без постоянных предупреждающих helper-текстов.
5. Поле `rating` динамически меняет позицию: в обычном режиме живёт рядом с `price`, а при `completed` поднимается ближе к `status`.
6. Валидационные сообщения для обязательных полей, URL, чисел и диапазона дат показываются пользователю на русском.
7. Layout формы уплотнён через двухколоночные блоки и sticky-row с действиями, чтобы длинная форма оставалась удобной внутри модалки.
8. Форма не делает fetch сама: submit-ошибка приходит через `submitError` от страницы, чтобы API-слой оставался снаружи.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — create modal для карточки.
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — edit modal для карточки.
