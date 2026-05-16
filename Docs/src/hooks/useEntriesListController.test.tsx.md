# src/hooks/useEntriesListController.test.tsx

## Что делает файл

Проверяет базовую загрузку и применение фильтров для manual-fetch controller-хука карточек.

## Импорты и зависимости

1. `@testing-library/react` — `renderHook`, `act`, `waitFor`.
2. `react-router-dom` — `MemoryRouter` и test-route.
3. `vitest` — assertions и mocks.
4. `useEntriesListController.ts` — тестируемый хук.

## Экспорты и контракты

1. Файл не экспортирует runtime-код.
2. Покрывает:
   - начальную загрузку с default query state;
   - применение фильтров и сброс страницы на `1`.

## Нетривиальная логика

1. Тесты завязаны на `MemoryRouter` и private detail route с optional slug.
2. После reducer-sync допустимы дополнительные fetch-вызовы, поэтому проверки считают не точное число вызовов, а минимум.

## Где используется

1. `npm.cmd run test`
