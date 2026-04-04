# src/components/Auth/AuthModal.test.tsx

## Что делает файл

Файл тестирует контейнерную логику `AuthModal`:

1. Рендер в зависимости от `isOpen` и `activeModal`.
2. Переключение формы login/register через `switchModal`.
3. Единый сценарий закрытия с `clearError` + `closeModal`.

## Импорты и зависимости

1. `vitest` + `@testing-library/react` + `@testing-library/user-event` - тестовый фреймворк и пользовательские действия.
2. `./AuthModal` - тестируемый компонент.
3. Моки stores:
4. `../../store/modal.store` - контролируем `isOpen`, `activeModal`, `closeModal`, `switchModal`.
5. `../../store/auth.store` - контролируем `clearError`.
6. Моки форм `./LoginForm` и `./RegisterForm` - изолируют тесты контейнера от валидации форм.

## Экспорты и контракты

1. Экспортов нет.
2. Контракт, который проверяется тестами:
3. Если `isOpen=false`, модалка не рендерится.
4. При `activeModal='login'` заголовок `Вход` и content LoginForm.
5. При `activeModal='register'` заголовок `Регистрация` и content RegisterForm.
6. Закрытие модалки всегда очищает auth-ошибку и закрывает окно.

## Нетривиальная логика

1. Используется `vi.hoisted` для стабильных мок-объектов, доступных внутри `vi.mock`.
2. Тесты проверяют не внутренности форм, а только orchestration-контракт контейнера.
3. Моки `LoginForm`/`RegisterForm` эмитят кнопки-события (`SWITCH_*`, `*_SUCCESS`), чтобы детерминированно вызывать callbacks контейнера.

## Где используется

1. Запускается Vitest через `npm run test`.
2. Тестирует `src/components/Auth/AuthModal.tsx`.
3. Общая тестовая инициализация подключается через `src/test/setup.ts` (см. `vite.config.ts`).
