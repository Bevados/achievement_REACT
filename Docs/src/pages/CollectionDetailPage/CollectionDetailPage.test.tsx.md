# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Проверяет private detail-страницу коллекции после перевода на TanStack Query.

## Импорты и зависимости

1. `@testing-library/react` и `user-event` — page-level interactions.
2. `@tanstack/react-query` — `QueryClientProvider` для тестового runtime.
3. `react-router-dom` — `MemoryRouter` и private detail route.
4. `src/api/collections.api.ts` — мокируемый HTTP-слой.
5. `src/lib/query-client.ts` — фабрика тестового `QueryClient`.

## Экспорты и контракты

1. Файл не экспортирует runtime-код.
2. Проверяет:
   - загрузку detail и entries;
   - create/update/delete collection и entry;
   - error/empty/success ветки страницы.

## Нетривиальная логика

1. Мокает detail-загрузку, entries и CRUD-вызовы.
2. Проверяет, что invalidate после private-мутаций приводит к повторным загрузкам detail/entries вместо ручного reload.

## Где используется

1. `npm.cmd run test`
