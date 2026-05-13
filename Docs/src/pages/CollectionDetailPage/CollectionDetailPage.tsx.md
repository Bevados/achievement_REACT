# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Файл реализует private detail-страницу одной коллекции.
Страница загружает саму коллекцию, подключает общий controller карточек, показывает read-only данные коллекции, блок фильтров `entries`, список карточек и modal-entrypoints для будущего private CRUD.

## Импорты и зависимости

1. `react` (`useCallback`, `useEffect`, `useState`) — нужен для загрузки коллекции, локального async-state и modal-state форм.
2. `react-router-dom` (`Link`, `useParams`) — даёт обратную навигацию и чтение `collectionId` из URL.
3. `contracts/collection.contracts.ts` — задаёт типы `CollectionView` и `EntryView`.
4. `src/api/collections.api.ts` — даёт методы `getCollectionById` и `getCollectionEntries`.
5. `src/components/Collections/CollectionForm.tsx`
6. `src/components/Modal/BaseModal.tsx`
7. `src/components/Entries/EntryForm.tsx`
8. `src/components/Entries/EntriesFilters.tsx`
9. `src/components/Entries/EntriesGrid.tsx`
10. `src/components/Entries/EntriesPagination.tsx`
11. `src/config/collections.config.ts` — helper `getCollectionCategoryLabel`
12. `src/hooks/useEntriesListController.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionDetailPage`.
2. Компонент не принимает пропсы.
3. Ожидает наличие route-param `collectionId`.

## Нетривиальная логика

1. Категория коллекции отображается через `getCollectionCategoryLabel`, поэтому detail-страница умеет показывать пользовательскую категорию без отдельной локальной логики.
2. При открытии edit-модалки коллекции в `initialValues` формы пробрасывается и `customCategory`, если она есть.
3. Остальная логика страницы остаётся прежней: локальные модалки, общий controller карточек, retry полной загрузки и private edit/create entrypoints.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections/:collectionId`.
