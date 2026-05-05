# src/store/auth.store.ts

## Что делает файл

Файл реализует Zustand-store для авторизации через Firebase.
Store хранит текущего пользователя, флаги загрузки и инициализации, текст ошибки и публичные действия `login`, `register`, `logout`, `clearError`, `initAuthListener`.
Это центральная точка, через которую UI получает auth-state и человекочитаемые ошибки.

## Импорты и зависимости

1. `zustand` (`create`) нужен для создания глобального auth-store.
2. `firebase/app` (`FirebaseError`) используется для распознавания кодов ошибок Firebase и перевода их в текст для UI.
3. `firebase/auth` (`User`) даёт тип исходного пользователя перед нормализацией в формат store.
4. `src/firebase.ts` поставляет auth-операции `signInEmail`, `registerEmail`, `signOut`, `onAuthStateChange`.

## Экспорты и контракты

1. Экспортируется `useAuthStore`.
2. Публичное состояние store: `user`, `isAuthenticated`, `isLoading`, `isInitialized`, `error`.
3. Публичные действия store: `initAuthListener()`, `login(email, password)`, `register(email, password, nickname)`, `logout()`, `clearError()`.
4. Внутренние helper-функции:
4.1. `mapFirebaseError` переводит коды Firebase в сообщения для интерфейса.
4.2. `toAuthUser` нормализует объект `firebase/auth` в облегчённый `AuthUser`.
5. Инварианты:
5.1. `initAuthListener` не должен подписываться повторно после первого запуска.
5.2. `login`, `register` и `logout` всегда сначала очищают старую ошибку и выставляют `isLoading=true`.
5.3. При ошибке текст сохраняется в store и исключение пробрасывается дальше вызывающему коду.

## Нетривиальная логика

1. Глобальная переменная `unsubscribeAuthListener` используется как защита от двойной подписки на Firebase listener.
2. `initAuthListener` переводит store в loading-состояние до первого ответа Firebase, чтобы App мог не строить маршруты по неподтверждённой сессии.
3. Listener приводит store к одному из двух устойчивых состояний: авторизованный пользователь с `user` или гость с `user=null`.
4. Все ошибки логина, регистрации и выхода проходят через единый `mapFirebaseError`, поэтому формы не знают о кодах Firebase напрямую.

## Где используется

1. `src/App.tsx` - читает `user`, `logout`, `initAuthListener`, `isInitialized`.
2. `src/components/Auth/AuthModal.tsx` - вызывает `clearError` при закрытии модалки.
3. `src/components/Auth/LoginForm.tsx` - вызывает `login`, читает `error` и `clearError`.
4. `src/components/Auth/RegisterForm.tsx` - вызывает `register`, читает `error` и `clearError`.
5. `src/store/auth.store.test.ts` - unit-тесты поведения store.
