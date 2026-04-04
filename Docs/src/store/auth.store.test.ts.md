# src/store/auth.store.test.ts

## Что делает файл

Файл тестирует бизнес-поведение `useAuthStore` без реальных сетевых вызовов.
Покрываются ключевые сценарии: успешный login, успешный register, маппинг ошибок Firebase и поведение `probeProtectedApi`.

## Импорты и зависимости

1. `vitest` - тест-раннер и моки.
2. `firebase/app` (`FirebaseError`) - моделирование реальной ошибки Firebase для проверки map функции в store.
3. Моки модулей:
4. `../firebase` - подмена `signInEmail/registerEmail/signOut/onAuthStateChange`.
5. `../api/items.api` - подмена `probeItemsEndpoint`.
6. `./auth.store` - тестируемый Zustand-store.

## Экспорты и контракты

1. Экспортов нет.
2. Внутренний helper `resetStore()` сбрасывает состояние store перед тестами.
3. Контракты, которые проверяются:
4. Успешный login заполняет пользователя и ставит `isAuthenticated=true`.
5. Register передает nickname в firebase-слой и сохраняет displayName.
6. Ошибка `auth/invalid-credential` конвертируется в человекочитаемое сообщение.
7. `probeProtectedApi` бросает ошибку, если endpoint вернул `ok=false`.

## Нетривиальная логика

1. Используется `vi.hoisted` для стабильных моков при module-hoisting.
2. Store тестируется напрямую через `useAuthStore.getState()` без рендера React-компонентов.
3. Проверяется не только happy-path, но и преобразование ошибок на границе Firebase -> UI.

## Где используется

1. Запускается Vitest через `npm run test`.
2. Тестирует модуль `src/store/auth.store.ts`.
3. Подчиняется общему setup из `src/test/setup.ts`.
