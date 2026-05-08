# src/components/Entries/EntriesGrid.test.tsx

## Что делает файл

Файл тестирует контракт списка карточек `EntriesGrid`.
Покрывает empty-state, сохранение порядка массива и public read-only режим без action-кнопок.

## Импорты и зависимости

1. `vitest` — тестовый раннер и assertions.
2. `@testing-library/react` — рендер и поиск элементов в DOM.
3. `./EntriesGrid` — тестируемый компонент.
4. `contracts/collection.contracts.ts` — тип `EntryView` для тестовых данных.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
   - empty-state показывается при пустом массиве;
   - карточки рендерятся в том же порядке, что и исходный массив `entries`;
   - `showActions={false}` сохраняет public read-only режим без private action-кнопок.

## Нетривиальная логика

1. Тест на порядок проверяет не masonry geometry, а инвариант источника порядка: `entries.map(...)` должен оставаться главным порядком рендера.
2. Это защищает от регрессии, если в будущем кто-то попробует перейти на CSS columns или другой layout, который ломает ожидаемый порядок чтения.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает от регрессий `src/components/Entries/EntriesGrid.tsx`.
