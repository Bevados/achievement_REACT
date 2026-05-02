# src/pages/CollectionsPage/CollectionsPage.tsx

## Что делает файл

Файл реализует private-страницу `Мои коллекции`.
Страница загружает реальные данные из приватного API (`/api/collections`) и использует тот же общий контроллер списка, что и публичная страница examples.
Фильтры и пагинация также рендерятся через общие UI-компоненты.

## Импорты и зависимости

1. `src/api/collections.api.ts` (`getOwnerCollections`) - защищенный источник приватных данных.
2. `src/hooks/useCollectionsListController.ts` - общий контроллер списка коллекций.
3. `src/components/Collections/CollectionsFilters.tsx` - общий UI-блок фильтров.
4. `src/components/Collections/CollectionsGrid.tsx` - общий UI-блок сетки карточек.
5. `src/components/Collections/CollectionsPagination.tsx` - общий UI-блок пагинации.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionsPage`.
2. Компонент не принимает пропсы.
3. Данные загружаются через `getOwnerCollections` и общий контроллер `useCollectionsListController`.
4. Локальная логика фильтрации/URL-sync в странице не дублируется; используется переиспользуемая реализация из хука.

## Нетривиальная логика

1. Страница использует приватный endpoint, поэтому запрос требует авторизации через токен (логика токена инкапсулирована в API-клиенте).
2. Поведение `loading/error/empty/success`, фильтры, пагинация и URL-sync полностью переиспользуются из общего контроллера и общих UI-компонентов.
3. Отличие от публичной страницы осталось только в источнике данных и текстах контента.

## Где используется

1. `src/App.tsx` - маршрут `/collections` для авторизованных пользователей.
