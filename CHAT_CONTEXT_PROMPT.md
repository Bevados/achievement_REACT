# Контекст Для Нового Чата

Этот файл хранит только актуальный контекст проекта.

Его нужно обновлять, если изменились:
- текущее состояние проекта;
- принятые решения;
- текущий этап плана;
- маршруты, API или dev-схема;
- важные команды;
- известные runtime-ограничения.

Правила работы и процесс выполнения задач вынесены в `AI_RULES.md`.

Ниже готовый prompt, который можно целиком вставить в новый чат вместе с содержимым `AI_RULES.md`.

```text
Работаем на русском языке.

Ты работаешь с проектом `achievement_collections_REACT` в workspace:
`F:\Portfolio\achievement_collections_REACT`

Ниже актуальный контекст проекта. Правила работы бери из `AI_RULES.md`. Считай оба файла (`CHAT_CONTEXT_PROMPT.md` и `AI_RULES.md`) стартовой рабочей базой.

---

# 1. Суть проекта

Это учебный fullstack-проект `Achievement Collections MVP`.

Идея:
- есть коллекции;
- внутри коллекций есть карточки (`entries`);
- есть публичная часть с example-коллекциями;
- есть приватная часть пользователя;
- базовый private CRUD для коллекций и карточек уже работает.

Следующий крупный этап — шаг 7 с качеством, финальными проверками и подготовкой к деплою.

---

# 2. Архитектура

Основные слои:
- `src/` — frontend на React + TypeScript
- `api/` — backend entrypoints для Vercel
- `lib/` — controllers / services / repositories / middleware / utils
- `contracts/` — общие контракты и схемы
- `Docs/` — зеркальная документация по коду
- `scripts/` — служебные скрипты, seed, docs, локальный backend-runner

Backend flow:
`api/* -> lib/controllers -> lib/services -> lib/repositories -> MongoDB`

Auth:
- frontend использует Firebase client SDK;
- backend использует Firebase Admin;
- приватные API требуют `Authorization: Bearer <Firebase ID Token>`.

---

# 3. Стек

Frontend:
- React 19
- TypeScript
- Vite
- React Router
- Zustand
- React Hook Form
- Zod
- Tailwind CSS

Data layer:
- TanStack Query уже подключён для private и public server-state

Backend:
- Vercel-style API routes
- MongoDB
- Firebase Admin

Testing:
- Vitest
- Testing Library
- отдельный smoke-script `test:smoke`

---

# 4. Что уже сделано

- починен `/profile`
- починен ESLint-конфиг и typed linting
- добавлен локальный backend-runner `npm run dev:api`
- public examples работают через:
  - `/examples`
  - `/examples/:collectionId/:collectionSlug?`
  - `/api/examples/collections`
  - `/api/examples/collections/:collectionId`
  - `/api/examples/collections/:collectionId/entries`
- шаг 5 по private CRUD фактически закрыт:
  - detail collection page
  - adaptive `EntryCard`
  - filters/pagination для entries
  - modal-формы `CollectionForm` и `EntryForm`
  - `react-hook-form + zod`
  - create/update/delete collection
  - create/update/delete entry
- `CollectionCard` поддерживает контекстную навигацию для public/private
- в private-списке коллекций есть inline-действия `Редактировать` и `Удалить`
- detail URL коллекций используют формат `id + slug`
- query-sync в list/detail controller-хуках больше не использует `replace`, чтобы back/forward работали естественнее
- на карточке коллекции и на detail-страницах показываются дата создания и дата обновления
- private/public detail-страницы имеют верхнюю и нижнюю ссылки возврата к спискам
- фильтры карточек раскрываются плавно
- public examples уже переведены на TanStack Query и используют отдельные public query hooks
- для шага 7.1 добавлен отдельный frontend smoke-layer и script `test:smoke`
- после финального repo-аудита закрыты найденные medium-risk точки:
  - `category='other'` теперь обязательно требует `customCategory` и на backend;
  - legacy `/api/items` и старый `item.*` stack удалены;
  - backend auth/controller/runtime ошибки выровнены под русский UX;
  - Firebase Admin получил fail-fast проверку обязательных server env;
  - `README.md` очищен от шаблонного Vite boilerplate
  - добавлен GitHub Actions workflow `Release Check` для автоматического прогона `release:check`;
  - `App` использует route-level lazy loading, чтобы уменьшить главный frontend bundle
  - исторический fallback API smoke-harness тоже синхронизирован с текущей русской error-policy

---

# 5. Текущее состояние плана

Источник истины по этапам проекта — `Plan.md`.

Текущее состояние:
- ранние шаги плана уже выполнены;
- шаг 5 по CRUD фактически закрыт;
- шаг 6 завершён:
  - 6.1 private server-state переведён на TanStack Query;
  - 6.2 public examples переведены на TanStack Query;
- шаг 7 начат;
- шаг 7 закрыт:
  - `7.1` frontend smoke-layer готов;
  - `7.2` единый `release:check` готов;
  - `7.3` Vercel deploy и MongoDB production connectivity доведены до рабочего состояния.

Что уже сделано в шаге 6:
- добавлен `QueryClientProvider` на уровне приложения;
- private server-state переведён на TanStack Query для:
  - `/collections`
  - `/collections/:collectionId/:collectionSlug?`
- public server-state переведён на TanStack Query для:
  - `/examples`
  - `/examples/:collectionId/:collectionSlug?`
- вынесены отдельные private query/mutation hooks:
  - `useCollectionsQuery`
  - `useCollectionDetailQuery`
  - `useCollectionEntriesQuery`
  - `useCreateCollectionMutation`
  - `useUpdateCollectionMutation`
  - `useDeleteCollectionMutation`
  - `useCreateEntryMutation`
  - `useUpdateEntryMutation`
  - `useDeleteEntryMutation`
- для public examples добавлены read-only query hooks:
  - `usePublicCollectionsQuery`
  - `usePublicCollectionDetailQuery`
  - `usePublicCollectionEntriesQuery`
- `useCollectionsListController` и `useEntriesListController` разделены на:
  - URL-state hooks
  - legacy manual-fetch controller layer для экранов, которые ещё не на Query
- public и private query keys разделены

Что уже сделано в шаге 7.1:
- добавлен script `test:smoke`
- собран короткий smoke-suite для критических пользовательских сценариев
- release-gate сейчас формализован через:
  - `npm.cmd run release:check`
- внутри `release:check` последовательно запускаются:
  - `npm.cmd run test:smoke`
  - `npm.cmd run test`
  - `npx.cmd tsc -b`
  - `npm.cmd run build`
  - `npm.cmd run lint`
  - `npm.cmd run docs:check`

---

# 6. Маршруты и API

Public pages:
- `/`
- `/examples`
- `/examples/:collectionId/:collectionSlug?`

Private pages:
- `/collections`
- `/collections/:collectionId/:collectionSlug?`
- `/profile`

Public API:
- `/api/examples/collections`
- `/api/examples/collections/:collectionId`
- `/api/examples/collections/:collectionId/entries`

Private API:
- `/api/collections`
- `/api/collections/:collectionId`
- `/api/collections/:collectionId/entries`

Разделение:
- public examples — read-only;
- private collections — рабочий CRUD-поток;
- server-state для обоих потоков уже переведён на TanStack Query.

---

# 7. Локальная dev-схема

Текущая схема локального запуска:
- `npm.cmd run dev` — frontend
- `npm.cmd run dev:api` — локальный backend на `http://127.0.0.1:3000`

Важно:
- Vite проксирует `/api/*` в локальный backend;
- `api/*` остаются production entrypoints для Vercel;
- локальный backend нужен потому, что `vercel dev` на этой машине ненадёжен.

---

# 8. Важные команды

- `npm.cmd run dev`
- `npm.cmd run dev:api`
- `npm.cmd run release:check`
- `npm.cmd run test:smoke`
- `npm.cmd run test`
- `npx.cmd tsc -b`
- `npm.cmd run lint`
- `npm.cmd run docs:scaffold`
- `npm.cmd run docs:check`
- `npm.cmd run seed:examples`

---

# 9. Принятые решения

- `Plan.md` — главный источник истины по этапам.
- Если задача уже есть в `Plan.md`, не подавай её как новую проблему.
- Локальная разработка идёт в split-режиме: frontend отдельно, backend отдельно.
- `api/*` нельзя ломать, потому что это production entrypoints для Vercel.
- Public examples и private collections — разные контексты.
- Для `completed` entry обязательны `rating` и `dateStart`.
- Вместо одного `date` используется модель `dateStart/dateEnd`.
- Server-state для обоих потоков уже переведён на TanStack Query; `Zustand` остаётся для локального client/UI state (`auth`, `auth-intent`, `modal`, `theme`).
- Smoke-suite — это отдельный короткий release-layer поверх детальных unit/integration тестов, а не их замена.
- В проекте больше нет legacy API `/api/items`; актуальная backend-поверхность ограничена `collections` и `examples`.

---

# 10. Known Runtime Constraints

## Update 2026-05-20 — шаг 7.3 завершён

- Локальный `npm.cmd run release:check` остаётся зелёным.
- Для Vercel deploy зафиксированы:
  - server-side `.js` imports для backend ESM build;
  - `vercel.json` rewrites для `/examples`, `/collections`, `/profile`;
  - `package.json -> engines.node = 22.x`;
  - стабилизация `src/App.test.tsx` и `src/App.smoke.test.tsx` под lazy routing.
- После открытия `MongoDB Atlas Network Access` и возврата точного SRV `MONGODB_URI` deployed public API перестал отдавать `500`.
- Production домен:
  - `https://achievement-collections-react.vercel.app`
- Production проверено:
  - `GET /api/examples/collections` -> `200 OK`
  - `/examples` -> `200 OK`
- Основной deploy-блок плана закрыт; оставшаяся ручная проверка — это уже финальный QA, а не infrastructure blocker.

- Windows environment
- PowerShell execution policy limitations
- prefer `npm.cmd` commands
- `vercel dev` unreliable locally
- avoid solutions depending on WSL unless explicitly requested
- если CLI-проверка проходит, а VS Code показывает старую ошибку, сначала проверить, не editor cache ли это
- если backend не стартует, частая причина — занят порт `3000`
```
