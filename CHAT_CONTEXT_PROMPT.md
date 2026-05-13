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

Ниже актуальный контекст проекта. Правила работы бери из файла `AI_RULES.md`. Считай оба файла (`CHAT_CONTEXT_PROMPT.md` и `AI_RULES.md`) стартовой рабочей базой.

---

# 1. Суть проекта

Это учебный fullstack-проект `Achievement Collections MVP`.

Идея:
- есть коллекции;
- внутри коллекций есть карточки (`entries`);
- есть публичная часть с example-коллекциями;
- есть приватная часть пользователя;
- проект должен дойти до полноценного CRUD для коллекций и карточек.

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

Backend:
- Vercel-style API routes
- MongoDB
- Firebase Admin
- Zod

Tooling:
- ESLint
- Vitest
- Testing Library

---

# 4. Текущее состояние

Уже сделано:
- исправлен route `/profile`, добавлена страница-заглушка;
- починен ESLint-конфиг и расширено покрытие линта;
- удалён legacy `items` probe из auth-flow;
- backend search экранирует regex-ввод;
- `Шаг 5.1` реализован:
  - private-route `/collections/:collectionId`
  - detail page коллекции
  - read-only список `entries`
  - базовый `EntryCard`
- `Шаг 5.2` трактуется как адаптивный `EntryCard`, который естественно меняется по заполненности данных, без ручных режимов карточки;
- после `5.2` для completed-entry введены более строгие правила:
  - `rating` обязателен;
  - `dateStart` обязателен;
  - вместо одного `date` используется модель `dateStart/dateEnd`;
- список `entries` на detail-страницах строится с masonry feel на desktop, но сохраняет строчный порядок карточек;
- detail-страницы коллекций используют общий server-driven фильтр карточек по статусу, датам, цене и рейтингу;
- локальная backend-разработка восстановлена через `npm run dev:api`;
- реализована публичная detail-страница examples:
  - `/examples/:collectionId`
  - `/api/examples/collections/:collectionId`
  - `/api/examples/collections/:collectionId/entries`
- `CollectionCard` поддерживает контекстную навигацию для public/private.

---

# 5. Текущее состояние плана

Источник истины по этапам проекта — `Plan.md`.

Важно:
- ранние шаги плана уже выполнены;
- `Шаг 5.1` уже реализован;
- восстановительные задачи после `5.1` закрыты;
- `Шаг 5.2` посвящён адаптивным состояниям `EntryCard` по реальным данным карточки.
- следующий подпункт после `5.2` вводит обязательный `rating` и обязательную дату для `completed`, а также новую модель дат `dateStart/dateEnd`.

Шаг 5:
1. read-only каркас Collection и Entry
2. адаптивные состояния карточек по заполненности данных
3. бизнес-правила completed-card и новая модель дат `dateStart/dateEnd`
4. формы collection и entry
5. валидация через react-hook-form + zod
6. создание, редактирование, удаление

---

# 6. Маршруты и API

Public pages:
- `/`
- `/examples`
- `/examples/:collectionId`

Private pages:
- `/collections`
- `/collections/:collectionId`
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
- private collections — база для будущего CRUD.

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
- После значимых изменений нужно проверять, не устарели ли `CHAT_CONTEXT_PROMPT.md` и `AI_RULES.md`.
- Для `completed` entry проект теперь требует `rating` и `dateStart`.

---

# 10. Known Runtime Constraints

- Windows environment
- PowerShell execution policy limitations
- prefer `npm.cmd` commands
- `vercel dev` unreliable locally
- avoid solutions depending on WSL unless explicitly requested
- если CLI-проверка проходит, а VS Code показывает старую ошибку, сначала проверить, не editor cache ли это
- если backend не стартует, частая причина — занят порт `3000`

---

# 11. Обновление По Шагу 5.4

- В private-зоне уже есть modal-формы `CollectionForm` и `EntryForm`.
- Формы теперь подключены через `react-hook-form` и Zod-валидацию, но всё ещё без реального API-submit.
- `CollectionsPage` открывает modal создания коллекции.
- `CollectionDetailPage` открывает:
  - modal редактирования коллекции;
  - modal создания карточки;
  - modal редактирования карточки из `EntryCard`.
- Состояние этих модалок хранится локально в страницах и не смешивается с auth `modal.store`.
- `CollectionForm` требует `customCategory`, если выбрана категория `other`.
- `EntryForm` валидирует правила completed-entry (`rating` и `dateStart` обязательны) и готовит нормализованный payload (`price`, `tags`, `dateStart/dateEnd`) для следующего CRUD-подпункта.
- Следующий логический подпункт после этого — реальные create/edit/delete мутации.
```
## Обновление по пользовательской категории коллекции

- Для коллекций поддержан вариант `Своя категория`.
- Это реализовано без отказа от enum `category`:
  - в данных сохраняется `category = 'other'`
  - пользовательский текст хранится в `customCategory`
- `CollectionForm` показывает отдельное поле `Своя категория` только при выборе `other`.
- Отображение категории в карточках и detail-страницах идёт через helper `getCollectionCategoryLabel`, поэтому UI показывает либо стандартный label, либо пользовательский текст.
