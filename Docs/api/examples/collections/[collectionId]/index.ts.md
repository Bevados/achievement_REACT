# api/examples/collections/[collectionId]/index.ts

## Что делает файл

Это публичный Vercel entrypoint для загрузки одной example-коллекции по `collectionId`.
Файл обслуживает `GET /api/examples/collections/:collectionId` без авторизации.

## Импорты и зависимости

1. `@vercel/node` — типы request/response.
2. `lib/controllers/collection.controller` — controller с логикой чтения публичной коллекции.
3. `lib/http/api-response` — helper для стандартного `405` и резервного `500`.

## Экспорты и контракты

1. Default export `handler(req, res)`.
2. Поддерживается только `GET`.
3. Успех: `{ ok: true, data: CollectionView }`.
4. Ошибки: `404`, `422`, `500`.

## Нетривиальная логика

1. Entry-point не содержит бизнес-логики и просто делегирует чтение controller-слою.
2. Route остается публичным и не использует `verifyAuth`.

## Где используется

1. `src/api/collections.api.ts` — клиентский метод `getPublicCollectionById`.
2. `src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx` — страница публичной detail-view.
