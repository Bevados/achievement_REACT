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

## Экспорты и контракты

1. Экспортируемые handlers:
2. `getItems(req, res)` - возвращает список item пользователя.
3. `createItem(req, res)` - валидирует body, создает item.
4. `updateItem(req, res)` - валидирует body и `query.id`, обновляет item.
5. `deleteItem(req, res)` - валидирует `query.id`, удаляет item.
6. Внутренние helper-функции:
7. `getIdFromQuery` - нормализует `id` из query (`string | string[]`) и валидирует формат.
8. `handleControllerError` - единая обработка ошибок (валидация/внутренние ошибки).
9. Инварианты:
10. `req.userId` должен быть установлен middleware `verifyAuth` до вызова контроллера.
11. Для операций update/delete id обязателен и должен соответствовать формату Mongo ObjectId.

## Нетривиальная логика

1. Ошибка Zod перехватывается централизованно и преобразуется в понятный JSON с массивом `details`.
2. Сейчас для Zod используется статус `400`.
3. В плане проекта целевой формат для валидации - `422`, поэтому при следующем этапе API-контракта это место нужно синхронизировать.
4. `query.id` может прийти массивом (`string[]`) из-за особенностей query-парсинга; helper берет первый элемент и валидирует.
5. Контроллеры intentionally тонкие: не создают сущности вручную (кроме parse), а передают данные в сервис.

## Где используется

1. Прямое использование в `api/items/index.ts`:
2. `GET -> getItems`
3. `POST -> createItem`
4. `PATCH -> updateItem`
5. `DELETE -> deleteItem`
6. Косвенно используется клиентом через цепочку вызова endpoint `/api/items` из `src/api/items.api.ts`.
