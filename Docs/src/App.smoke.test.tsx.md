# src/App.smoke.test.tsx

## Что делает файл

Проверяет smoke-слой routing policy и auth gate на уровне `App`.

## Импорты и зависимости

1. `@testing-library/react` — рендер и проверки маршрутов.
2. `react-router-dom` — `MemoryRouter` для тестовых переходов.
3. `vitest` — моки store-слоя и assertions.
4. `src/App.tsx` — корневой routing приложения.

## Экспорты и контракты

1. Файл не экспортирует production-код; он фиксирует критические routing smoke-сценарии.

## Нетривиальная логика

1. Реальные store-хуки auth/modal/theme/auth-intent замоканы, чтобы smoke тестировал только routing policy.
2. Detail-страницы замоканы простыми заголовками, чтобы test не зависел от внутренностей страниц.
3. Из-за lazy route loading проверки выполняются через `findByRole`, чтобы дождаться загрузки маршрута после `Suspense`.

## Где используется

1. `npm.cmd run test:smoke`
