# src/components/Entries/EntryForm.test.tsx

## Что делает файл

Покрывает `EntryForm` после UX-правок модальной формы.
Тесты проверяют create/edit режимы, новые подписи для блока дат, completed-валидацию с русскими сообщениями, range-date правила, нормализованный payload и отсутствие устаревших helper-текстов.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./EntryForm`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - create-форма редактирует ключевые поля;
   - `Выбрать дату / Выбрать период` корректно меняют набор date-полей;
   - edit-форма подставляет initial values;
   - `completed` без `rating` и `dateStart` не проходит;
   - `dateEnd < dateStart` даёт ошибку;
   - валидный submit отдаёт нормализованный payload;
   - `submitError` рендерится внутри формы;
   - старые helper-тексты больше не показываются.

## Нетривиальная логика

1. Тесты используют `fireEvent.change` для стабильной работы с длинными строками и `input[type=date]`.
2. Completed-сценарий защищает бизнес-правила формы, чтобы она не расходилась с backend contract.
3. Русские сообщения об обязательности и ошибке диапазона дат зафиксированы отдельными assertions.
4. Submit-тест подтверждает нормализацию `price`, `tags` и `dateStart/dateEnd` до вызова реального API-слоя.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/components/Entries/EntryForm.tsx`.
