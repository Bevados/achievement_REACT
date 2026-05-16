# src/App.tsx

## Что делает файл

Собирает корневую маршрутизацию приложения, общую шапку, auth-gate и общий `QueryClientProvider`.

## Импорты и зависимости

1. `react-router-dom` — маршруты и редиректы.
2. `src/components/Header/Header.tsx` и `src/components/Auth/AuthModal.tsx` — глобальный UI.
3. `src/pages/*` — страницы приложения.
4. `src/lib/query-client.ts` — singleton `QueryClient`.
5. auth/theme/modal stores — глобальные UI/auth состояния.

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

1. Detail-маршруты принимают optional slug, но загрузка данных всегда идёт по `collectionId`.
2. Гостевые и private-разделы разводятся через `Navigate`.
3. Весь frontend теперь обёрнут в `QueryClientProvider`, поэтому private server-state живёт через TanStack Query.

## Где используется

1. `src/main.tsx`
