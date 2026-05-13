# Plan: Achievement Collections MVP

Этот файл - рабочий план реализации.
Цель: идти по шагам, по одному за раз, с понятными объяснениями что и зачем делается.

## Как работаем

1. Делаем по одному шагу. Создаем подробную документацию для каждого файла (понятное и подробное объяснение о компоненте или файле, что делает каждый хук, каждая функция, как реализована функция, для чего каждая константа и тому подобное. Что импортируется в этот файл и для чего, где используются функции или хуки или компонент из файла, куда импортируется).
2. После каждого шага фиксируем результат, создаем или обновляем документацию.
3. Если по ходу меняется решение, обновляем этот файл, `CHAT_CONTEXT_PROMPT.md`, `AI_RULES.md`, документацию файла и документацию связанных с ним файлов.
4. Для сложных решений пишем короткое объяснение причины.

## Упрощенный план (верхний уровень)

0.5. Процесс документации и контроль актуальности Docs.

1. Данные и backend-основа.
2. Публичная часть UI.
3. Приватная часть UI.
4. CRUD коллекций и карточек (сначала карточки/list UI, затем формы).
5. Интеграция данных на клиенте.
6. Качество и релиз.

---

## Шаг 0.5. Документация и контроль актуальности (done)

### 0.5.1 Что делаем

1. Создаем папку Docs, которая повторяет структуру исходников из src, api и lib.
2. Для каждого исходного файла создаем файл документации с суффиксом .md.
3. Фиксируем единый шаблон обязательных разделов документа.
4. Добавляем автоматическую проверку docs:check.
5. Добавляем команду docs:scaffold для генерации недостающих doc-файлов.

### 0.5.2 Зачем

1. Чтобы объяснения были рядом по структуре и быстро находились.
2. Чтобы дисциплина обновления документации контролировалась автоматически.
3. Чтобы уменьшить шум комментариев в коде и хранить пояснения в Docs.

### 0.5.3 Правило обновления

1. Любое изменение файлов из src, api, lib требует обновления соответствующего файла в Docs.
2. Если docs не обновлены, docs:check возвращает ошибку и показывает список проблем.
3. В диалоге явно отмечаем, что документация обновлена.
4. Если изменилось текущее состояние проекта, принятые решения, локальная dev-схема, важные команды или текущий этап плана, нужно обновить `CHAT_CONTEXT_PROMPT.md`, чтобы новый чат мог продолжить работу без потери контекста.
5. Если изменились правила работы, критерии завершения задач или ограничения на изменения, нужно обновить `AI_RULES.md`, чтобы новый чат и текущая работа следовали одним и тем же правилам.

### 0.5.4 Ограничение подхода

1. Автоматическая проверка гарантирует факт обновления docs, но не может полностью гарантировать качество объяснения.
2. Качество текста контролируем через шаблон обязательных разделов и ревью.

### 0.5.5 Команды

1. npm run docs:scaffold
2. npm run docs:check

---

## Шаг 1. Данные и правила полей (утвержден)

### 1.1 Что делаем

1. Финализируем структуру Collection и Entry.
2. Определяем обязательные и необязательные поля.
3. Фиксируем ограничения значений (rating, status и т.д.).
4. Выбираем способ связи Collection -> Entry.
5. Определяем единый формат id и ошибок API.
6. Определяем минимальный набор индексов MongoDB.

### 1.2 Зачем

1. Чтобы UI, API и БД не расходились по ожиданиям.
2. Чтобы меньше переделывать формы и валидацию.
3. Чтобы данные пользователя были безопасно изолированы.

### 1.3 Финальная модель (MVP)

#### Collection

Обязательные поля при создании:

1. title - название коллекции.
2. category - категория (например, travel, sport, shopping).

Необязательные поля при создании:

1. description - описание коллекции.
2. coverImageUrl - обложка коллекции.

Обязательные поля для отображения:

1. title - название коллекции.
2. category - категория (например, travel, sport, shopping).
3. createdAt - дата создания.
4. updatedAt - дата последнего изменения.
5. entriesCount - количество карточек (вычисляемое/кэшируемое).

Необязательные поля для отображения:

1. description - описание коллекции.

Поля в базе данных, некоторые могут быть пустыми:

1. id - строковый id для клиента.
2. ownerId - uid пользователя из Firebase.
3. title - название коллекции.
4. description - описание коллекции.
5. coverImageUrl - обложка коллекции.
6. category - категория (например, travel, sport, shopping).
7. isPublic - доступна ли коллекция в публичных примерах.
8. createdAt - дата создания.
9. updatedAt - дата последнего изменения.
10. entriesCount - количество карточек (вычисляемое/кэшируемое).

#### Entry

Обязательные поля при создании:

1. title - название карточки.
2. status - planned | in_progress | completed.

Необязательные поля при создании:

1. description - краткое описание.
2. imageUrl - URL изображения карточки.
3. price - стоимость (если есть).
4. tags - массив тегов.
5. rating - оценка от 1 до 10 (обязательна для `completed`).
6. dateStart - дата события/начала периода (обязательна для `completed`).
7. dateEnd - конец периода, если пользователь выбрал диапазон.

Обязательные поля для отображения:

1. title - название карточки.
2. status - planned | in_progress | completed.
3. createdAt - дата создания карточки.

Необязательные поля для отображения:

1. description - краткое описание.
2. imageUrl - URL изображения карточки.
3. price - стоимость (если есть).
4. tags - массив тегов.
5. rating - оценка от 1 до 10.
6. dateStart - одна дата или начало периода.
7. dateEnd - конец периода, если карточка заполнена как диапазон.

Поля в базе данных, некоторые могут быть пустыми:

1. id - строковый id для клиента.
2. collectionId - id коллекции-владельца.
3. ownerId - uid пользователя (дублируем для безопасных фильтров).
4. title - название карточки.
5. imageUrl - URL изображения карточки.
6. rating - оценка от 1 до 10.
7. createdAt - дата создания.
8. updatedAt - дата изменения.
9. dateStart - дата события или начало периода.
10. dateEnd - конец периода (если задан).
11. price - стоимость (если есть).
12. description - краткое описание.
13. status - planned | in_progress | completed.
14. tags - массив тегов.

### 1.4 Важные решения

1. Связь Collection -> Entry: reference (отдельная коллекция entries).
2. Почему reference: записи потенциально неограниченно растут, не раздуваем документ collection.
3. id в API всегда строка (не ObjectId на клиенте).
4. Пустые необязательные поля в карточке не отображаем в UI.

### 1.5 Минимальные индексы MongoDB

1. collections: { ownerId: 1, updatedAt: -1 }
2. entries: { ownerId: 1, collectionId: 1, updatedAt: -1 }
3. collections: { isPublic: 1, updatedAt: -1 }

---

## Шаг 2. Backend и API (done)

### 2.1 Цель шага

1. Типы и DTO задают стабильный контракт API.
2. Zod защищает API от невалидных данных.
3. Repository упрощает работу с MongoDB и тестирование.
4. Service хранит бизнес-логику (например, каскадное удаление entries).
5. Controller унифицирует формат ответов и статусов.
6. Smoke-check подтверждает, что backend готов к фронту.

### 2.2 Подшаги реализации (по порядку)

1. 2.2.1 Типы и DTO для Collection/Entry на backend (done).
2. 2.2.2 Zod-схемы для create/update/query/params (done).
3. 2.2.3 Repositories для MongoDB (done).
4. 2.2.4 Services (бизнес-правила) (done).
5. 2.2.5 Controllers (HTTP-ответы и ошибки) (done).
6. 2.2.6 Endpoints wiring (private + public) (done).
7. 2.2.7 Индексы MongoDB (done).
8. 2.2.8 Ручной API smoke-check (done).

### 2.3 API-контракты MVP (спецификация всего шага 2) (done)

### 2.3.1 Общие правила контракта

1. Private endpoint-ы требуют заголовок `Authorization: Bearer <idToken>`.
2. Public endpoint не требует токен.
3. Path-параметры `collectionId` и `entryId` принимаются как 24-символьные hex-строки (ObjectId format).
4. Единый envelope успеха: `{ ok: true, data: ... }`.
5. Единый envelope ошибки: `{ ok: false, error: { code, message, details? } }`.
6. Для ошибок валидации используется HTTP 422, `code=VALIDATION_ERROR`, `details` = массив `{ path, message }`.
7. Для list endpoint-ов возвращается пагинация в `meta`: `{ page, limit, total, totalPages }`.

### 2.3.2 Маппинг ошибок

1. 401 `UNAUTHORIZED` - отсутствует/невалиден Bearer токен.
2. 403 `FORBIDDEN` - доступ к чужому существующему ресурсу запрещен.
3. 404 `NOT_FOUND` - ресурс не найден.
4. 422 `VALIDATION_ERROR` - невалидные params/query/body.
5. 500 `TRANSACTION_ERROR` - ошибка транзакционной операции.
6. 500 `INTERNAL_ERROR` - прочие необработанные серверные ошибки.

### 2.3.3 Private endpoint-ы

1. `GET /api/collections`.
   Auth: required.
   Query: `page`, `limit`, `sortBy`, `sortOrder`, `category`, `search`.
   Success: 200, `data = { items: CollectionView[], meta }`.
   Errors: 401, 422, 500.

2. `POST /api/collections`.
   Auth: required.
   Body: `title` и `category` обязательны; `description`, `coverImageUrl` опциональны.
   Success: 201, `data = CollectionView`.
   Errors: 401, 422, 500.

3. `GET /api/collections/:collectionId`.
   Auth: required.
   Params: `collectionId`.
   Success: 200, `data = CollectionView`.
   Errors: 401, 403, 404, 422, 500.

4. `PATCH /api/collections/:collectionId`.
   Auth: required.
   Params: `collectionId`.
   Body: любое подмножество полей коллекции, но минимум 1 поле.
   Success: 200, `data = CollectionView`.
   Errors: 401, 403, 404, 422, 500.

5. `DELETE /api/collections/:collectionId`.
   Auth: required.
   Params: `collectionId`.
   Success: 200, `data = null`.
   Errors: 401, 403, 404, 422, 500.

6. `GET /api/collections/:collectionId/entries`.
   Auth: required.
   Params: `collectionId`.
   Query: `page`, `limit`, `sortBy`, `sortOrder`, `status`, `tag`, `minRating`, `maxRating`.
   Success: 200, `data = { items: EntryView[], meta }`.
   Errors: 401, 403, 404, 422, 500.

7. `POST /api/collections/:collectionId/entries`.
   Auth: required.
   Params: `collectionId`.
   Body: `title` и `status` обязательны; `description`, `imageUrl`, `price`, `tags`, `rating`, `dateStart`, `dateEnd` опциональны, но для `completed` обязательны `rating` и `dateStart`.
   Success: 201, `data = EntryView`.
   Errors: 401, 403, 404, 422, 500.

8. `PATCH /api/collections/:collectionId/entries/:entryId`.
   Auth: required.
   Params: `collectionId`, `entryId`.
   Body: любое подмножество полей entry, но минимум 1 поле.
   Success: 200, `data = EntryView`.
   Errors: 401, 403, 404, 422, 500.

9. `DELETE /api/collections/:collectionId/entries/:entryId`.
   Auth: required.
   Params: `collectionId`, `entryId`.
   Success: 200, `data = null`.
   Errors: 401, 403, 404, 422, 500.

### 2.3.4 Public endpoint

1. `GET /api/examples/collections`.
   Auth: not required.
   Query: `page`, `limit`, `sortBy`, `sortOrder`, `category`, `search`.
   Success: 200, `data = { items: CollectionView[], meta }`.
   Errors: 422, 500.

### 2.3.5 Контрактные инварианты

1. `price` в API принимается как number в долларах (до 2 знаков), внутри БД хранится в центах.
2. `dateStart` и `dateEnd` в API принимаются как ISO datetime string с offset.
3. `tags` ограничены (до 10, длина тега до 20) и дедуплицируются.
4. `rating` ограничен диапазоном 1..10.
5. Для list query: `limit` в диапазоне 1..100, по умолчанию 10.
6. Для `minRating` и `maxRating` действует правило `minRating <= maxRating`.
7. В private API поле `isPublic` не принимается в DTO и schema.
8. `DELETE /api/collections/:collectionId` выполняет каскадное удаление entries транзакционно.
9. `entriesCount` поддерживается сервисом транзакционно при create/delete entry.
10. Публичные examples отдаются только из системного ownerId `system_examples`.

---

## Шаг 3. Публичная часть UI

1. Главная страница (для гостей).
2. Страница примеров публичных коллекций.
3. Состояния: loading, empty, error.
4. Базовая адаптивность для мобильных.

### 3.1 Гостевая главная и route guards (done)

1. В `src/App.tsx` добавлены маршруты `/, /examples, /collections` и redirect-guards.
2. Главная `/' и `/examples` доступны только неавторизованным пользователям.
3. Авторизованный пользователь при заходе на `/` перенаправляется на `/collections`.
4. Добавлена стартовая private-страница `/collections` как каркас раздела "Мои коллекции".
5. Hero CTA на главной ставит deferred-intent `create-collection` и открывает login modal.
6. Обычный вход из Header очищает intent и не запускает flow создания коллекции.

Зачем:

1. Сразу виден результат проекта без авторизации.
2. Появляется сценарий демонстрации на собеседовании.

## Шаг 4. Приватная часть UI (done)

1. PrivateRoute и защита приватных экранов.
2. Страница "Мои коллекции".
3. Навигация для авторизованного пользователя.

Зачем:

1. Корректный контроль доступа.
2. Подготовка основы для CRUD.

## Шаг 5. CRUD коллекций и карточек

1. Сначала карточки и list UI без форм (read-only каркас для Collection и Entry).
2. Адаптивные визуальные состояния карточек в зависимости от заполненности данных Entry.
3. Бизнес-правила completed-card: обязательный rating, обязательный выбор даты и новая модель dateStart/dateEnd.
4. Затем формы collection и entry.
5. Валидация форм через react-hook-form + zod.
6. Создание, редактирование, удаление.
7. Фильтры карточек по статусу, датам, цене и рейтингу.

Зачем:

1. Основная ценность продукта - управление коллекциями.
2. Пошаговый цикл "карточка -> форма -> API -> UI" без смешивания задач.

## Шаг 6. Интеграция данных на клиенте

1. TanStack Query для server-state.
2. Zustand только для auth/modal/theme.
3. Инвалидация кэша после мутаций.

Зачем:

1. Предсказуемая работа с данными.
2. Меньше ручного управления состоянием.

## Шаг 7. Качество и релиз

1. Smoke + ключевые unit/integration тесты.
2. Проверка lint/build/test.
3. Подготовка env и деплоя на Vercel.
4. Ручная проверка ключевых сценариев.

Зачем:

1. Стабильный MVP для портфолио.
2. Готовность к демонстрации на интервью.

---

## Критерии готовности шага 2 (чеклист)

1. Все private endpoints требуют валидный Bearer token.
2. Пользователь не может получить/изменить чужие данные.
3. Валидация возвращает 422 и понятные ошибки полей.
4. Формат ответа API единый на всех endpoints.
5. CRUD по коллекциям и entries работает вручную через запросы.

## Текущий статус

1. Шаг 0.5: done.
2. Шаг 1: done.
3. Шаг 2: done.
4. Шаг 3: done (3.1 + 3.2.1-3.2.6).
5. Шаг 4: done (4.1-4.3).
6. Шаг 5: planned.
7. Шаг 6: planned.
8. Шаг 7: planned.

## Прогресс шага 5.1

1. Подпункт 5.1 уточнен под текущее состояние проекта: общий list UI коллекций уже реализован на шагах 3.2.x и 4.x, поэтому фактическая задача 5.1 - страница одной коллекции, read-only список entries и базовый EntryCard.
2. Для 5.1 зафиксирован private-route `/collections/:collectionId` с переходом из списка коллекций по клику на CollectionCard.
3. В 5.1 входят визуальные action-заглушки для будущих CRUD-сценариев (`Добавить карточку`, `Редактировать`, `Удалить`), но без рабочих форм и мутаций.
4. Уточнено разделение public/private навигации: приватные коллекции открываются через `/collections/:collectionId`, а публичные examples должны получить отдельный route `/examples/:collectionId`.
5. `CollectionCard` должен поддерживать контекстную навигацию: на private-странице вести в private detail, на public examples вести в public detail.
6. Публичная detail-страница examples должна показывать саму example-коллекцию и ее entries в read-only режиме без приватных действий редактирования/удаления.

## Прогресс шага 5.2

1. Подпункт 5.2 уточнен: это не ручной выбор шаблона карточки, а адаптивный `EntryCard`, который сам меняет composition по реально заполненным данным `Entry`.
2. Картинка показывается только если у карточки есть `imageUrl`; отдельного пользовательского выбора вида карточки не вводится.
3. Optional-поля (`description`, `dateStart/dateEnd`, `price`, `rating`, `tags`) отображаются только при наличии данных, а карточка без них должна оставаться компактной и визуально аккуратной.
4. Различие public/private в рамках 5.2 сохраняется только через `showActions`: в public detail кнопки действий скрыты, в private detail остаются видимыми как заглушки будущего CRUD.
5. Цель шага 5.2 - чтобы минимально заполненные, частично заполненные и максимально заполненные карточки выглядели как разные естественные состояния одного и того же UI.

## Прогресс подпункта после 5.2

1. Для `completed`-карточек введено правило: `rating` и `dateStart` обязательны, чтобы завершенная карточка не выглядела пустой и имела минимально осмысленный набор данных.
2. Одно поле `date` заменено на новую модель `dateStart/dateEnd`: одна дата хранится как `dateStart`, период хранится как `dateStart + dateEnd`.
3. `EntryCard` всегда показывает `createdAt`, а дата события рендерится как одна дата или как период в зависимости от заполненности `dateEnd`.
4. Для PATCH-обновления completed-entry бизнес-правило проверяется не только схемой, но и service-layer после merge с текущими данными записи.

## Прогресс по сетке entries

1. Для списка `entries` выбран masonry-подход со строчным порядком, чтобы короткие карточки не растягивались до высоты самых высоких соседей.
2. Реализация строится поверх CSS Grid с мелкой базовой строкой (`grid-auto-rows`) и вычислением `grid-row-end: span N` по реальной DOM-высоте карточки.
3. На desktop список получает masonry feel, а на mobile/tablet сохраняет простую и устойчивую одну колонку без лишней сложности.
4. Для сохранения порядка массива не используется CSS columns; порядок чтения карточек остается слева направо по строкам.

## Прогресс по фильтрам entries

1. Для обеих detail-страниц (`private` и `public`) выбран общий server-driven набор фильтров карточек.
2. Фильтры включают: `status`, диапазон `createdAt`, диапазон `dateStart`, диапазон `price`, диапазон `rating`.
3. UI фильтров должен быть общим и переиспользуемым, а state/query-sync вынесен в отдельный controller hook по аналогии с коллекциями.

## Ближайшие восстановительные задачи после шага 5.1

1. [done 2026-05-07] Восстановлена локальная подгрузка `/api/examples/collections` в `npm run dev` через dev-only Vite middleware. Проверено через `GET /api/examples/collections?limit=2`: endpoint вернул `200 OK`, `total=18` и реальные `system_examples` из MongoDB.
2. [done 2026-05-07] Зафиксировано, что Vite middleware является только локальной поддержкой публичных examples и не заменяет полноценный backend runtime. Граница описана в `README.md` и `Docs/vite.config.ts.md`: `npm run dev` подходит для frontend + public examples, а private API и CRUD нужно проверять через `vercel dev`.
3. [done 2026-05-07] Вместо нестабильного `vercel dev` на Windows добавлен отдельный локальный backend dev server с командой `npm run dev:api`. Он обслуживает те же `/api/*` маршруты, использует те же `api/*` entrypoints и `lib/*` слои, а Vite проксирует в него все локальные `/api` запросы.
4. [done 2026-05-07] Локально проверены маршруты нового dev server: публичный `/api/examples/collections` отвечает `200`, а приватные `/api/collections`, `/api/collections/:collectionId` и `/api/collections/:collectionId/entries` проходят auth-gate и требуют реальный Firebase token.
5. [done 2026-05-07] Реализованы публичные маршруты и API для `/examples/:collectionId`, `/api/examples/collections/:collectionId` и `/api/examples/collections/:collectionId/entries`, чтобы пользователь мог открыть example-коллекцию, увидеть ее описание и read-only список карточек.

## Лог принятых решений

1. Для Entry: `rating` обязателен, если `status = completed`.
2. Для Entry: вместо одного `date` используется модель `dateStart/dateEnd`.
3. Для Entry: `dateStart` обязателен, если `status = completed`.
4. Для Entry: `status` обязательный.
5. Категории коллекций храним как slug enum: travel, sport, shopping, learning, health_body, creativity, hobby, career, family, home, self_development, other.
6. Цена: в API/DTO передаем в долларах (до 2 знаков после точки), в БД храним в центах (integer).

## Прогресс шага 5.4

1. Для private CRUD выбран modal UX без изменения auth `modal.store`: состояние форм коллекции и карточки хранится локально в страницах.
2. Добавлены отдельные UI-формы `CollectionForm` и `EntryForm`, но без API-submit, без `react-hook-form` и без Zod, потому что это осознанно следующий подпункт.
3. `CollectionForm` уже подключена как modal create/edit UI на `/collections` и `/collections/:collectionId`.
4. `EntryForm` уже подключена на `/collections/:collectionId` как modal create/edit UI, включая локальный переключатель даты `Одна дата / Период`.
5. Private `EntryCard` и `EntriesGrid` больше не просто показывают заглушку `Редактировать`: они умеют поднимать edit-модалку карточки через callback, но реальные мутации и удаление ещё не включены.

## Прогресс шага 5.5

1. `CollectionForm` и `EntryForm` переведены с локального `useState` на `react-hook-form`, чтобы следующий подпункт с CRUD-мутациями опирался уже на стабильный form-state и submit-flow.
2. Клиентская валидация подключена через Zod без новой внешней зависимости-резолвера: формы используют локальный adapter поверх shared schema и общих бизнес-правил.
3. Для `CollectionForm` дополнительно зафиксировано UX-правило: если выбрана категория `other`, поле `customCategory` обязательно на клиенте.
4. Для `EntryForm` форма теперь валидирует completed-правила (`rating` + `dateStart` обязательны) и проверяет диапазон `dateEnd >= dateStart`.
5. Submit-кнопки в формах больше не disabled по умолчанию: валидная форма вызывает локальный `onSubmit` с уже нормализованным payload, но без реальной записи в API на этом шаге.
6. Нормализация form-values вынесена в отдельный helper для private CRUD-форм: пустые строки очищаются, `price` превращается в number, `tags` — в массив, а `dateStart/dateEnd` — в ISO-строки.
7. `dateStart` и `dateEnd` в API/DTO передаем как ISO-строки.
8. Пагинация фиксируется в list DTO (page, limit, sortBy, sortOrder и фильтры).
9. Price на API принимается только как number (строковый формат, например "12.34", не принимаем).
10. Для list query: limit по умолчанию 10, допустимый диапазон 1..100.
11. Для tags: максимум 10 тегов, длина каждого до 20 символов.
12. Для EntryDocument поле collectionId храним как ObjectId-ссылку.
13. Поле `isPublic` удалено из private DTO и private Zod-схем коллекций.
14. Публичные examples выдаются из системного ownerId `system_examples` (константа backend), а не из пользовательских данных.
15. Для access-check в сервисе используем семантику: чужие данные -> 403, отсутствующие -> 404.
16. Поиск коллекций в backend делаем по `title + description`.
17. `entriesCount` поддерживается в service-оркестрации при create/delete entry.

## Прогресс шага 5.6.1

1. Первый реальный CRUD-подпункт после форм ограничен только коллекциями: create/update для `CollectionForm` подключены, а entry-мутации и delete остаются следующими отдельными шагами.
2. Клиентский API получил рабочие методы `createCollection` и `updateCollection` с тем же envelope-подходом, auth-token flow и fallback-ошибками, что и read-only методы списка и detail.
3. На `/collections` modal создания коллекции теперь реально вызывает `POST /api/collections`, закрывает форму после успеха и перезагружает private list через `reloadCollections()`.
4. На `/collections/:collectionId` modal редактирования коллекции теперь реально вызывает `PATCH /api/collections/:collectionId`, обновляет локальный detail-state и закрывает форму после успеха без полного page reload.
5. Для create/edit формы коллекции введён явный submit error UX: ошибка запроса показывается внутри `CollectionForm`, а не теряется на уровне страницы.
6. Тесты страницы списка, detail-страницы и самой `CollectionForm` расширены под реальный submit-flow коллекций, включая happy-path и error-path.
18. Мутации `createEntry`, `deleteEntry`, `deleteCollection` выполняются транзакционно с rollback при ошибке шага внутри операции.
19. Индексы MongoDB инициализируются lazy при первом подключении в runtime через `api/_mongodb.ts`.
20. Контрактный слой (DTO, enum, response envelope и контрактные Zod-схемы) вынесен в папку `contracts/` для совместного использования frontend/backend.
21. Главная страница `/` доступна только гостям; авторизованный пользователь перенаправляется на `/collections`.
22. Логин и регистрация на шаге 3.1 остаются модальными; отдельный route `/login` не используется.
23. URL-область коллекций отделена от auth-путей: используются `/collections` и последующие private-routes.
24. Deferred-intent `create-collection` устанавливается только из Hero CTA гостевой главной.

## Прогресс шага 2.1

1. Добавлен базовый типовой контракт Collection/Entry и DTO: `lib/types/collection.types.ts`.
2. Добавлена документация для нового файла: `Docs/lib/types/collection.types.ts.md`.

## Прогресс шага 2.2

1. Добавлены Zod-схемы Collection/Entry для body/query/params: `lib/validation/collection.schema.ts`.
2. Зафиксированы ограничения price, tags, pagination, rating и `dateStart/dateEnd` на уровне runtime-валидации.
3. Добавлена документация для нового schema-файла: `Docs/lib/validation/collection.schema.ts.md`.

## Прогресс шага 2.2.3

1. Реализован repository-слой для коллекций и карточек: `lib/repositories/collection.repository.ts`.
2. Добавлены list/filter/sort/pagination операции, raw lookup методы и helper изменения `entriesCount`.
3. Добавлена документация repository: `Docs/lib/repositories/collection.repository.ts.md`.

## Прогресс шага 2.2.4

1. Реализован service-слой Collection/Entry: `lib/services/collection.service.ts`.
2. Добавлены бизнес-правила конверсии `price/dateStart/dateEnd/tags`, access-check 403/404 и каскад delete.
3. Добавлены tests-first unit-тесты сервиса: `lib/services/collection.service.test.ts`.
4. Добавлены контрактные тесты schema для запрета `isPublic` в private API: `lib/validation/collection.schema.test.ts`.
5. Документация синхронизирована для новых/измененных файлов в `Docs/lib/...`.

## Прогресс шага 2.2.7

1. В `api/_mongodb.ts` добавлена lazy инициализация индексов при первом подключении.
2. В кеш подключения добавлен флаг `indexesInitialized` для предотвращения повторной инициализации на warm-start.
3. Создан минимальный набор индексов для `collections` и `entries` под текущие query-patterns.
4. Обновлена документация Mongo helper: `Docs/api/_mongodb.ts.md`.

## Прогресс шага 2.2.8

1. Выполнен manual API smoke-check в fallback-режиме через handler/controller harness: `smoke/step-2.2.8.api.smoke.test.ts`.
2. Подтверждены критерии шага 2: auth-gate private API, 422 валидация, единый response envelope, access-control mapping и CRUD-flow.
3. Сформирован отчет результата: `SMOKE_CHECK_RESULTS.md`.
4. Шаг 2 закрыт и готов к переходу на шаг 3 (публичная часть UI).

## Прогресс шага 2.3 (API-контракты MVP)

1. Раздел `2.3 API-контракты MVP` расширен до полноценной спецификации endpoint-ов, статусов и форматов ответа.
2. Зафиксированы общие правила контракта: envelope, auth, ObjectId format, структура `details` для 422.
3. Зафиксированы инварианты: price/dateStart/dateEnd/tags/rating/pagination, `minRating <= maxRating`, каскадный delete и `entriesCount`.
4. Спецификация 2.3 готова как source of truth для реализации UI шага 3.

## Дополнительный рефакторинг контрактного слоя

1. Создан общий контрактный слой: `contracts/collection.contracts.ts`.
2. Вынесены контрактные Zod-схемы в `contracts/collection.contracts.schema.ts`.
3. `lib/types/collection.types.ts` переведен в режим backend-only Document + re-export общего контракта.
4. `lib/validation/collection.schema.ts` переведен в compatibility re-export из `contracts/`.
5. Обновлены docs tooling-скрипты (`docs-check`, `docs-scaffold`) для поддержки папки `contracts`.

## Прогресс шага 3.1 (публичная главная + guards)

1. Реализован route-shell приложения в `src/App.tsx` с guest/private redirect-правилами.
2. Создана гостевая HomePage с Hero, блоком преимуществ и preview placeholders: `src/pages/HomePage.tsx`.
3. Создана каркасная private-страница коллекций: `src/pages/CollectionsPage.tsx`.
4. Создана публичная заготовка примеров: `src/pages/ExamplesPage.tsx`.
5. Добавлен store отложенного намерения после auth: `src/store/auth-intent.store.ts`.
6. Добавлены тесты для route/CTA/store: `src/App.test.tsx`, `src/pages/HomePage.test.tsx`, `src/store/auth-intent.store.test.ts`.

### Краткий changelog (коммит 310b756, 28.04.2026)

1. Внедрены route guards для гостевых и приватных маршрутов, включая redirect `auth / -> /collections`.
2. Добавлены страницы `HomePage`, `CollectionsPage`, `ExamplesPage` и базовая визуальная структура публичной главной.
3. Реализован deferred-intent flow для Hero CTA через `src/store/auth-intent.store.ts`.
4. Приведена secondary CTA-навигация к SPA-переходу на `/examples` (без полной перезагрузки страницы).
5. Добавлены и обновлены unit/integration тесты для App/HomePage/intent-store.
6. Документация синхронизирована с исходниками и успешно проходит `docs:check`.

## Прогресс шага 3.2.1 (общий UI для списков коллекций)

1. Созданы переиспользуемые компоненты списка и карточки коллекций: `src/components/Collections/CollectionsGrid.tsx`, `src/components/Collections/CollectionCard.tsx`.
2. Публичная страница примеров переведена на общий UI-компонент с демо-данными: `src/pages/ExamplesPage/ExamplesPage.tsx`.
3. Private-страница "Мои коллекции" переведена на тот же общий UI-компонент: `src/pages/CollectionsPage/CollectionsPage.tsx`.
4. Синхронизирована документация для новых и измененных файлов в `Docs/src/...`, включая перенос путей страниц в подпапки.
5. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 3.2.2 (подключение публичного API на examples)

1. Добавлен API-клиент публичных коллекций: `src/api/collections.api.ts`.
2. Страница `src/pages/ExamplesPage/ExamplesPage.tsx` переведена с демо-данных на реальный запрос к `/api/examples/collections`.
3. На странице реализованы состояния `loading`, `error` (с кнопкой retry), `empty`, `success`.
4. Добавлена/обновлена документация: `Docs/src/api/collections.api.ts.md`, `Docs/src/pages/ExamplesPage/ExamplesPage.tsx.md`.
5. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 3.2.3 (динамические параметры вместо хардкода)

1. Страница `src/pages/ExamplesPage/ExamplesPage.tsx` переведена на динамические query-параметры: `page`, `sortBy`, `sortOrder`.
2. Добавлены UI-контролы сортировки и порядка, изменение параметров запускает новый запрос к API.
3. Добавлена пагинация с кнопками `Назад/Вперед` и отображением `страница/всего/total`.
4. Обновлена документация страницы: `Docs/src/pages/ExamplesPage/ExamplesPage.tsx.md`.
5. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 3.2.4 (вынос UI-опций сортировки в config)

1. Опции `sortBy` и `sortOrder` вынесены из `src/pages/ExamplesPage/ExamplesPage.tsx` в `src/config/collections.config.ts`.
2. Страница примеров переведена на импорт опций из config, локальные дубли удалены.
3. Обновлена документация: `Docs/src/config/collections.config.ts.md`, `Docs/src/pages/ExamplesPage/ExamplesPage.tsx.md`.
4. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 3.2.5 (фильтры category + search на examples)

1. На `src/pages/ExamplesPage/ExamplesPage.tsx` добавлены UI-контролы фильтрации: select категории и форма поиска.
2. Вызов `getPublicCollections` теперь передает `category` и `search` вместе с `page/sortBy/sortOrder`.
3. Добавлены состояния `category`, `searchInput`, `search`; поиск применяется по submit, а кнопка `Сбросить` очищает фильтры и возвращает `page=1`.
4. Обновлена документация страницы: `Docs/src/pages/ExamplesPage/ExamplesPage.tsx.md`.
5. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 3.2.6 (синхронизация фильтров examples с URL)

1. На `src/pages/ExamplesPage/ExamplesPage.tsx` добавлен `useSearchParams` для двусторонней синхронизации состояния фильтров с query string.
2. Состояния `page/sortBy/sortOrder/category/search` теперь читаются из URL при первом рендере и при навигации back/forward.
3. При изменении фильтров URL автоматически обновляется (без хранения дефолтных значений в query).
4. Обновлена документация страницы: `Docs/src/pages/ExamplesPage/ExamplesPage.tsx.md`.
5. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 4.1 (интеграция private-страницы коллекций)

1. В `src/api/collections.api.ts` добавлен защищенный клиент `getOwnerCollections(query?)` для запроса `/api/collections` с Bearer-токеном.
2. `src/pages/CollectionsPage/CollectionsPage.tsx` переведена с мок-данных на реальную загрузку приватных коллекций.
3. На private-странице добавлены состояния `loading`, `error` (retry), `empty`, `success`.
4. Добавлены фильтры и пагинация (`page/sortBy/sortOrder/category/search`) и двусторонняя синхронизация query с URL.
5. Переиспользование общего UI сохранено: рендер коллекций выполняется через `CollectionsGrid`/`CollectionCard`.
6. Обновлена документация: `Docs/src/api/collections.api.ts.md`, `Docs/src/pages/CollectionsPage/CollectionsPage.tsx.md`.
7. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 4.2 (рефакторинг дублирования public/private списков)

1. Создан общий хук `src/hooks/useCollectionsListController.ts` с переиспользуемой логикой списка коллекций:
   - фильтры `sortBy/sortOrder/category/search`,
   - пагинация `page`,
   - состояния `loading/error/empty/success`,
   - URL-синхронизация query-параметров,
   - retry загрузки.
2. Созданы общие UI-компоненты:
   - `src/components/Collections/CollectionsFilters.tsx`,
   - `src/components/Collections/CollectionsPagination.tsx`.
3. `src/pages/ExamplesPage/ExamplesPage.tsx` переведена на общий хук и общие UI-компоненты.
4. `src/pages/CollectionsPage/CollectionsPage.tsx` переведена на общий хук и общие UI-компоненты.
5. Отличия public/private страниц сведены к источнику данных (`getPublicCollections`/`getOwnerCollections`) и текстам контента.
6. Обновлена документация:
   - `Docs/src/hooks/useCollectionsListController.ts.md`,
   - `Docs/src/components/Collections/CollectionsFilters.tsx.md`,
   - `Docs/src/components/Collections/CollectionsPagination.tsx.md`,
   - `Docs/src/pages/ExamplesPage/ExamplesPage.tsx.md`,
   - `Docs/src/pages/CollectionsPage/CollectionsPage.tsx.md`.
7. Проверки: `get_errors` без ошибок, `npm run docs:check` проходит успешно.

## Прогресс шага 4.3 (seed examples + обязательные UI-тесты)

1. Добавлен seed-скрипт `scripts/seed-system-examples.mjs` с заполнением MongoDB данными `system_examples`.
2. Seed создает:
   - 18 публичных коллекций (`ownerId=system_examples`, `isPublic=true`) для проверки пагинации списка,
   - карточки `entries` для всех коллекций,
   - все 64 комбинации optional-полей entry в отдельной коллекции покрытия,
   - актуальный `entriesCount` у каждой коллекции через bulk-обновление.
3. Добавлен npm-скрипт запуска: `seed:examples`.
4. Добавлены обязательные тесты:
   - `src/pages/ExamplesPage/ExamplesPage.test.tsx` (`loading/empty/error/success`),
   - `src/components/Collections/CollectionCard.test.tsx` (корректный рендер карточки + fallback optional-полей).
5. Добавлена документация тестов:
   - `Docs/src/pages/ExamplesPage/ExamplesPage.test.tsx.md`,
   - `Docs/src/components/Collections/CollectionCard.test.tsx.md`.
6. Добавлена документация seed-скрипта: `Docs/scripts/seed-system-examples.mjs.md`.
7. Проверки:
   - `get_errors` без ошибок,
   - `npm run docs:check` проходит,
   - новые тесты проходят,
   - `npm run seed:examples -- --dry-run` проходит без записи в БД.
## Прогресс по пользовательской категории коллекции

1. Для поддержки варианта `Своя категория` не меняем enum `category`, а расширяем модель минимально и совместимо: пользовательский текст хранится в `customCategory`, а базовая категория остаётся `other`.
2. `CollectionForm` показывает отдельное поле `Своя категория` только при выборе `other`.
3. Отображение категории в UI переведено на helper `getCollectionCategoryLabel`, чтобы карточки и detail-страницы автоматически показывали либо стандартный label, либо `customCategory`.

## Лог принятых решений

7. Пользовательская категория коллекции хранится как `category = 'other'` + `customCategory`, а не как свободная замена enum.
