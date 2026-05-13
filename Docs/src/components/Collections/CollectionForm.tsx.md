# src/components/Collections/CollectionForm.tsx

## Что делает файл

Компонент рендерит private modal-форму коллекции для create/edit сценариев.
На шаге `5.5` форма уже не хранит поля вручную через `useState`: она использует `react-hook-form`, валидирует ввод через Zod и при успешном submit отдаёт нормализованный payload наружу, но ещё не делает реальный API-запрос.

## Импорты и зависимости

1. `react` (`useEffect`) — очищает `customCategory`, когда пользователь уходит с варианта `other`.
2. `react-hook-form` — управляет form-state, submit и ошибками валидации.
3. `contracts/collection.contracts.ts` — даёт тип итогового payload `CreateCollectionDto` и список enum-категорий.
4. `src/config/collections.config.ts` — человекочитаемые labels категорий.
5. `src/utils/crud-form.utils.ts` — shared resolver и нормализация значений формы.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionForm`.
2. Пропсы:
   - `mode: 'create' | 'edit'`
   - `initialValues?: Partial<CollectionFormValues>`
   - `onCancel: () => void`
   - `onSubmit?: (values: CreateCollectionDto) => void | Promise<void>`
3. `onSubmit` теперь получает уже очищенный payload:
   - пустые строки убраны;
   - `customCategory` передаётся только для `category='other'`;
   - `coverImageUrl` и `description` идут как optional.

## Нетривиальная логика

1. Валидация опирается на shared Zod-правила, но усиливает UX-требование: если выбрана категория `other`, `customCategory` обязателен на клиенте.
2. `useEffect` не даёт скрытому старому значению `customCategory` остаться в форме, если пользователь переключился обратно на preset-категорию.
3. Форма работает с `noValidate`, чтобы ошибки показывал именно Zod/RHF-слой, а не встроенная browser-валидация.
4. Кнопка `Сохранить` больше не disabled по умолчанию: валидная форма уже ведёт себя как настоящий submit-entrypoint для следующего CRUD-подпункта.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
