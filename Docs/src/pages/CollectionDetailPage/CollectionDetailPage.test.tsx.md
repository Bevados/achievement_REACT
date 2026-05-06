# src/pages/CollectionDetailPage/CollectionDetailPage.test.tsx

## Что делает файл

Файл тестирует detail-страницу коллекции.
Покрывает состояния `loading`, `error`, `empty` и `success`, а также retry-поведение после ошибки загрузки.

## Импорты и зависимости

1. `vitest` используется как тестовый раннер и система моков.
2. `@testing-library/react` и `@testing-library/user-event` нужны для рендера и пользовательского retry-клика.
3. `react-router-dom` (`MemoryRouter`, `Routes`, `Route`) задает router-контекст с параметром `collectionId`.
4. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` - тестируемая страница.
5. `src/api/collections.api.ts` мокается, чтобы изолировать страницу от реального backend.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
2.1. страница показывает loading skeleton во время ожидания;
2.2. при ошибке выводит alert и позволяет повторить загрузку;
2.3. при пустом списке `entries` выводит empty-state;
2.4. при успешной загрузке показывает заголовок коллекции, карточки и disabled action-кнопки.

## Нетривиальная логика

1. `renderPage()` поднимает минимальный router с путем `/collections/:collectionId`, чтобы `useParams` работал так же, как в реальном приложении.
2. Retry-тест проверяет повторный вызов обеих API-функций, потому что страница перезагружает и саму коллекцию, и список ее `entries`.
3. Loading-сценарий моделируется незавершающимися Promise, чтобы зафиксировать поведение страницы до получения ответа.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает от регрессий `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`.
