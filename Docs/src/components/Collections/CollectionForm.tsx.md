# src/components/Collections/CollectionForm.tsx

## Что делает файл

Компонент рендерит private modal-форму коллекции для create/edit сценариев.
После шага `5.6.1` форма использует `react-hook-form`, валидирует ввод через Zod, отдаёт наружу нормализованный payload и умеет показывать submit-ошибку от page-level API-запроса.

## Импорты и зависимости

1. `react` (`useEffect`) — очищает `customCategory`, когда пользователь уходит с варианта `other`.
2. `react-hook-form` — управляет form-state, submit и ошибками.
3. `contracts/collection.contracts.ts` — даёт тип `CreateCollectionDto` и enum категорий.
4. `src/config/collections.config.ts` — человекочитаемые labels категорий.
5. `src/utils/crud-form.utils.ts` — resolver и нормализация значений формы.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionForm`.
2. Пропсы:
   - `mode: 'create' | 'edit'`
   - `initialValues?: Partial<CollectionFormValues>`
   - `onCancel: () => void`
   - `onSubmit?: (values: CreateCollectionDto) => void | Promise<void>`
   - `submitError?: string | null`
3. `onSubmit` получает уже очищенный payload:
   - пустые строки убраны;
   - `customCategory` передаётся только для `category='other'`;
   - `coverImageUrl` и `description` остаются optional.

## Нетривиальная логика

1. Если выбрана категория `other`, `customCategory` обязательно на клиенте.
2. Select категории теперь стартует с пустого значения и placeholder `Например, Путешествия`, чтобы пользователь сначала осознанно выбрал вариант.
3. В выпадающем списке `Своя категория` вынесена в отдельную группу сверху, а основные preset-категории идут отдельным алфавитным списком.
4. `useEffect` не даёт скрытому старому значению `customCategory` остаться в форме, если пользователь вернулся на preset-категорию.
5. Форма работает с `noValidate`, чтобы ошибки показывал именно RHF/Zod-слой.
6. Кнопка `Сохранить` больше не disabled по умолчанию: форма уже работает как реальный submit-entrypoint для create/update коллекции.
7. Если create/update запрос вернул ошибку, `submitError` показывается внутри формы отдельным alert-блоком.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
