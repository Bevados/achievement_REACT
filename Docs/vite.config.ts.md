# vite.config.ts

## Что делает файл

Файл настраивает Vite, React, Tailwind CSS, Vitest и локальный proxy для backend API.
В режиме `npm run dev` все запросы к `/api/*` автоматически проксируются в отдельный локальный backend server, который запускается командой `npm run dev:api`.

## Импорты и зависимости

1. `vitest/config` (`defineConfig`) — общий helper для Vite и Vitest.
2. `@vitejs/plugin-react` — React plugin для Vite.
3. `@tailwindcss/vite` — Tailwind CSS plugin.
4. `path` — построение alias `@lib`.

## Экспорты и контракты

1. Default export `defineConfig(...)`:
   - подключает plugins `react` и `tailwindcss`;
   - задает alias `@lib -> lib`;
   - включает `server.proxy` для `/api`;
   - настраивает Vitest с `jsdom`, setup-файлом и CSS.
2. Proxy по умолчанию направляет запросы на `http://127.0.0.1:3000`.
3. При необходимости target можно переопределить через `LOCAL_API_ORIGIN`.

## Нетривиальная логика

1. Frontend больше не подмешивает server-side middleware прямо в Vite config.
2. Один и тот же `/api` путь теперь работает и для public examples, и для private API через отдельный backend runtime.
3. Такой proxy не ломает Vercel deploy, потому что production entrypoints остаются в `api/*`.

## Где используется

1. `npm run dev` — локальный frontend-режим.
2. `src/api/collections.api.ts` — клиент вызывает относительные `/api/...`, а Vite прозрачно проксирует их в backend.
