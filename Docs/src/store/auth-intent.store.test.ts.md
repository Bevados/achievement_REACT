# src/store/auth-intent.store.test.ts

## Что делает файл

Файл проверяет поведение store `auth-intent`: установка, потребление и очистка отложенного intent.

## Импорты и зависимости

1. `vitest` (`describe`, `it`, `expect`, `beforeEach`) - тестовый раннер и assertions.
2. `src/store/auth-intent.store.ts` - тестируемый Zustand-store.

## Экспорты и контракты

1. Файл не экспортирует runtime-значения.
2. Содержит unit-тесты контракта store:
3. `setIntent` сохраняет значение в `pendingIntent`.
4. `consumeIntent` возвращает текущее значение и очищает store.
5. `clearIntent` сбрасывает `pendingIntent` в `null`.

## Нетривиальная логика

1. В `beforeEach` состояние store сбрасывается через `setState`, чтобы тесты были полностью независимы.
2. Проверка `consumeIntent` подтверждает сразу два эффекта: возвращаемое значение и факт очистки состояния.

## Где используется

1. Запускается в общем наборе `npm run test`.
2. Гарантирует стабильный контракт для deferred-intent сценариев в `src/App.tsx`.
