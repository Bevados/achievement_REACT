# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.smoke.test.tsx

## Что делает файл

Проверяет smoke-flow публичной detail-страницы example-коллекции в read-only режиме.

## Импорты и зависимости

1. `@tanstack/react-query` — `QueryClientProvider` для public Query flow.
2. `@testing-library/react` — рендер и assertions.
3. `react-router-dom` — `MemoryRouter` и `Routes` для public detail route.
4. `src/api/collections.api.ts` — моки public detail и public entries API.
5. `src/lib/query-client.ts` — отдельный `QueryClient` на тест.

## Экспорты и контракты

1. Файл не экспортирует production-код; он покрывает release-critical smoke публичного detail.

## Нетривиальная логика

1. Smoke подтверждает не только загрузку detail, но и отсутствие private action-кнопок на public карточках.

## Где используется

1. `npm.cmd run test:smoke`
