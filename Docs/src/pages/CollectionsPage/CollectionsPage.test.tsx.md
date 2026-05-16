# src/pages/CollectionsPage/CollectionsPage.test.tsx

## Что делает файл

Проверяет private list-flow коллекций уже через `QueryClientProvider`.

## Импорты и зависимости

1. `@testing-library/react` и `user-event` — page-level interactions.
2. `@tanstack/react-query` — `QueryClientProvider`.
3. `react-router-dom` — `MemoryRouter`.
4. `src/api/collections.api.ts` — мокируемый API-слой.
5. `src/lib/query-client.ts` — фабрика тестового `QueryClient`.

## Экспорты и контракты

1. Файл не экспортирует runtime-код.
2. Проверяет:
   - открытие create/edit UI;
   - submit create/update;
   - delete со списка;
   - отображение submit-ошибки.

## Нетривиальная логика

1. Мокает только API-слой страницы и даёт каждой проверке свой `QueryClient`.
2. Проверяет create/edit/delete сценарии со списка коллекций и invalidate-driven перезагрузку списка.

## Где используется

1. `npm.cmd run test`
