# src/components/Collections/CollectionForm.test.tsx

## Что делает файл

Тестирует `CollectionForm` в create/edit режимах, клиентскую валидацию и нормализованный submit payload.
После шага `5.6.1` тесты также фиксируют, что helper-text и submit-flow формы соответствуют уже подключённым create/update мутациям коллекций.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./CollectionForm`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяются сценарии:
   - create-mode;
   - edit-mode;
   - обязательный `customCategory` для `other`;
   - валидация `coverImageUrl`;
   - нормализованный `onSubmit` payload;
   - отмена через `onCancel`.

## Нетривиальная логика

1. Поле `customCategory` появляется только для `category='other'`.
2. Submit проверяется на нормализованном DTO-подобном payload, а не на сыром UI-state.
3. Helper-text подтверждает текущее состояние UX: create/edit коллекции уже подключены, а не отложены как заглушка.

## Где используется

1. Запускается в `npm.cmd run test`.
