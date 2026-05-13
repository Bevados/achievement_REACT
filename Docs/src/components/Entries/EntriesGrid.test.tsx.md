# src/components/Entries/EntriesGrid.test.tsx

## Что делает файл

Тестирует контракт списка карточек `EntriesGrid`.
Покрывает empty-state, порядок элементов, public read-only режим и проброс private callbacks редактирования/удаления.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./EntriesGrid`
5. `contracts/collection.contracts.ts`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяется контракт `EntriesGrid` как общего списка карточек.

## Нетривиальная логика

1. Empty-state показывается при пустом массиве.
2. Карточки рендерятся в порядке исходного массива.
3. `showActions={false}` убирает private action-кнопки.
4. `onEditEntry` пробрасывается в карточки.
5. `onDeleteEntry` пробрасывается в карточки.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Защищает `src/components/Entries/EntriesGrid.tsx` от регрессий.
