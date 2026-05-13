# src/pages/CollectionsPage/CollectionsPage.tsx

## Что делает файл

Файл реализует private-страницу списка коллекций пользователя.
Страница загружает приватные коллекции через backend API, подключает общий controller списка коллекций, показывает фильтры, список карточек и пагинацию, а после шага `5.6.1` ещё и реально создаёт новую коллекцию через modal-форму.

## Импорты и зависимости

1. `react` (`useState`) — хранит состояние create-модалки и submit-ошибки.
2. `src/components/Modal/BaseModal.tsx` — переиспользуемая modal-обвязка.
3. `src/components/Collections/CollectionForm.tsx` — форма создания коллекции.
4. `src/api/collections.api.ts` — даёт `getOwnerCollections` и `createCollection`.
5. `src/components/Collections/CollectionsGrid.tsx`
6. `src/components/Collections/CollectionsFilters.tsx`
7. `src/components/Collections/CollectionsPagination.tsx`
8. `src/hooks/useCollectionsListController.ts`

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionsPage`.
2. Компонент не принимает пропсы.
3. Локально хранит `isCreateModalOpen` и `createSubmitError`.

## Нетривиальная логика

1. Основная логика списка живёт в `useCollectionsListController`, поэтому сама страница отвечает в основном за композицию UI.
2. `Создать коллекцию` открывает modal, отправляет валидный payload в `POST /api/collections`, закрывает форму после успеха и перезагружает список через `reloadCollections()`.
3. Ошибка create-запроса показывается прямо внутри `CollectionForm`, чтобы пользователь не терял контекст редактирования.
4. Retry-кнопка в error-state по-прежнему вручную вызывает `reloadCollections`.

## Где используется

1. `src/App.tsx` рендерит страницу на private-route `/collections`.
