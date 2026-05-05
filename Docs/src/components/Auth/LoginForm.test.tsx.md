# src/components/Auth/LoginForm.test.tsx

## Что делает файл

Файл тестирует форму входа `LoginForm`.
Покрываются клиентская валидация полей, корректный вызов `login`, показ ошибок из store и переход на регистрацию с очисткой ошибки.

## Импорты и зависимости

1. `vitest`, Testing Library и `user-event` используются для сценариев взаимодействия с формой.
2. `./LoginForm` - тестируемый компонент.
3. `../../store/auth.store` мокается через selector-совместимый `storeMocks`.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
2.1. невалидный пароль блокирует submit и `login` не вызывается;
2.2. валидные данные передаются в `login(email, password)`;
2.3. ошибка из `auth.store.error` рендерится пользователю;
2.4. кнопка перехода на регистрацию вызывает `clearError` и `onSwitchToRegister`.

## Нетривиальная логика

1. Мок повторяет паттерн Zustand selector API: `useAuthStore(selector) => selector(storeMocks)`.
2. Успешный submit проверяется через `waitFor`, потому что обработчик формы асинхронный.
3. Тесты проверяют не только сам факт submit, но и аргументы, переданные в store.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает от регрессий компонент `src/components/Auth/LoginForm.tsx`.
3. Использует общий test setup из `src/test/setup.ts`.
