# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Тестирует private detail-страницу коллекции.
Покрывает состояния `loading/error/empty/success`, retry загрузки и новый modal-flow шага 5.4 для создания/редактирования коллекции и карточек.

## Импорты и зависимости

1. `vitest` — тестовый раннер и моки API.
2. `@testing-library/react` — рендер, DOM-assertions и `waitFor`.
3. `@testing-library/user-event` — клики по фильтрам и modal-entrypoint кнопкам.
4. `react-router-dom` (`MemoryRouter`, `Routes`, `Route`) — изолированное тестирование route `/collections/:collectionId`.
5. `./CollectionDetailPage` — тестируемая страница.
6. `../../api/collections.api` — замоканные методы `getCollectionById` и `getCollectionEntries`.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
   - page корректно показывает `loading/error/empty/success`;
   - кнопка retry повторяет загрузку и коллекции, и списка карточек;
   - private action-кнопки активны в success-сценарии;
   - `Редактировать коллекцию` открывает `CollectionForm`;
   - `Добавить карточку` открывает `EntryForm` в create-режиме;
   - `Редактировать` на карточке открывает `EntryForm` в edit-режиме с initial values;
   - save-кнопки в формах пока disabled.

## Нетривиальная логика

1. Тесты не мокают модалки отдельно: они проходят весь пользовательский сценарий на уровне страницы и тем самым подтверждают, что local modal state wired correctly.
2. Отдельная проверка retry защищает уже исправленную регрессию, где ранее перезагружалась только коллекция или только entries, но не весь экран целиком.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Защищает `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` от регрессий при дальнейшем подключении реального submit.
