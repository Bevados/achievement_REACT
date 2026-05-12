# src/components/Collections/CollectionForm.tsx

## Что делает файл

Компонент рендерит UI-форму коллекции для private CRUD-сценариев.
На текущем подпункте это только controlled-форма в модалке: она умеет показывать поля, подставлять initial values для edit-режима, менять локальное состояние и закрываться по `Отмена`, но ещё не отправляет данные в API.

## Импорты и зависимости

1. `react` (`useState`) — хранит локальное состояние полей формы.
2. `contracts/collection.contracts.ts` — даёт тип `CollectionCategory` и список допустимых категорий `COLLECTION_CATEGORIES`.
3. `src/config/collections.config.ts` — поставляет человекочитаемые подписи категорий.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionForm`.
2. Пропсы:
   - `mode: 'create' | 'edit'`
   - `initialValues?: Partial<CollectionFormValues>`
   - `onCancel: () => void`
   - `onSubmit?: (values: CollectionFormValues) => void`
3. Локальная модель значений:
   - `title`
   - `category`
   - `description`
   - `coverImageUrl`

## Нетривиальная логика

1. `getInitialValues` нормализует пропущенные значения и позволяет одной форме обслуживать create/edit без дублирования.
2. На этом шаге primary submit-кнопка специально disabled: форма нужна для сборки UX и подготовки следующего подпункта с валидацией и реальным submit.
3. Helper-блок внутри формы явно объясняет, что сохранение подключится позже, чтобы модалка не выглядела “сломавшейся”.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx` — модалка создания коллекции.
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — модалка редактирования коллекции.
