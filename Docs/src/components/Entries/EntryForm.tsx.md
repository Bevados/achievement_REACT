# src/components/Entries/EntryForm.tsx

## Что делает файл

Компонент рендерит UI-форму карточки `Entry` для private CRUD-сценариев.
На текущем этапе это controlled-форма в модалке без API-submit: она показывает все будущие поля карточки, поддерживает create/edit режимы и локальный переключатель даты `одна дата / период`.

## Импорты и зависимости

1. `react` (`useState`) — хранит локальное состояние полей и режим даты.
2. `contracts/collection.contracts.ts` — даёт тип `EntryStatus` и список статусов `ENTRY_STATUSES`.
3. `src/config/entries.config.ts` — поставляет локализованные подписи статусов.

## Экспорты и контракты

1. Экспортируется default-компонент `EntryForm`.
2. Пропсы:
   - `mode: 'create' | 'edit'`
   - `initialValues?: Partial<EntryFormValues>`
   - `onCancel: () => void`
   - `onSubmit?: (values: EntryFormValues) => void`
3. Локальная модель значений:
   - `title`
   - `status`
   - `description`
   - `imageUrl`
   - `price`
   - `tags`
   - `rating`
   - `dateStart`
   - `dateEnd`
4. Локальный UI-state:
   - `dateMode: 'single' | 'range'`

## Нетривиальная логика

1. `getInitialValues` позволяет безопасно стартовать и пустую create-форму, и edit-форму с существующими данными карточки.
2. `dateMode` живёт только в UI и не утечёт в backend DTO: доменная модель по-прежнему опирается только на `dateStart/dateEnd`.
3. При возврате из `range` в `single` форма очищает `dateEnd`, чтобы не оставлять скрытое “висящее” значение.
4. Кнопка сохранения намеренно disabled, а helper-блок объясняет, что реальный submit появится на следующем подпункте.

## Где используется

1. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — модалка создания карточки.
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — модалка редактирования карточки.
