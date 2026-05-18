# src/pages/CollectionDetailPage/CollectionDetailPage.smoke.test.tsx

## Что делает файл

Проверяет короткий smoke-flow private detail-страницы коллекции: загрузка detail, базовая работа фильтров и create/update/delete entry.

## Импорты и зависимости

1. `@tanstack/react-query` — `QueryClientProvider` для private Query flow.
2. `@testing-library/react` и `userEvent` — взаимодействие с detail-страницей и modal-form.
3. `react-router-dom` — `MemoryRouter` и `Routes` для private detail route.
4. `src/api/collections.api.ts` — моки detail/entries/entry CRUD.
5. `src/lib/query-client.ts` — отдельный `QueryClient` на тест.

## Экспорты и контракты

1. Файл не экспортирует production-код; он фиксирует release-critical happy-path для private detail.

## Нетривиальная логика

1. Smoke-слой берёт только happy-path и базовую проверку filters UI, не дублируя все error/empty cases большого integration-теста.
2. Для удаления entry используется реальный confirm-flow через замоканный `window.confirm`.

## Где используется

1. `npm.cmd run test:smoke`
