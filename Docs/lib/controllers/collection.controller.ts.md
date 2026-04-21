# lib/controllers/collection.controller.ts

## Что делает файл

Это HTTP-контроллеры для коллекций и карточек (entries), включая публичный endpoint примеров.
Файл принимает req/res, валидирует params/query/body через Zod, вызывает service-слой и возвращает единый API-envelope.

## Импорты и зависимости

1. @vercel/node (VercelRequest, VercelResponse) - типы HTTP-запроса/ответа.
2. ../services/collection.service - бизнес-операции для collection/entry/public.
3. ../types/request.types (AuthenticatedRequest) - request с userId после auth middleware.
4. ../validation/collection.schema - схемы валидации params/query/body.
5. ./controller-error - единая обработка ошибок контроллера.
6. ../http/api-response - sendSuccess и helpers для query/params.

## Экспорты и контракты

1. getCollections(req, res): GET приватных коллекций владельца с пагинацией/фильтрами.
2. createCollection(req, res): POST создания коллекции владельца.
3. getCollection(req, res): GET одной коллекции по collectionId.
4. updateCollection(req, res): PATCH обновления коллекции по collectionId.
5. deleteCollection(req, res): DELETE коллекции по collectionId, ответ data: null.
6. getEntries(req, res): GET карточек внутри коллекции.
7. createEntry(req, res): POST создания карточки в коллекции.
8. updateEntry(req, res): PATCH карточки по collectionId + entryId.
9. deleteEntry(req, res): DELETE карточки по collectionId + entryId, ответ data: null.
10. getPublicCollections(req, res): GET публичных коллекций без авторизации.
11. Все handlers возвращают формат:
    Успех - { ok: true, data }
    Ошибка - { ok: false, error: { code, message, details? } }

## Нетривиальная логика

1. parseCollectionId и parseCollectionAndEntryIds централизуют валидацию path/query id и убирают дублирование.
2. normalizeQueryObject нужен из-за Vercel-формата query (string|string[]|undefined) перед передачей в Zod-схемы.
3. Каждый handler изолирует только transport-задачи; бизнес-проверки доступа и транзакции остаются в service-слое.
4. Ошибки каждого handler делегируются в handleControllerError для консистентных HTTP-кодов.

## Где используется

1. api/collections/index.ts.
2. api/collections/[collectionId]/index.ts.
3. api/collections/[collectionId]/entries/index.ts.
4. api/collections/[collectionId]/entries/[entryId]/index.ts.
5. api/examples/collections/index.ts.
