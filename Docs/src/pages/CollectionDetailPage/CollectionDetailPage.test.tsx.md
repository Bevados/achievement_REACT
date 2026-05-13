# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Тестирует private detail-страницу коллекции.
Покрывает `loading/error/empty/success`, retry полной загрузки и modal-flow после перевода форм на `react-hook-form + zod`.

## Импорты и зависимости

1. `vitest` — раннер и моки API.
2. `@testing-library/react` — рендер, assertions, `waitFor`.
3. `@testing-library/user-event` — взаимодействие с фильтрами и modal-entrypoints.
4. `react-router-dom` (`MemoryRouter`, `Routes`, `Route`) — isolated route `/collections/:collectionId`.
5. `./CollectionDetailPage`
6. `../../api/collections.api` — замоканные `getCollectionById` и `getCollectionEntries`.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые инварианты:
   - page корректно показывает `loading/error/empty/success`;
   - retry заново грузит и коллекцию, и entries;
   - private action-кнопки активны в success-сценарии;
   - modal коллекции и карточки открываются корректно;
   - edit-модалки получают initial values;
   - save-кнопки в формах теперь активны как часть RHF/Zod-потока.

## Нетривиальная логика

1. Тесты проходят пользовательский сценарий на уровне страницы и тем самым подтверждают, что modal state, callbacks и новые формы корректно состыкованы.
2. Отдельная проверка retry защищает уже исправленный сценарий полной перезагрузки detail-экрана.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`.
