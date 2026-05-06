# src/api/collections.api.ts

## Что делает файл

Файл содержит клиентский API-слой для работы с коллекциями и карточками на frontend.
Он покрывает три сценария: публичный список коллекций, приватный список коллекций владельца и read-only detail-данные одной коллекции вместе со списком ее `entries`.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` поставляет типы контрактов API: `CollectionView`, `EntryView`, `PaginatedResult`, query DTO и `ApiResponse`.
2. `src/firebase.ts` (`getIdToken`) нужен для получения Bearer-токена перед приватными запросами.
3. Нативный `fetch` выполняет HTTP-запросы к backend endpoint.

## Экспорты и контракты

1. Экспортируется `getPublicCollections(query?)`.
2. Экспортируется `getOwnerCollections(query?)`.
3. Экспортируется `getCollectionById(collectionId)`.
4. Экспортируется `getCollectionEntries(collectionId, query?)`.
5. `getPublicCollections` и `getOwnerCollections` возвращают `Promise<PaginatedResult<CollectionView>>`.
6. `getCollectionById` возвращает `Promise<CollectionView>`.
7. `getCollectionEntries` возвращает `Promise<PaginatedResult<EntryView>>`.
8. Все функции при ошибке выбрасывают `Error` с человекочитаемым сообщением.

## Нетривиальная логика

1. `requestApi` - общий runtime для всех GET-запросов этого модуля: он добавляет auth-header при необходимости, проверяет content-type, распаковывает envelope и унифицирует ошибки.
2. `toQueryString` отправляет только непустые параметры, чтобы не засорять URL значениями по умолчанию.
3. Для приватных методов отсутствие ID-токена обрывает выполнение до сетевого запроса с явной ошибкой.
4. Ответ `text/html` трактуется как признак того, что локальный backend не запущен, и пользователю отдается специальное диагностическое сообщение.
5. `getCollectionEntries` уже умеет принимать query для будущих фильтров/сортировки `entries`, хотя на шаге 5.1 detail-страница вызывает его без расширенных параметров.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx` - загрузка публичных коллекций.
2. `src/pages/CollectionsPage/CollectionsPage.tsx` - загрузка приватных коллекций текущего пользователя.
3. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` - загрузка одной коллекции и ее списка `entries`.
