# src/App.smoke.test.tsx

## Что делает файл

Проверяет краткий smoke-слой routing policy и auth gate на уровне `App`.

## Импорты и зависимости

1. `@testing-library/react` — рендер и route assertions.
2. `react-router-dom` — `MemoryRouter` для тестовых переходов.
3. `vitest` — mocks store-слоя и assertions.
4. `src/App.tsx` — корневой routing-модуль.

## Экспорты и контракты

1. Файл не экспортирует production-код.
2. Фиксирует четыре критических smoke-сценария: guest public flow, guest block на private detail, redirect auth-user в private flow и redirect auth-user с public detail.

## Нетривиальная логика

1. Реальные store-хуки auth/modal/theme/auth-intent замоканы, чтобы smoke проверял только routing policy.
2. Для стабильности lazy routing добавлены простые page mocks `HomePage`, `CollectionsPage`, `ExamplesPage` и `ProfilePage`, а detail-страницы замоканы отдельными заголовками.
3. Проверки идут через `findByRole`, чтобы smoke не зависел от тайминга `Suspense`.

## Где используется

1. `npm.cmd run test:smoke`.
