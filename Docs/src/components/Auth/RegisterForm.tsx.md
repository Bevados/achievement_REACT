# src/components/Auth/RegisterForm.tsx

## Что делает файл

Рендерит форму регистрации с никнеймом, email и подтверждением пароля.
Проверяет поля на клиенте, вызывает `register` из `auth.store` и показывает серверные ошибки из стора.

## Импорты и зависимости

1. `react-hook-form` управляет полями и submit-валидацией.
2. `src/store/auth.store.ts` даёт `register`, `error` и `clearError`.

## Экспорты и контракты

1. Экспортируется default-компонент `RegisterForm`.
2. `onSuccess` вызывается после успешной регистрации.
3. `onSwitchToLogin` переключает модалку назад на форму входа.

## Нетривиальная логика

1. `nickname` проверяется на длину и разрешённый набор символов.
2. `confirmPassword` сравнивается с `password` прямо в форме.
3. `catch` после `register` пустой, потому что сообщение ошибки уже хранится в `auth.store`.

## Где используется

1. `src/components/Auth/AuthModal.tsx` — рендерит форму в режиме регистрации.
2. `src/components/Auth/RegisterForm.test.tsx` — проверяет submit, валидацию и показ ошибок.
