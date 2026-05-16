# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.test.tsx

## Что делает файл

Проверяет public detail-страницу example-коллекции после перевода на TanStack Query.

## Импорты и зависимости

1. `@tanstack/react-query` — `QueryClientProvider` для тестового server-state слоя.
2. `@testing-library/react` и `userEvent` — рендер, ожидания и retry-сценарии.
3. `react-router-dom` — `MemoryRouter`, `Routes` и route с `collectionSlug`.
4. `src/api/collections.api.ts` — моки публичных detail/entries API.
5. `src/lib/query-client.ts` — отдельный `QueryClient` на каждый тест.

## Экспорты и контракты

1. Файл не экспортирует production-код; он проверяет read-only public detail flow.

## Нетривиальная логика

1. Тесты отдельно покрывают пустую коллекцию без фильтров и пустой результат после фильтрации.
2. Retry-кейс фиксирует, что страница повторно запрашивает и detail коллекции, и entries query.
3. Success-case подтверждает, что public detail остаётся read-only и не показывает private action-кнопки.

## Где используется

1. `npm.cmd run test`
