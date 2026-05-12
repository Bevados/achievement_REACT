# src/pages/CollectionsPage/CollectionsPage.test.tsx

## Что делает файл

Тест проверяет private entrypoint шага 5.4 на странице списка коллекций: кнопка `Создать коллекцию` должна открывать modal с `CollectionForm`.

## Импорты и зависимости

1. `vitest` — тестовый раннер и mocking hook-а списка коллекций.
2. `@testing-library/react` — рендер страницы и поиск элементов.
3. `@testing-library/user-event` — клик по CTA создания коллекции.
4. `./CollectionsPage` — тестируемая страница.
5. `../../hooks/useCollectionsListController` — замокан, чтобы тест не зависел от загрузки API и сосредоточился на modal UX.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
   - create-CTA виден на private-странице;
   - клик открывает `BaseModal`;
   - внутри есть `CollectionForm`;
   - кнопка `Сохранить коллекцию` пока disabled.

## Нетривиальная логика

1. Хук списка коллекций мокается целиком, чтобы page-level тест был стабильным и проверял именно новый UI-слой, а не server-driven list logic из предыдущих подпунктов.

## Где используется

1. Запускается в `npm.cmd run test`.
2. Страхует `src/pages/CollectionsPage/CollectionsPage.tsx` от регрессии create-modal entrypoint-а.
