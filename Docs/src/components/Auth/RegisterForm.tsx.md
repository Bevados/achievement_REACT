# src/components/Auth/RegisterForm.tsx

## Что делает файл

Компонент реализует форму регистрации пользователя (nickname, email, password, confirmPassword).
Форма валидирует поля на клиенте, вызывает `register` из auth-store и при успехе сообщает контейнеру через `onSuccess`.

## Импорты и зависимости

1. `react-hook-form` (`useForm`) - состояние формы, валидация и submit.
2. `src/store/auth.store.ts` (`useAuthStore`) - вызов `register`, чтение `error`, очистка ошибки, диагностический `probeProtectedApi`.

## Экспорты и контракты

1. Экспортируется default-компонент `RegisterForm`.
2. Пропсы:
2.1. `onSuccess: () => void` - вызывается после успешной регистрации.
3.1. `onSwitchToLogin: () => void` - переключение на форму входа.
4. Локальная форма (`RegisterFormValues`): `nickname`, `email`, `password`, `confirmPassword`.
5. Инварианты:
5.1. `registerUser` вызывается только при валидной форме.
5.2. `confirmPassword` должен совпадать с `password`.
6. Ошибка регистрации берется из `auth.store` и показывается в UI.

## Нетривиальная логика

1. `watch('password')` используется для динамической проверки `confirmPassword` в validate-правиле.
2. Перед submit вызывается `clearError()`, чтобы сбросить старые сообщения.
3. После успешной регистрации выполняется `probeProtectedApi`:
3.1. Его ошибка логируется, но не отменяет успешную регистрацию.
4. Валидация nickname жестче остальных полей:
4.1. minLength 3, maxLength 20, только латиница/цифры/underscore.
5. При переключении на логин в footer очищается ошибка и вызывается `onSwitchToLogin`.

## Где используется

1. `src/components/Auth/AuthModal.tsx` - рендер формы в register-режиме.
2. `src/components/Auth/RegisterForm.test.tsx` - тесты валидации и submit-сценариев.
3. В `src/components/Auth/AuthModal.test.tsx` компонент мокается для тестирования контейнера AuthModal изолированно.
