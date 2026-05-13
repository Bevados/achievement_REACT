# src/components/Collections/CollectionCard.test.tsx

## Что делает файл

Тестирует контракт отображения `CollectionCard`.
Покрывает основной рендер, fallback по optional-полям, ссылку на detail и отображение пользовательской категории.

## Импорты и зависимости

1. `vitest`
2. `@testing-library/react`
3. `react-router-dom` (`MemoryRouter`)
4. `./CollectionCard`
5. `contracts/collection.contracts.ts`

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - базовые поля коллекции рендерятся корректно
   - optional-поля имеют fallback
   - ссылка ведёт по переданному маршруту
   - custom category показывается вместо стандартного `Другое`

## Нетривиальная логика

1. Отдельный тест на `customCategory` защищает display-логику helper-а `getCollectionCategoryLabel`.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Защищает `src/components/Collections/CollectionCard.tsx`.
