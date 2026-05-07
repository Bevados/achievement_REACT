# api/examples/collections/[collectionId]/entries/index.ts

## Что делает файл

Это публичный Vercel entrypoint для загрузки карточек конкретной example-коллекции.
Файл обслуживает `GET /api/examples/collections/:collectionId/entries` без авторизации.

## Импорты и зависимости

1. `@vercel/node` — типы request/response.
2. `lib/controllers/collection.controller` — controller для чтения публичных `entries`.
3. `lib/http/api-response` — helper для стандартного `405` и резервного `500`.

## Экспорты и контракты

1. Default export `handler(req, res)`.
2. Поддерживается только `GET`.
3. Успех: `{ ok: true, data: PaginatedResult<EntryView> }`.
4. Ошибки: `404`, `422`, `500`.

## Нетривиальная логика

1. Публичный route использует ту же query-схему `entries`, что и private detail-экран.
2. Авторизация не требуется, потому что данные берутся только из `system_examples`.

## Где используется

1. `src/api/collections.api.ts` — клиентский метод `getPublicCollectionEntries`.
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx` — read-only список карточек examples.
