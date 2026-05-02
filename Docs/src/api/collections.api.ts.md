# src/api/collections.api.ts

## Что делает файл

Файл содержит API-клиент списка коллекций для двух режимов:
1. Публичные examples (`/api/examples/collections`).
2. Приватные коллекции текущего пользователя (`/api/collections`).

Он нормализует query-параметры, обрабатывает envelope ответа и возвращает данные в типизированном виде.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` - типы контракта API (`ApiResponse`, `CollectionView`, `PaginatedResult`, `CollectionListQueryDto`).
2. `src/firebase.ts` (`getIdToken`) - получение Bearer-токена для приватного запроса.
3. Нативный `fetch` - выполнение HTTP-запроса к backend endpoint.

## Экспорты и контракты

1. Экспортируется функция `getPublicCollections(query?)`.
2. Экспортируется функция `getOwnerCollections(query?)`.
3. Вход: optional query (`page`, `limit`, `sortBy`, `sortOrder`, `category`, `search`).
4. Выход: `Promise<PaginatedResult<CollectionView>>`.
5. В случае неуспеха обе функции выбрасывают `Error` с человекочитаемым сообщением.

## Нетривиальная логика

1. `toQueryString` отправляет только заполненные параметры, чтобы не засорять URL.
2. `requestCollections` - общий рантайм для public/private запросов (единая обработка envelope и ошибок).
3. Для `getOwnerCollections` обязателен ID-токен: если токен отсутствует, функция выбрасывает явную ошибку до сетевого запроса.
4. Ошибка запроса читает текст из backend-envelope (`ok=false, error.message`) и использует fallback, если payload невалидный.
5. Успешный ответ дополнительно проверяется на корректный envelope (`ok=true`), чтобы не пропустить неожиданный формат данных.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx` - загрузка публичных коллекций для гостевой страницы примеров.
2. `src/pages/CollectionsPage/CollectionsPage.tsx` - загрузка приватных коллекций текущего пользователя.
