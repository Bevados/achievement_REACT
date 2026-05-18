# src/App.tsx

## Что делает файл

Собирает корневую маршрутизацию приложения, общую шапку, auth-gate и общий `QueryClientProvider`.

## Импорты и зависимости

1. `react-router-dom` — маршруты и редиректы.
2. `React.lazy` и `Suspense` — route-level code splitting для страниц.
3. `src/components/Header/Header.tsx` и `src/components/Auth/AuthModal.tsx` — глобальный UI.
4. `src/pages/*` — страницы приложения, загружаемые лениво.
5. `src/lib/query-client.ts` — singleton `QueryClient`.
6. auth/theme/modal stores — глобальные UI/auth состояния.

## Экспорты и контракты

1. Default export `App`.
2. Основные маршруты:
   - `/`
   - `/examples`
   - `/examples/:collectionId/:collectionSlug?`
   - `/collections`
   - `/collections/:collectionId/:collectionSlug?`
   - `/profile`

## Нетривиальная логика

1. Страницы загружаются через `React.lazy`, поэтому главный frontend chunk не тащит все route-модули сразу.
2. `Suspense` использует тот же `AuthResolvingState`, что и auth-gate, поэтому code splitting не меняет пользовательский UX загрузки.
3. Detail-маршруты принимают optional slug, но загрузка данных всегда идёт по `collectionId`.
4. Весь frontend обёрнут в `QueryClientProvider`, поэтому private и public server-state живут через TanStack Query.

## Где используется

1. `src/main.tsx`
