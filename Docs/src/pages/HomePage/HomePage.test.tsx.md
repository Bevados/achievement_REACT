# src/pages/HomePage/HomePage.test.tsx

## Что делает файл

Файл проверяет ключевое поведение гостевой главной: primary CTA и базовый рендер важных блоков.

## Импорты и зависимости

1. `vitest` - тестовый раннер и моки.
2. `@testing-library/react` - рендер и поиск элементов.
3. `@testing-library/user-event` - пользовательский клик по CTA.
4. `react-router-dom` (`MemoryRouter`) - роутер-контекст для тестирования `Link` внутри HomePage.
5. `src/pages/HomePage/HomePage.tsx` - тестируемый компонент.

## Экспорты и контракты

1. Файл не экспортирует runtime-значения.
2. Тестовый контракт:
3. Клик по кнопке "Создать коллекцию" вызывает `onCreateCollection` ровно один раз.
4. Компонент рендерит Hero-heading, 6 preview placeholders и desktop-визуализацию с responsive-классами.
5. Secondary CTA "Посмотреть примеры" имеет `href=/examples`.

## Нетривиальная логика

1. Проверка classes `hidden` и `lg:block` на визуальной панели фиксирует требование UX: блок скрыт на малых экранах.
2. Проверка количества `preview-card` обеспечивает неизменность договоренного диапазона placeholders для MVP-этапа.

## Где используется

1. Запускается в составе `npm run test`.
2. Защищает от регрессий при правках HomePage в шагах 3.x.
