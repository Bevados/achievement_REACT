# src/store/modal.store.ts

## Что делает файл

Файл хранит UI-состояние модального окна авторизации.
Store отделен от бизнес-логики auth, чтобы управление показом модалки было независимым и простым.

## Импорты и зависимости

1. `zustand` (`create`) - создание UI-store.

## Экспорты и контракты

1. Экспортируется тип `ModalType = 'login' | 'register' | null`.
2. Экспортируется `useModalStore`.
3. Контракт состояния:
3.1. `activeModal` - какая форма активна (`login/register/null`).
3.2. `isOpen` - открыта ли модалка.
4. Контракт действий:
4.1. `openModal(modal)` - открыть и выставить активную форму.
4.2. `closeModal()` - закрыть и сбросить `activeModal`.
4.3. `switchModal(modal)` - сменить форму без закрытия контейнера.
5. Инварианты:
5.1. `openModal` и `switchModal` всегда выставляют `isOpen=true`.
5.2. `closeModal` возвращает store в начальное состояние.

## Нетривиальная логика

1. Логика intentionally минимальная: все действия синхронные и не зависят от сети.
2. Разделение `activeModal` и `isOpen` позволяет менять содержимое модалки, не размонтируя контейнер (через `switchModal`).

## Где используется

1. `src/App.tsx` - вызов `openModal` из колбэков Header (`onOpenLogin`, `onOpenRegister`).
2. `src/components/Auth/AuthModal.tsx` - чтение `isOpen`, `activeModal`, вызов `closeModal`, `switchModal`.
3. `src/store/modal.store.test.ts` - unit-тесты переходов состояния.
