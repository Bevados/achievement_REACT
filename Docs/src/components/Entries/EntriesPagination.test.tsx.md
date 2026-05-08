# src/components/Entries/EntriesPagination.test.tsx

## Что делает файл

Файл тестирует UI-контракт пагинации списка карточек `entries`.

## Импорты и зависимости

1. `vitest` — тестовый раннер и assertions.
2. `@testing-library/react` — рендер компонента.
3. `@testing-library/user-event` — проверка кликов по кнопкам.
4. `./EntriesPagination` — тестируемый компонент.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяются:
   - корректный текст о текущей странице и общем числе карточек;
   - вызов `onPreviousPage`;
   - вызов `onNextPage`.

## Нетривиальная логика

1. Тесты фиксируют только внешний контракт пагинации, чтобы компонент можно было переиспользовать и в private, и в public detail без привязки к конкретному hook.

## Где используется

1. Запускается в `npm run test`.
2. Защищает от регрессий `src/components/Entries/EntriesPagination.tsx`.
