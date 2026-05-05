# src/components/Auth/RegisterForm.test.tsx

## Что делает файл

Файл тестирует форму регистрации `RegisterForm`.
Покрываются кросс-полевая валидация паролей, корректный вызов `register` и показ ошибок из store.

## Импорты и зависимости

1. `vitest`, Testing Library и `user-event` используются для сценариев взаимодействия с формой.
2. `./RegisterForm` - тестируемый компонент.
3. `../../store/auth.store` мокается через selector-совместимый `storeMocks`.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
2.1. при несовпадении `password` и `confirmPassword` submit блокируется;
2.2. при валидном вводе вызывается `register(email, password, nickname)`;
2.3. ошибка из `auth.store.error` отображается в интерфейсе.

## Нетривиальная логика

1. Тесты проверяют business-critical порядок аргументов `register(email, password, nickname)`.
2. Асинхронный submit проверяется через `waitFor`, чтобы избежать гонок с ререндером формы.
3. Плейсхолдеры используются как стабильные селекторы инпутов.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает от регрессий компонент `src/components/Auth/RegisterForm.tsx`.
3. Использует общий test setup из `src/test/setup.ts`.
