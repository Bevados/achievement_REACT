# src/components/Collections/CollectionCard.test.tsx

## Что делает файл

Тестирует UI-контракт компонента `CollectionCard`.

## Импорты и зависимости

1. `vitest` — сценарии и проверки.
2. `@testing-library/react` — рендер и поиск элементов.
3. `@testing-library/user-event` — проверка пользовательских действий.
4. `react-router-dom` (`MemoryRouter`) — тестирование ссылок карточки.
5. `contracts/collection.contracts.ts` — тип `CollectionView`.
6. `./CollectionCard` — тестируемый компонент.

## Экспорты и контракты

1. Файл ничего не экспортирует.
2. Покрывает контракт карточки:
   - читаемый `href` в формате `id + slug`;
   - показ `createdAt` и `updatedAt`;
   - fallback для optional-полей;
   - inline-actions `onEdit` и `onDelete`.

## Что проверяется

1. Базовый рендер полей коллекции.
2. Показ `createdAt` и `updatedAt`.
3. Переход по читаемому `href` в формате `id + slug`.
4. Fallback для optional-полей.
5. Отображение `customCategory`.
6. Вызов inline-callback'ов `onEdit` и `onDelete`.

## Нетривиальная логика

1. Тесты валидируют, что карточка использует slug-friendly URL, а не старый путь только с `id`.
2. Inline-кнопки действий проверяются отдельно от клика по всей карточке, чтобы не смешивать основной navigation flow и CRUD-entrypoints списка.

## Где используется

1. Запускается через `npm.cmd run test`.
