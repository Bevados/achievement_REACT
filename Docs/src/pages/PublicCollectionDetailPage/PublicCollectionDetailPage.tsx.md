# src/pages/PublicCollectionDetailPage/PublicCollectionDetailPage.tsx

## Что делает файл

Страница показывает одну публичную example-коллекцию, общий блок фильтров `entries`, read-only список карточек и пагинацию.

## Импорты и зависимости

1. `react` (`useCallback`, `useEffect`, `useState`) — локальное состояние загрузки самой коллекции.
2. `react-router-dom` — `Link` и `useParams`.
3. `src/api/collections.api.ts` — `getPublicCollectionById`, `getPublicCollectionEntries`.
4. `src/components/Entries/EntriesFilters.tsx` — общий UI server-driven фильтров.
5. `src/components/Entries/EntriesGrid.tsx` — список карточек.
6. `src/components/Entries/EntriesPagination.tsx` — пагинация отфильтрованного списка.
7. `src/config/collections.config.ts` — подписи категорий.
8. `src/hooks/useEntriesListController.ts` — общая логика фильтров, пагинации и URL-синхронизации.

## Экспорты и контракты

1. Экспортируется `PublicCollectionDetailPage`.
2. Рендерит состояния `loading`, `error`, `empty`, `success`.
3. Не показывает private action-кнопки для карточек.

## Нетривиальная логика

1. `reloadPage` отвечает только за саму коллекцию; карточки и фильтры загружаются через `useEntriesListController`.
2. Тот же controller, что и в private detail, используется с публичным fetcher `getPublicCollectionEntries`, поэтому UX фильтрации совпадает.
3. Для public detail `EntriesGrid` вызывается с `showActions={false}`.
4. Кнопка `Повторить загрузку` в error-сценарии повторно запрашивает и саму коллекцию, и список карточек.
5. Back-link возвращает пользователя на `/examples`.

## Где используется

1. `src/App.tsx` — guest route `/examples/:collectionId`.
