# src/pages/ExamplesPage/ExamplesPage.smoke.test.tsx

## Что делает файл

Проверяет smoke-flow публичного списка examples: загрузку коллекций и корректный public href.

## Импорты и зависимости

1. `@tanstack/react-query` — `QueryClientProvider` для public Query flow.
2. `@testing-library/react` — рендер и assertions.
3. `react-router-dom` — `MemoryRouter` для public route `/examples`.
4. `src/api/collections.api.ts` — мок публичного списка коллекций.
5. `src/lib/query-client.ts` — отдельный `QueryClient` на тест.

## Экспорты и контракты

1. Файл не экспортирует production-код; он покрывает release-critical smoke списка examples.

## Нетривиальная логика

1. Success-case фиксирует, что ссылка на example detail остаётся в формате `id + slug`.

## Где используется

1. `npm.cmd run test:smoke`
