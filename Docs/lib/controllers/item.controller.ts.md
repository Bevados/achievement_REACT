# lib/controllers/item.controller.ts

## Что делает файл

Это HTTP-контроллеры для сущности `items`.
Файл принимает `req/res`, валидирует входные данные через Zod, вызывает сервисный слой и формирует HTTP-ответы.
Именно здесь находится граница между транспортным слоем (HTTP) и бизнес-логикой (service).

## Импорты и зависимости

1. `@vercel/node` (`VercelResponse`) - типизация ответов serverless API.
2. `zod` (`ZodError`) - распознавание ошибок валидации и возврат структурированного сообщения.
3. `../services/item.service` - бизнес-операции получения/создания/обновления/удаления item.
4. `../types/request.types` (`AuthenticatedRequest`) - request с `userId` из auth middleware.
5. `../validation/item.schema` - схемы валидации тела запроса и id.
6. `./controller-error` - единый mapping ошибок в формат API ответа.
7. `../http/api-response` - утилиты единого envelope-ответа (`{ ok, data/error }`).

## Экспорты и контракты

1. Экспортируемые handlers:
 `getItems(req, res)` - возвращает список item пользователя.
 `createItem(req, res)` - валидирует body, создает item.
 `updateItem(req, res)` - валидирует body и `query.id`, обновляет item.
 `deleteItem(req, res)` - валидирует `query.id`, удаляет item.
2. Внутренние helper-функции:
 `getIdFromQuery` - нормализует `id` из query (`string | string[]`) и валидирует формат.
 `handleControllerError` - единая обработка ошибок (валидация/внутренние ошибки).
3. Инварианты:
 `req.userId` должен быть установлен middleware `verifyAuth` до вызова контроллера.
 Для операций update/delete id обязателен и должен соответствовать формату Mongo ObjectId.
 Все ответы отдаются в едином формате `{ ok: true, data }` или `{ ok: false, error }`.

## Нетривиальная логика

1. Ошибка Zod перехватывается централизованно и возвращается как `422 VALIDATION_ERROR` с массивом `details`.
2. `query.id` может прийти массивом (`string[]`) из-за особенностей query-парсинга; helper берет первый элемент и валидирует.
3. DELETE теперь возвращает `200` и `data: null` для единообразного контракта.
4. Контроллеры intentionally тонкие: не создают сущности вручную (кроме parse), а передают данные в сервис.

## Где используется

1. Прямое использование в `api/items/index.ts`:
2. `GET -> getItems`
3. `POST -> createItem`
4. `PATCH -> updateItem`
5. `DELETE -> deleteItem`
6. Косвенно используется клиентом через цепочку вызова endpoint `/api/items` из `src/api/items.api.ts`.
