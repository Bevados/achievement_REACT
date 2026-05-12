# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Файл реализует private detail-страницу одной коллекции.
Страница загружает саму коллекцию, подключает общий controller карточек, показывает read-only данные коллекции, блок фильтров `entries`, список карточек и modal-entrypoints для будущего private CRUD.

## Импорты и зависимости

1. `react` (`useCallback`, `useEffect`, `useState`) — нужен для загрузки коллекции, локального async-state и modal-state форм.
2. `react-router-dom` (`Link`, `useParams`) — даёт обратную навигацию и чтение `collectionId` из URL.
3. `contracts/collection.contracts.ts` — задаёт типы `CollectionView` и `EntryView`.
4. `src/api/collections.api.ts` — даёт методы `getCollectionById` и `getCollectionEntries`.
5. `src/components/Collections/CollectionForm.tsx` — UI-форма редактирования коллекции.
6. `src/components/Modal/BaseModal.tsx` — переиспользуемая modal-обвязка.
7. `src/components/Entries/EntryForm.tsx` — UI-форма создания/редактирования карточки.
8. `src/components/Entries/EntriesFilters.tsx` — рендерит общий UI server-driven фильтров.
9. `src/components/Entries/EntriesGrid.tsx` — рендерит список карточек коллекции.
10. `src/components/Entries/EntriesPagination.tsx` — выводит пагинацию отфильтрованного списка.
11. `src/config/collections.config.ts` — переводит категорию коллекции в локализованную подпись.
12. `src/hooks/useEntriesListController.ts` — инкапсулирует фильтры, пагинацию, URL-синхронизацию и загрузку карточек.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionDetailPage`.
2. Компонент не принимает пропсы.
3. Ожидает наличие route-param `collectionId`.
4. Рендерит базовые состояния:
   - `loading` для коллекции;
   - `error` для коллекции;
   - `loading/error/success/empty` для списка карточек через общий controller.

## Нетривиальная логика

1. `reloadPage` отвечает только за загрузку самой коллекции; список карточек живёт в `useEntriesListController`.
2. `useEntriesListController` синхронизирует `status`, диапазоны дат, цены и рейтинга с URL, поэтому фильтры переживают refresh и back/forward navigation.
3. `EntriesFilters` управляет input-state фильтров, а фактическая загрузка карточек происходит после `onApply`.
4. Кнопка `Повторить загрузку` в error-сценарии перезапрашивает и саму коллекцию, и список карточек, чтобы detail-screen восстанавливался целиком.
5. `isCollectionFormOpen` хранит локальное состояние modal-формы коллекции и не смешивается с auth modal store.
6. `entryFormState` хранит модалку карточки сразу для двух режимов: `create` и `edit`, а также текущий `EntryView` для prefill.
7. `EntriesGrid` получает `onEditEntry`, поэтому edit-модалка открывается из кнопки конкретной карточки, но page-state остаётся на уровне detail-страницы.
8. Кнопки `Добавить карточку` и `Редактировать коллекцию` уже открывают формы, а `Удалить коллекцию` пока остаётся disabled до следующего подпункта с мутациями.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections/:collectionId`.
2. Пользователь попадает сюда из `CollectionCard` по клику на карточку коллекции.
