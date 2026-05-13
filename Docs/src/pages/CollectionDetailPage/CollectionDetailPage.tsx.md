# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Private detail-страница одной коллекции.
Страница загружает саму коллекцию, подключает общий controller списка карточек, показывает фильтры, серверный список `entries` и private modal-entrypoints для CRUD.

## Импорты и зависимости

1. `react`
2. `react-router-dom` — `Link`, `useNavigate`, `useParams`
3. `contracts/collection.contracts.ts`
4. `src/api/collections.api.ts`
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
2. Компонент не принимает props.
3. Ожидает route-param `collectionId`.

## Нетривиальная логика

1. Edit коллекции вызывает `PATCH /api/collections/:collectionId` и обновляет локальный `collection` state без полного reload.
2. Create/edit карточки вызывают `POST/PATCH /api/collections/:collectionId/entries`, затем перезагружают server-driven список карточек.
3. Create карточки дополнительно локально увеличивает `entriesCount`.
4. Delete коллекции теперь работает через confirm-flow и после успеха переводит пользователя обратно на `/collections`.
5. Delete карточки теперь работает через confirm-flow, перезагружает список карточек и локально уменьшает `entriesCount`.
6. Ошибки create/update и ошибки delete хранятся раздельно, чтобы modal submit UX не смешивался с page-level alert-блоками.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections/:collectionId`.
