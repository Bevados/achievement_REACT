# src/components/Collections/CollectionForm.test.tsx

## Что делает файл

Тестирует `CollectionForm` после перевода на `react-hook-form + zod`.
Покрывает create/edit режимы, обязательность `customCategory` для `other`, URL-валидацию и нормализованный submit.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./CollectionForm`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - create-форма редактирует поля и закрывается по `Отмена`;
   - edit-форма корректно подставляет initial values;
   - `customCategory` обязательно при `category='other'`;
   - невалидный `coverImageUrl` даёт ошибку;
   - валидный submit вызывает `onSubmit` с нормализованным payload.

## Нетривиальная логика

1. Тест на `other + customCategory` страхует принятое бизнес-решение о пользовательской категории как `category='other' + customCategory`, а не свободной замене enum.
2. Submit-проверка подтверждает, что форма уже готовит DTO-совместимый payload до подключения реального API.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/components/Collections/CollectionForm.tsx`.
