# src/components/Collections/CollectionForm.tsx

## Что делает файл

Рендерит private CRUD-форму коллекции в режимах `create` и `edit`.

## Импорты и зависимости

1. `react`
2. `react-hook-form`
3. `contracts/collection.contracts.ts`
4. `src/config/collections.config.ts`
5. `src/utils/crud-form.utils.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionForm`.
2. Принимает `mode`, `initialValues`, `onCancel`, optional `onSubmit`, optional `submitError`.
3. Submit отдаёт наружу нормализованный `CreateCollectionDto`-совместимый payload.

## Нетривиальная логика

1. Форма использует `react-hook-form` + shared resolver вместо локального `useState`.
2. Если выбрана категория `other`, поле `customCategory` становится видимым и обязательным.
3. Select категории стартует с серого placeholder-состояния, при этом placeholder скрыт из раскрытого списка, а реальные пункты dropdown всегда остаются тёмными.
4. В dropdown сначала идёт опция `Свой вариант`, а затем optgroup `Основные категории`.
5. Все пользовательские ошибки формы приходят из shared-схем на русском, включая обязательность названия и проверку URL обложки.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
