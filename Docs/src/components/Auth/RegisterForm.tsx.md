# src/components/Auth/RegisterForm.tsx

## Что делает файл

Компонент реализует форму регистрации пользователя с полями `nickname`, `email`, `password`, `confirmPassword`.
Форма валидирует поля на клиенте, вызывает `register` из auth-store и по успеху сообщает контейнеру через `onSuccess`.

## Импорты и зависимости

1. `react-hook-form` (`useForm`) управляет состоянием формы, валидацией и submit.
2. `src/store/auth.store.ts` (`useAuthStore`) даёт `register`, `error` и `clearError`.

## Экспорты и контракты

1. Экспортируется default-компонент `RegisterForm`.
2. Проп `onSuccess: () => void` вызывается после успешной регистрации.
3. Проп `onSwitchToLogin: () => void` переключает модалку на форму входа.
4. Локальная форма `RegisterFormValues` содержит `nickname`, `email`, `password`, `confirmPassword`.
5. Инварианты:
5.1. `register(email, password, nickname)` вызывается только при валидной форме.
5.2. `confirmPassword` должен совпадать со значением `password`.
5.3. Ошибка регистрации читается из `auth.store.error`.

## Нетривиальная логика

1. Перед submit форма вызывает `clearError()`, чтобы убрать сообщение от предыдущей попытки.
2. Проверка `confirmPassword` использует второй аргумент `formValues` из `react-hook-form`, поэтому компоненту не нужен отдельный `watch('password')`.
3. Валидация `nickname` строже остальных полей: минимум 3 символа, максимум 20, только латиница, цифры и `_`.
4. При переключении на логин компонент сначала очищает ошибку, затем вызывает `onSwitchToLogin`.

## Где используется

1. `src/components/Auth/AuthModal.tsx` - рендер формы в register-режиме.
2. `src/components/Auth/RegisterForm.test.tsx` - тестирует кросс-полевую валидацию и submit.
3. `src/components/Auth/AuthModal.test.tsx` - мокает компонент для изоляции контейнерной логики модалки.
