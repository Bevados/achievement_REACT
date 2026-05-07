# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx

## Что делает файл

Страница показывает одну публичную example-коллекцию и ее read-only список карточек.

## Импорты и зависимости

1. `react-router-dom` — `Link` и `useParams`.
2. `src/api/collections.api.ts` — `getPublicCollectionById`, `getPublicCollectionEntries`.
3. `EntriesGrid` — список карточек.
4. `src/config/collections.config.ts` — подписи категорий.

## Экспорты и контракты

1. Экспортируется `PublicCollectionDetailPage`.
2. Рендерит состояния `loading`, `error`, `empty`, `success`.
3. Не показывает private action-кнопки для entries.

## Нетривиальная логика

1. Страница параллельно грузит саму коллекцию и список ее `entries`.
2. Для public detail `EntriesGrid` вызывается с `showActions={false}`.
3. Back-link возвращает пользователя на `/examples`.

## Где используется

1. `src/App.tsx` — guest route `/examples/:collectionId`.
