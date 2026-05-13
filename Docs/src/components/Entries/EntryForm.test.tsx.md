# src/components/Entries/EntryForm.test.tsx

## Что делает файл

Покрывает `EntryForm` после подключения `react-hook-form + zod`.
Тесты проверяют create/edit режимы, completed-валидацию, range-date правила и нормализованный submit payload.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./EntryForm`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - create-форма редактирует все ключевые поля;
   - `single/range` переключение корректно меняет набор date-полей;
   - edit-форма подставляет initial values;
   - `completed` без `rating` и `dateStart` не проходит;
   - `dateEnd < dateStart` даёт ошибку;
   - валидный submit отдаёт нормализованный payload.

## Нетривиальная логика

1. Тест на completed-статус защищает новые бизнес-правила шага после `5.2`, чтобы форма не расходилась с backend contract.
2. Submit-тест подтверждает нормализацию `price`, `tags` и `dateStart/dateEnd` ещё до подключения реальной CRUD-мутации.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/components/Entries/EntryForm.tsx`.
