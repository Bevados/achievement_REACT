# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Файл реализует private detail-страницу одной коллекции.
Страница загружает саму коллекцию, подключает общий controller карточек, показывает данные коллекции, блок фильтров `entries`, список карточек и private modal-entrypoints. После шагов `5.6.1` и `5.6.2` здесь уже работают реальные create/update мутации и для коллекции, и для карточек.

## Импорты и зависимости

1. `react` (`useCallback`, `useEffect`, `useState`) — нужен для загрузки коллекции, локального async-state и modal-state форм.
2. `react-router-dom` (`Link`, `useParams`) — даёт навигацию и `collectionId` из URL.
3. `contracts/collection.contracts.ts` — типы `CollectionView`, `EntryView`, `CreateEntryDto`, `UpdateEntryDto`.
4. `src/api/collections.api.ts` — даёт `getCollectionById`, `getCollectionEntries`, `updateCollection`, `createEntry`, `updateEntry`.
5. `src/components/Collections/CollectionForm.tsx`
6. `src/components/Entries/EntryForm.tsx`
7. `src/components/Entries/EntriesFilters.tsx`
8. `src/components/Entries/EntriesGrid.tsx`
9. `src/components/Entries/EntriesPagination.tsx`
10. `src/components/Modal/BaseModal.tsx`
11. `src/config/collections.config.ts`
12. `src/hooks/useEntriesListController.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionDetailPage`.
2. Компонент не принимает пропсы.
3. Ожидает наличие route-param `collectionId`.

## Нетривиальная логика

1. Категория коллекции отображается через `getCollectionCategoryLabel`.
2. Edit-модалка коллекции вызывает `PATCH /api/collections/:collectionId`, обновляет локальный `collection` state и закрывает форму без полного page reload.
3. Create-модалка карточки вызывает `POST /api/collections/:collectionId/entries`, после успеха закрывает форму, перезагружает server-driven список карточек и локально увеличивает `entriesCount`.
4. Edit-модалка карточки вызывает `PATCH /api/collections/:collectionId/entries/:entryId` и после успеха перезагружает текущий список карточек.
5. Submit-ошибки для коллекции и карточки хранятся локально на странице и пробрасываются в соответствующие формы.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections/:collectionId`.
