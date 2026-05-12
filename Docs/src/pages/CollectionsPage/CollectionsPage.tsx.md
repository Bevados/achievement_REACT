# src/pages/CollectionsPage/CollectionsPage.tsx

## Что делает файл

Файл реализует private-страницу списка коллекций пользователя.
Страница загружает приватные коллекции через backend API, подключает общий controller списка коллекций, показывает фильтры, список карточек и пагинацию, а также содержит private CTA для открытия modal-формы создания коллекции.

## Импорты и зависимости

1. `react` (`useState`) — нужен для локального состояния create-модалки.
2. `src/components/Modal/BaseModal.tsx` — переиспользуемая modal-обвязка.
3. `src/components/Collections/CollectionForm.tsx` — UI-форма создания коллекции.
4. `src/api/collections.api.ts` — даёт приватный client `getOwnerCollections`.
5. `src/components/Collections/CollectionsGrid.tsx` — общий список карточек коллекций.
6. `src/components/Collections/CollectionsFilters.tsx` — общий блок фильтров.
7. `src/components/Collections/CollectionsPagination.tsx` — общая пагинация.
8. `src/hooks/useCollectionsListController.ts` — общий controller списка коллекций.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionsPage`.
2. Компонент не принимает пропсы.
3. Локально хранит только `isCreateModalOpen`.

## Нетривиальная логика

1. Главная бизнес-логика списка живёт в `useCollectionsListController`, поэтому сама страница остаётся тонкой и отвечает только за композицию UI.
2. Retry-кнопка в error-state вручную вызывает `reloadCollections`.
3. `Создать коллекцию` — это первый private entrypoint для modal CRUD-UX шага 5.4; форма открывается локально и пока не отправляет данные в API.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections`.
