# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Файл реализует private detail-страницу одной коллекции.
Страница загружает саму коллекцию, подключает общий controller карточек, показывает read-only данные коллекции, блок фильтров `entries`, список карточек и action-заглушки для будущих CRUD-сценариев.

## Импорты и зависимости

1. `react` (`useCallback`, `useEffect`, `useState`) нужен для загрузки коллекции и локального async-state страницы.
2. `react-router-dom` (`Link`, `useParams`) дает обратную навигацию и чтение `collectionId` из URL.
3. `contracts/collection.contracts.ts` задает тип `CollectionView`.
4. `src/api/collections.api.ts` дает методы `getCollectionById` и `getCollectionEntries`.
5. `src/components/Entries/EntriesFilters.tsx` рендерит общий UI server-driven фильтров.
6. `src/components/Entries/EntriesGrid.tsx` рендерит список карточек коллекции.
7. `src/components/Entries/EntriesPagination.tsx` выводит пагинацию отфильтрованного списка.
8. `src/config/collections.config.ts` переводит категорию коллекции в локализованную подпись.
9. `src/hooks/useEntriesListController.ts` инкапсулирует фильтры, пагинацию, URL-синхронизацию и загрузку карточек.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionDetailPage`.
2. Компонент не принимает пропсы.
3. Ожидает наличие route-param `collectionId`.
4. Рендерит базовые состояния:
   - `loading` для коллекции;
   - `error` для коллекции;
   - `loading/error/success/empty` для списка карточек через общий controller.

## Нетривиальная логика

1. `reloadPage` отвечает только за загрузку самой коллекции; список карточек живет в `useEntriesListController`.
2. `useEntriesListController` синхронизирует `status`, диапазоны дат, цены и рейтинга с URL, поэтому фильтры переживают refresh и back/forward navigation.
3. `EntriesFilters` управляет input-state фильтров, а фактическая загрузка карточек происходит после `onApply`.
4. Кнопка `Повторить загрузку` в error-сценарии перезапрашивает и саму коллекцию, и список карточек, чтобы detail-screen восстанавливался целиком.
5. Action-кнопки `Добавить карточку`, `Редактировать коллекцию`, `Удалить коллекцию` намеренно disabled: это каркас будущего CRUD-flow.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections/:collectionId`.
2. Пользователь попадает сюда из `CollectionCard` по клику на карточку коллекции.
