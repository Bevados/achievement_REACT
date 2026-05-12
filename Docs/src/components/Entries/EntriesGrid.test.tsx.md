# src/components/Entries/EntriesGrid.test.tsx

## Что делает файл

Файл тестирует контракт списка карточек `EntriesGrid`.
Покрывает empty-state, сохранение порядка массива, public read-only режим и private edit callback.

## Импорты и зависимости

1. `vitest` — тестовый раннер, assertions и mock-функции.
2. `@testing-library/react` — рендер и проверки DOM.
3. `@testing-library/user-event` — клик по кнопке `Редактировать`.
4. `./EntriesGrid` — тестируемый компонент.
5. `contracts/collection.contracts.ts` — тип `EntryView` для тестовых данных.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
   - empty-state показывается при пустом массиве;
   - карточки рендерятся в том же порядке, что и исходный массив `entries`;
   - `showActions={false}` сохраняет public read-only режим без private action-кнопок;
   - `onEditEntry` пробрасывается в карточки и вызывается по клику.

## Нетривиальная логика

1. Тест на порядок проверяет не masonry geometry, а инвариант источника порядка: `entries.map(...)` должен оставаться главным порядком рендера.
2. Это защищает от регрессии, если в будущем кто-то попробует перейти на CSS columns или другой layout, который ломает ожидаемый порядок чтения.
3. Отдельный тест на `onEditEntry` подтверждает, что grid только пробрасывает private edit callback в карточки и не берёт на себя modal-state.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Защищает `src/components/Entries/EntriesGrid.tsx` от регрессий.
