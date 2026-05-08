# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Файл тестирует detail-страницу private-коллекции.
Покрывает состояния `loading`, `error`, `empty` и `success`, а также retry-поведение после ошибки загрузки.

## Импорты и зависимости

1. `vitest` используется как тестовый раннер и система моков.
2. `@testing-library/react` и `@testing-library/user-event` нужны для рендера и пользовательского retry-клика.
3. `react-router-dom` (`MemoryRouter`, `Routes`, `Route`) задает router-контекст с параметром `collectionId`.
4. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` — тестируемая страница.
5. `src/api/collections.api.ts` мокается, чтобы изолировать страницу от реального backend.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
   - страница показывает loading skeleton во время ожидания;
   - при ошибке выводит alert и позволяет повторить загрузку;
   - при пустом списке `entries` выводит empty-state;
   - при успешной загрузке показывает общий блок фильтров карточек;
   - при успешной загрузке показывает заголовок коллекции, карточки и disabled action-кнопки.

## Нетривиальная логика

1. `renderPage()` поднимает минимальный router с путем `/collections/:collectionId`, чтобы `useParams` работал так же, как в реальном приложении.
2. Retry-тест проверяет повторный вызов обеих API-функций, потому что detail-screen должен заново запросить и саму коллекцию, и список карточек через controller.
3. Тесты на empty/success дополнительно раскрывают панель по кнопке `Показать фильтры` и проверяют наличие полей `Статус` и `Сортировка`, чтобы зафиксировать новый collapsible UX.
4. Loading-сценарий моделируется незавершающимися Promise, чтобы зафиксировать поведение страницы до получения ответа.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает от регрессий `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`.
