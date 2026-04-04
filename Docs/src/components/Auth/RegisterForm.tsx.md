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
3. `onSuccess: () => void` - вызывается после успешной регистрации.
4. `onSwitchToLogin: () => void` - переключение на форму входа.
5. Локальная форма (`RegisterFormValues`): `nickname`, `email`, `password`, `confirmPassword`.
6. Инварианты:
7. `registerUser` вызывается только при валидной форме.
8. `confirmPassword` должен совпадать с `password`.
9. Ошибка регистрации берется из `auth.store` и показывается в UI.

## Нетривиальная логика

1. `watch('password')` используется для динамической проверки `confirmPassword` в validate-правиле.
2. Перед submit вызывается `clearError()`, чтобы сбросить старые сообщения.
3. После успешной регистрации выполняется `probeProtectedApi`:
4. Его ошибка логируется, но не отменяет успешную регистрацию.
5. Валидация nickname жестче остальных полей:
6. minLength 3, maxLength 20, только латиница/цифры/underscore.
7. При переключении на логин в footer очищается ошибка и вызывается `onSwitchToLogin`.

## Где используется

1. `src/components/Auth/AuthModal.tsx` - рендер формы в register-режиме.
2. `src/components/Auth/RegisterForm.test.tsx` - тесты валидации и submit-сценариев.
3. В `src/components/Auth/AuthModal.test.tsx` компонент мокается для тестирования контейнера AuthModal изолированно.
