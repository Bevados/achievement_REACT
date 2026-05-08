# src/hooks/useEntriesListController.test.tsx

## Что делает файл

Файл тестирует общий controller списка карточек `entries`.
Покрывает начальную загрузку, применение фильтров и их сброс.

## Импорты и зависимости

1. `vitest` — тестовый раннер и mocks.
2. `@testing-library/react` — рендер тестового host-компонента.
3. `react-router-dom` — `MemoryRouter` и тестовый route для проверки `URLSearchParams`.
4. `./useEntriesListController` — тестируемый hook.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяются:
   - начальная загрузка карточек с дефолтными параметрами;
   - применение фильтров с reset `page` на `1`;
   - очистка фильтров через reset.

## Нетривиальная логика

1. Хук тестируется внутри `MemoryRouter`, потому что его ключевая ответственность — двусторонняя синхронизация фильтров с `URLSearchParams`.
2. Проверка `applyFilters` важна отдельно: controller хранит input-state и applied-state раздельно, поэтому тест сначала меняет поля, а затем отдельным действием применяет фильтры.

## Где используется

1. Запускается в `npm run test`.
2. Защищает от регрессий `src/hooks/useEntriesListController.ts`.
