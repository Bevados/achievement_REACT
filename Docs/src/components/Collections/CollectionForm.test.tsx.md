# src/components/Collections/CollectionForm.test.tsx

## Что делает файл

Тестирует UI-контракт `CollectionForm` без backend-submit.
Покрывает create/edit режимы, локальное редактирование полей, кнопку `Отмена`, disabled-состояние кнопки сохранения и сценарий со `Своя категория`.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./CollectionForm`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - create-форма стартует пустой
   - edit-форма подставляет initial values
   - поле `Своя категория` показывается только при `category='other'`
   - `Отмена` вызывает callback
   - `Сохранить` остаётся disabled

## Нетривиальная логика

1. Тест на `Своя категория` защищает UI-решение, где пользовательский текст идёт отдельным полем, а не свободной заменой enum.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/components/Collections/CollectionForm.tsx`.
