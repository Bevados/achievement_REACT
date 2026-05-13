# src/components/Entries/EntryCard.test.tsx

## Что делает файл

Тестирует UI-контракт отдельной карточки `EntryCard`.
Покрывает обязательные поля, optional-поля, компактное состояние, public read-only режим и private callbacks редактирования/удаления.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `@testing-library/user-event`
4. `./EntryCard`
5. `contracts/collection.contracts.ts`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяются UI-инварианты `EntryCard` в private/public режимах.

## Нетривиальная логика

1. Обязательные поля всегда рендерятся.
2. Optional image/meta/tags появляются только при наличии данных.
3. Минимальная карточка остаётся компактной.
4. `showActions={false}` скрывает private action-кнопки.
5. `onEdit(entry)` вызывается по клику на `Редактировать`.
6. `onDelete(entry)` вызывается по клику на `Удалить`.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Защищает `src/components/Entries/EntryCard.tsx` от регрессий.
