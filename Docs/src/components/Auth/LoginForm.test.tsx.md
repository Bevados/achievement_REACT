# src/components/Auth/LoginForm.test.tsx

## Что делает файл

Тестирует форму входа в изоляции от реального auth-store через мок `useAuthStore`.

## Импорты и зависимости

1. `vitest` даёт test runner и моки.
2. `@testing-library/react` и `user-event` эмулируют ввод и submit.
3. `./LoginForm` — тестируемый компонент.

## Экспорты и контракты

1. Экспортов нет: файл содержит только unit-tests для `LoginForm`.

## Нетривиальная логика

1. `useAuthStore` мокается как selector-based API, чтобы форма тестировалась без реального Zustand-store.
2. Ошибки проверяются как на уровне client-side валидации, так и на уровне `auth.store.error`.

## Где используется

1. Запускается в общем Vitest suite через `npm run test`.
