# src/components/Auth/LoginForm.test.tsx

## Что делает файл

Файл тестирует форму входа `LoginForm`:

1. Клиентскую валидацию полей.
2. Корректный вызов login в store.
3. Отображение ошибок из store.
4. UX-переход в регистрацию с очисткой ошибки.

## Импорты и зависимости

1. `vitest` + Testing Library + `user-event` - сценарии взаимодействия с формой.
2. `./LoginForm` - тестируемый компонент.
3. Мок `../../store/auth.store` - подмена `useAuthStore(selector)` управляемым объектом `storeMocks`.

## Экспорты и контракты

1. Экспортов нет.
2. Контракт формы, проверяемый тестами:
3. Невалидный пароль блокирует submit и `login` не вызывается.
4. Валидные данные передаются в `login(email, password)`.
5. Ошибка из `auth.store.error` рендерится пользователю.
6. Кнопка `Зарегистрироваться` вызывает `clearError` и `onSwitchToRegister`.

## Нетривиальная логика

1. Мок реализует паттерн Zustand selector: `useAuthStore(selector) => selector(storeMocks)`.
2. В успешном сценарии используется `waitFor`, потому что submit асинхронный.
3. Проверяется не только вызов submit, но и корректность аргументов, переданных в store.

## Где используется

1. Запускается Vitest через `npm run test`.
2. Тестирует `src/components/Auth/LoginForm.tsx`.
3. Использует общий setup `src/test/setup.ts` (через `vite.config.ts`).
