# src/components/Auth/AuthModal.tsx

## Что делает файл

Это контейнер модального окна авторизации.
Компонент выбирает, какую форму показать (`LoginForm` или `RegisterForm`), задает заголовок модалки и централизует закрытие с очисткой ошибок.

## Импорты и зависимости

1. `src/components/Modal/BaseModal.tsx` - универсальная оболочка модального окна.
2. `src/store/modal.store.ts` - источник состояния открытия и активной формы.
3. `src/store/auth.store.ts` - используется для очистки auth-ошибки при закрытии.
4. `src/components/Auth/LoginForm.tsx` и `src/components/Auth/RegisterForm.tsx` - внутренний контент модалки.

## Экспорты и контракты

1. Экспортируется default-компонент `AuthModal`.
2. Компонент не принимает пропсы, все состояние берет из store.
3. Контракт поведения:
3.1. `isOpen` и `activeModal` читаются из `useModalStore`.
3.2. Закрытие всегда выполняет два действия: `clearError()` и `closeModal()`.
3.3. При `activeModal='register'` рендерится `RegisterForm`, иначе `LoginForm`.

## Нетривиальная логика

1. `handleClose` объединяет очистку ошибки и закрытие модалки, чтобы между переключениями форм не оставались неактуальные сообщения.
2. Заголовок модалки вычисляется от `activeModal`: `Регистрация` для register, иначе `Вход`.
3. Переключение между формами делается через `switchModal`, контейнер не размонтируется.

## Где используется

1. `src/App.tsx` - рендерится как `<AuthModal />` рядом с Header.
2. `src/components/Auth/AuthModal.test.tsx` - тестирование контейнерной логики (выбор формы, закрытие, переключение).
3. Использует дочерние компоненты `src/components/Auth/LoginForm.tsx` и `src/components/Auth/RegisterForm.tsx`.
