# src/components/Auth/LoginForm.tsx

## Что делает файл

Компонент реализует форму входа пользователя по email и паролю.
Форма валидирует ввод на клиенте, вызывает `login` из auth-store и закрывает модалку через `onSuccess` при успешной авторизации.

## Импорты и зависимости

1. `react-hook-form` (`useForm`) - управление состоянием формы, валидацией и submit.
2. `src/store/auth.store.ts` (`useAuthStore`) - вызов `login`, чтение `error`, очистка ошибки, диагностический `probeProtectedApi`.

## Экспорты и контракты

1. Экспортируется default-компонент `LoginForm`.
2. Пропсы:
3. `onSuccess: () => void` - вызывается после успешного login (и завершения probe-блока).
4. `onSwitchToRegister: () => void` - переключение формы в модалке.
5. Локальная форма (`LoginFormValues`): `email`, `password`.
6. Инварианты:
7. Submit вызывает `login(email, password)` только после успешной клиентской валидации.
8. Ошибка авторизации берется из store (`error`) и рендерится в форме.

## Нетривиальная логика

1. Перед submit всегда вызывается `clearError()`, чтобы не показывать старое сообщение об ошибке при новой попытке входа.
2. После успешного login выполняется вложенный `probeProtectedApi`:
3. Его ошибка логируется в `console.warn`, но не отменяет успешный вход.
4. В блоке `catch` после login ничего не делается, потому что текст ошибки уже записан в `auth.store`.
5. При переключении на регистрацию форма также очищает ошибку (`clearError`) перед `onSwitchToRegister`.
6. Валидация полей:
7. `email` - required + regex.
8. `password` - required + minLength 6.

## Где используется

1. `src/components/Auth/AuthModal.tsx` - рендер формы в login-режиме.
2. `src/components/Auth/LoginForm.test.tsx` - unit/integration тесты поведения формы.
3. В `src/components/Auth/AuthModal.test.tsx` реальный `LoginForm` мокается для изоляции контейнерной логики.
