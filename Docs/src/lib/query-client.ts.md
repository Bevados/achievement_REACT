# src/lib/query-client.ts

## Что делает файл

Создаёт общий `QueryClient` приложения и держит базовую конфигурацию TanStack Query.

## Импорты и зависимости

1. `@tanstack/react-query` — `QueryClient`.

## Экспорты и контракты

1. `createAppQueryClient()` — фабрика нового `QueryClient` для runtime и тестов.
2. `appQueryClient` — singleton-клиент для корневого `QueryClientProvider`.

## Нетривиальная логика

1. Для запросов и мутаций отключён `retry`, чтобы UI и тесты не получали лишние скрытые ретраи.
2. Для запросов отключён `refetchOnWindowFocus`, чтобы private flow не перезагружался неожиданно при возврате на вкладку.

## Где используется

1. `src/App.tsx`
2. `src/pages/CollectionsPage/CollectionsPage.test.tsx`
3. `src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx`
