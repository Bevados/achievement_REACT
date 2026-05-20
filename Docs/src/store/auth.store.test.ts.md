# src/store/auth.store.test.ts

## Что делает файл

Проверяет базовые сценарии `auth.store`: успешный login, успешную регистрацию и маппинг Firebase-ошибки в читаемый русский текст.

## Импорты и зависимости

1. `vitest` даёт test runner и моки.
2. `firebase/app` используется для создания `FirebaseError`.
3. `src/store/auth.store.ts` — тестируемый store.

## Экспорты и контракты

1. Экспортов нет: файл содержит unit-tests для `auth.store`.

## Нетривиальная логика

1. `src/firebase.ts` полностью мокается, чтобы тесты не зависели от реального Firebase.
2. `resetStore()` вручную возвращает Zustand-store в исходное состояние перед каждым тестом.

## Где используется

1. Запускается в общем Vitest suite через `npm run test`.
