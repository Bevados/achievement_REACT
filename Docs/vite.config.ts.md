# vite.config.ts

## Что делает файл

Файл настраивает Vite, React, Tailwind CSS, Vitest и локальный dev-only API middleware для публичных examples.
В режиме `npm run dev` middleware обслуживает `GET /api/examples/collections`, чтобы страница примеров могла брать публичные коллекции из MongoDB без запуска `vercel dev`.

## Импорты и зависимости

1. `vitest/config` (`defineConfig`) - общий config helper для Vite и Vitest.
2. `@vitejs/plugin-react` - React plugin для Vite.
3. `@tailwindcss/vite` - Tailwind CSS plugin.
4. `path` - построение alias `@lib`.
5. `dotenv` - загрузка `.env.local` и `.env` для локального middleware.
6. `zod` (`ZodError`) - распознавание ошибок валидации query-параметров.
7. `contracts/collection.contracts.schema` - schema для query публичного списка коллекций.
8. `lib/services/collection.service` - server-side service, который читает публичные коллекции из MongoDB.

## Экспорты и контракты

1. Default export `defineConfig(...)`:
   - подключает plugins `react`, `tailwindcss`, `localExamplesApiPlugin`;
   - задает alias `@lib -> lib`;
   - настраивает Vitest с `jsdom`, setup-файлом и CSS.
2. `localExamplesApiPlugin()` - локальный Vite plugin, который добавляет middleware для `/api/examples/collections`.
3. `sendJson(res, statusCode, body)` - маленький helper для единообразного JSON-ответа middleware.

## Нетривиальная логика

1. Middleware существует только для локального frontend-режима `npm run dev`.
2. Источник данных не mock: запрос проходит через `getPublicCollections`, а значит использует MongoDB и системный owner `system_examples`.
3. Валидационные ошибки query возвращаются как `422 VALIDATION_ERROR`.
4. Остальные ошибки возвращаются как `500 INTERNAL_ERROR` с сообщением из caught error, чтобы локальная диагностика была понятнее.
5. Полноценный private API не реализуется в Vite middleware; приватные коллекции должны проверяться через `vercel dev`.

## Где используется

1. `npm run dev` - локальная разработка публичной страницы examples.
2. `src/api/collections.api.ts` - клиент вызывает `/api/examples/collections`, который в dev-режиме может обслуживаться этим middleware.
3. `src/pages/ExamplesPage/ExamplesPage.tsx` - показывает данные, пришедшие через этот endpoint.
