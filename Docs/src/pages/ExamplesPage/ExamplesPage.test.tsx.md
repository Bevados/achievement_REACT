# src/pages/ExamplesPage/ExamplesPage.test.tsx

## Что делает файл

Проверяет публичную страницу списка examples после перевода на TanStack Query.

## Импорты и зависимости

1. `@tanstack/react-query` — `QueryClientProvider` для тестового query-контекста.
2. `@testing-library/react` и `userEvent` — рендер, ожидания и retry-сценарии.
3. `react-router-dom` — `MemoryRouter` для public route `/examples`.
4. `src/api/collections.api.ts` — мок публичного API списка коллекций.
5. `src/lib/query-client.ts` — фабрика изолированного `QueryClient` на каждый тест.

## Экспорты и контракты

1. Файл не экспортирует production-код; он покрывает public Query flow через `ExamplesPage`.

## Нетривиальная логика

1. Каждый тест создаёт отдельный `QueryClient`, чтобы кэш React Query не протекал между кейсами.
2. Вместо controller-mock мокается реальный `getPublicCollections`, а страница проверяется через QueryClientProvider.
3. Success-case фиксирует, что readable href коллекции остаётся в формате `id + slug`.

## Где используется

1. `npm.cmd run test`
