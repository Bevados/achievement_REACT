# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.test.tsx

## Что делает файл

Тестирует состояния публичной detail-страницы example-коллекции.

## Импорты и зависимости

1. `vitest` — mocks и assertions.
2. `@testing-library/react` — рендер и ожидания.
3. `react-router-dom` — тестовый route `/examples/:collectionId`.
4. `src/api/collections.api.ts` — мок публичных detail-методов.

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Проверяет `loading`, `error + retry`, `empty`, `success`.
3. В успешных сценариях дополнительно фиксирует наличие общего UI-фильтрации карточек.

## Нетривиальная логика

1. В `success` отдельно проверяется, что на public detail отсутствуют private action-кнопки entry.
2. В empty/success сценариях тесты раскрывают фильтры по кнопке `Показать фильтры` и проверяют, что public detail использует тот же `EntriesFilters`, что и private detail.

## Где используется

1. `npm test` — покрытие `PublicCollectionDetailPage`.
