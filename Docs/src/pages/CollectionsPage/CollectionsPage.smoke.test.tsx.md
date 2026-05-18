# src/pages/CollectionsPage/CollectionsPage.smoke.test.tsx

## Что делает файл

Проверяет короткий smoke-flow private списка коллекций: загрузка, создание, редактирование и удаление коллекции.

## Импорты и зависимости

1. `@tanstack/react-query` — `QueryClientProvider` для private Query flow.
2. `@testing-library/react` и `userEvent` — взаимодействие со страницей и модалками.
3. `src/api/collections.api.ts` — моки private collection CRUD.
4. `src/lib/query-client.ts` — отдельный `QueryClient` на тест.
5. `src/pages/CollectionsPage/CollectionsPage.tsx` — целевая страница smoke-проверки.

## Экспорты и контракты

1. Файл не экспортирует production-код; он покрывает release-critical happy-path списка коллекций.

## Нетривиальная логика

1. Smoke не дублирует все error-cases детального test-файла и берёт только ключевые CRUD happy-path сценарии.
2. Для inline-действий на карточке используется текущий DOM-контейнер `.group`, чтобы smoke шёл через реальный UI страницы.

## Где используется

1. `npm.cmd run test:smoke`
