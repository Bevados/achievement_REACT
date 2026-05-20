# src/App.test.tsx

## Что делает файл

Проверяет ключевые маршруты и CTA-flow корневого приложения на уровне полноценного route integration test.

## Импорты и зависимости

1. `vitest` — mocks и assertions.
2. `@testing-library/react` и `user-event` — рендер и пользовательские действия.
3. `react-router-dom` — `MemoryRouter`.
4. `src/App.tsx` — тестируемый routing root.

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Проверяет redirect auth-user с `/`, deferred-intent CTA, profile route, private/public detail routing и header auth actions.

## Нетривиальная логика

1. Zustand store-слои мокируются через selector-pattern.
2. После перехода на lazy routes тест стабилизирован явными page mocks для `HomePage`, `CollectionsPage`, `ExamplesPage` и `ProfilePage`, чтобы assertions не зависели от реальной загрузки тяжёлых страниц.
3. Проверки используют `findByRole`, чтобы дождаться route-resolve после `Suspense`.

## Где используется

1. `npm.cmd run test`.
2. Regression-покрытие `src/App.tsx`.
