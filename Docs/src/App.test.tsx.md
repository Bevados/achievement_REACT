# src/App.test.tsx

## Что делает файл

Файл покрывает интеграционные сценарии корневого компонента `App`: route-guards и wiring действий между Home CTA, Header и store.

## Импорты и зависимости

1. `vitest` даёт `describe`, `it`, `expect`, `vi` и lifecycle hooks.
2. `@testing-library/react` и `@testing-library/user-event` используются для рендера и пользовательских действий.
3. `react-router-dom` (`MemoryRouter`) позволяет тестировать маршрутизацию в изолированной среде.
4. `src/App.tsx` - тестируемый компонент.
5. Мокаются store-модули `auth`, `modal`, `auth-intent`, `theme`, а также `Header` и `AuthModal`, чтобы изолировать orchestration-логику `App`.

## Экспорты и контракты

1. Файл не экспортирует runtime-значения.
2. Проверяемый контракт:
2.1. Авторизованный пользователь на `/` перенаправляется на `/collections`.
2.2. Клик по Hero CTA гостя вызывает `setIntent('create-collection')` и открывает login modal.
2.3. Маршрут `/profile` рендерит заглушку профиля для авторизованного пользователя.
2.4. Клик по Header login очищает intent и открывает login modal.

## Нетривиальная логика

1. Используются hoisted-моки Zustand-selector API, чтобы `App` получал стабильные тестовые состояния при каждом рендере.
2. `Header` и `AuthModal` заменены lightweight-заглушками, поэтому тесты проверяют именно оркестрацию в `App`, а не поведение вложенных компонентов.
3. `beforeEach` сбрасывает mock-состояние, чтобы вызовы из одного сценария не протекали в другой.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает route-политику и intent-flow `App` от регрессий.
