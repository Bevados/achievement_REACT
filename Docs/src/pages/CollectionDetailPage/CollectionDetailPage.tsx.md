# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Рендерит private detail-страницу одной коллекции со списком карточек и private CRUD entrypoints.

## Импорты и зависимости

1. `react`
2. `react-router-dom`
3. `src/api/collections.api.ts`
4. `CollectionForm`, `EntryForm`
5. `EntriesFilters`, `EntriesGrid`, `EntriesPagination`
6. `BaseModal`
7. `useEntriesListController`

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionDetailPage`.
2. Страница ожидает route-param `collectionId`, при этом маршрут может включать optional slug.

## Нетривиальная логика

1. Страница поддерживает create/update/delete для коллекции и карточек.
2. `entriesCount` локально синхронизируется после create/delete карточек.
3. Ошибки submit и delete разделены на разные alert-слои.
4. На странице показываются и `createdAt`, и `updatedAt` коллекции.
5. Есть две точки возврата к списку коллекций: сверху и внизу после списка карточек, без дублирующей CTA-кнопки.
6. Empty-state карточек зависит от `hasActiveFilters`: без фильтров страница сообщает, что карточек ещё нет, а при активных фильтрах показывает сообщение про отсутствие совпадений.

## Где используется

1. `src/App.tsx`
