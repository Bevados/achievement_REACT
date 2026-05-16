# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.test.tsx

## Что делает файл

Проверяет public detail-страницу examples.

## Импорты и зависимости

1. `@testing-library/react` и `user-event` — page-level interactions.
2. `react-router-dom` — `MemoryRouter` и public detail route.
3. `src/api/collections.api.ts` — мокируемые public endpoints.

## Экспорты и контракты

1. Файл не экспортирует runtime-код.
2. Покрывает:
   - loading;
   - retry/error;
   - empty;
   - success ветки public detail.

## Нетривиальная логика

1. Покрывает loading, error, empty и success ветки.
2. Retry-ветка допускает несколько fetch-вызовов, потому что общий URL-state controller после рефактора может сделать дополнительные синхронизирующие перезапросы.

## Где используется

1. `npm.cmd run test`
