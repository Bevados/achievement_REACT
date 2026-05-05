# src/store/auth.store.test.ts

## Что делает файл

Файл тестирует бизнес-поведение `useAuthStore` без реальных сетевых вызовов.
Покрываются ключевые сценарии: успешный login, успешный register и маппинг ошибок Firebase.

## Импорты и зависимости

1. `vitest` используется как тест-раннер и система моков.
2. `firebase/app` (`FirebaseError`) нужен для моделирования реальной ошибки Firebase.
3. `../firebase` мокается, чтобы подменить `signInEmail`, `registerEmail`, `signOut`, `onAuthStateChange`.
4. `./auth.store` - тестируемый Zustand-store.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Внутренний helper `resetStore()` сбрасывает состояние store перед сценариями.
3. Проверяемые контракты:
3.1. успешный `login` заполняет пользователя и ставит `isAuthenticated=true`;
3.2. `register` передаёт nickname в firebase-слой и сохраняет `displayName`;
3.3. ошибка `auth/invalid-credential` конвертируется в человекочитаемое сообщение.

## Нетривиальная логика

1. Используется `vi.hoisted`, чтобы моки были стабильны при module-hoisting.
2. Store тестируется напрямую через `useAuthStore.getState()` без рендера React-компонентов.
3. Тесты проверяют не только happy-path, но и границу Firebase -> UI через `mapFirebaseError`.

## Где используется

1. Запускается Vitest через `npm run test`.
2. Тестирует модуль `src/store/auth.store.ts`.
3. Подчиняется общему setup из `src/test/setup.ts`.
