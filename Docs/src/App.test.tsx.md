# src/App.test.tsx

## Что делает файл

Файл покрывает интеграционные сценарии корневого компонента App: route-guards и wiring действий между Home CTA, Header и stores.

## Импорты и зависимости

1. `vitest` - describe/it/expect и module mocks.
2. `@testing-library/react` и `@testing-library/user-event` - рендер и пользовательские действия.
3. `react-router-dom` (`MemoryRouter`) - проверка поведения маршрутов в тестовой среде.
4. `src/App.tsx` - тестируемый компонент.
5. Мокаются store-модули (`auth`, `modal`, `auth-intent`, `theme`) и визуальные контейнеры (`Header`, `AuthModal`) для изоляции логики App.

## Экспорты и контракты

1. Файл не экспортирует runtime-значения.
2. Проверяемый контракт:
3. Авторизованный пользователь на `/` перенаправляется в private-route `/collections`.
4. Клик по Hero CTA гостя вызывает `setIntent('create-collection')` и открытие login modal.
5. Клик по Header login очищает intent и открывает login modal.

## Нетривиальная логика

1. Используются hoisted-моки Zustand-selector API, чтобы App получал стабильные тестовые состояния при каждом рендере.
2. Header и AuthModal заменены lightweight-заглушками: это позволяет тестировать именно orchestration-логику App, а не поведение вложенных компонентов.
3. Каждый тест сбрасывает mock-состояние в `beforeEach`, чтобы исключить протекание вызовов между сценариями.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает route-политику и intent-flow шага 3.1 от регрессий.
