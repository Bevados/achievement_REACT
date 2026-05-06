# src/pages/CollectionDetailPage/CollectionDetailPage.tsx

## Что делает файл

Файл реализует private detail-страницу одной коллекции.
Страница загружает `CollectionView` и список `EntryView[]`, показывает read-only данные коллекции, список карточек и action-заглушки для будущих CRUD-сценариев.

## Импорты и зависимости

1. `react` (`useCallback`, `useEffect`, `useState`) нужен для локального async-state detail-страницы.
2. `react-router-dom` (`Link`, `useParams`) дает обратную навигацию и чтение `collectionId` из URL.
3. `contracts/collection.contracts.ts` задает типы `CollectionView`, `EntryView`, `PaginationMeta`.
4. `src/api/collections.api.ts` дает методы `getCollectionById` и `getCollectionEntries`.
5. `src/components/Entries/EntriesGrid.tsx` рендерит список карточек коллекции.
6. `src/config/collections.config.ts` переводит категорию коллекции в локализованную подпись.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionDetailPage`.
2. Компонент не принимает пропсы.
3. Ожидает наличие route-param `collectionId`.
4. Рендерит четыре базовых состояния:
4.1. `loading`;
4.2. `error`;
4.3. `success + empty entries`;
4.4. `success + entries`.

## Нетривиальная логика

1. `reloadPage` загружает коллекцию и список `entries` параллельно через `Promise.all`, чтобы не растягивать время ожидания.
2. Если route param отсутствует, страница формирует локальную ошибку без сетевого запроса.
3. При любой ошибке страница сбрасывает `collection`, `entries` и `entriesMeta`, чтобы не оставлять в UI устаревшие данные от предыдущего успешного состояния.
4. Action-кнопки `Добавить карточку`, `Редактировать коллекцию`, `Удалить коллекцию` на шаге 5.1 intentionally disabled: это каркас будущего CRUD-flow, а не рабочие мутации.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections/:collectionId`.
2. Пользователь попадает сюда из `CollectionCard` по клику на карточку коллекции.
