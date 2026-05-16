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
- базовый private CRUD для коллекций и карточек уже работает;
- следующий крупный этап — перевод server-state на TanStack Query.

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
- TanStack Query уже подключён для private server-state

Backend:
- Vercel-style API routes
- MongoDB
- Firebase Admin

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
- реализован `Шаг 5` по private CRUD:
  - detail collection page
  - read-only и adaptive `EntryCard`
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

---

# 5. Текущее состояние плана

Источник истины по этапам проекта — `Plan.md`.

Текущее состояние:
- ранние шаги плана уже выполнены;
- `Шаг 5` по CRUD фактически закрыт;
- текущий активный этап — `Шаг 6.1`: перевод private server-state на TanStack Query.

Что уже сделано в `Шаге 6.1`:
- добавлен `QueryClientProvider` на уровне приложения;
- private server-state переведён на TanStack Query для:
  - `/collections`
  - `/collections/:collectionId/:collectionSlug?`
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
- private manual reload-сценарии заменяются на `invalidateQueries`
- `useCollectionsListController` и `useEntriesListController` разделены на:
  - URL-state hooks
  - legacy manual-fetch controller layer для экранов, которые ещё не на Query

Что ещё не сделано в `Шаге 6`:
- public examples пока сознательно не переведены на TanStack Query

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
- private collections — рабочий CRUD-поток и текущая зона миграции на TanStack Query.

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
- `npx.cmd tsc -b`
- `npm.cmd run lint`
- `npm.cmd run test`
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
- В `Шаге 6.1` private URL-state и private server-state разделены:
  - URL-state остаётся в controller hooks;
  - server-state и CRUD-инвалидация уходят в TanStack Query.

---

# 10. Known Runtime Constraints

- Windows environment
- PowerShell execution policy limitations
- prefer `npm.cmd` commands
- `vercel dev` unreliable locally
- avoid solutions depending on WSL unless explicitly requested
- если CLI-проверка проходит, а VS Code показывает старую ошибку, сначала проверить, не editor cache ли это
- если backend не стартует, частая причина — занят порт `3000`
```
