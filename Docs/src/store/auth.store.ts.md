# src/store/auth.store.ts

## Что делает файл

Хранит клиентское auth-состояние приложения на `zustand`.
Отвечает за login/register/logout, подписку на Firebase auth-state и нормализацию пользовательских текстов ошибок.

## Импорты и зависимости

1. `zustand` создаёт store.
2. `firebase/app` даёт `FirebaseError` для маппинга кодов ошибок.
3. `src/firebase.ts` даёт auth-операции и подписку на изменения пользователя.

## Экспорты и контракты

1. `useAuthStore` — основной auth-store приложения.
2. Store хранит `user`, `isAuthenticated`, `isLoading`, `isInitialized` и `error`.
3. Store предоставляет методы `initAuthListener`, `login`, `register`, `logout`, `clearError`.

## Нетривиальная логика

1. `mapFirebaseError` переводит Firebase-коды в русские пользовательские сообщения.
2. `initAuthListener` защищён от двойной подписки через `unsubscribeAuthListener`.
3. Любая auth-ошибка сохраняется в `error`, а затем пробрасывается дальше для вызывающего слоя.

## Где используется

1. `src/components/Auth/LoginForm.tsx`
2. `src/components/Auth/RegisterForm.tsx`
3. `src/App.tsx`
4. `src/store/auth.store.test.ts`
