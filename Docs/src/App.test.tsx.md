# src/App.test.tsx

## Что делает файл

Тестирует ключевые маршруты и CTA-flow корневого приложения.

## Импорты и зависимости

1. `vitest` — mocks и assertions.
2. `@testing-library/react` и `user-event` — рендер и действия пользователя.
3. `MemoryRouter` — локальная маршрутизация.

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Проверяет:
   - redirect auth-user с `/`,
   - deferred-intent CTA,
   - private detail route,
   - public example detail route,
   - redirect auth-user из public example detail,
   - profile route.

## Нетривиальная логика

1. Все store-слои мокируются через selector-паттерн Zustand.

## Где используется

1. `npm test` — интеграционное покрытие `App`.
