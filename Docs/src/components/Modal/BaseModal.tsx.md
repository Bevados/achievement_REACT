# src/components/Modal/BaseModal.tsx

## Что делает файл

Это базовый переиспользуемый контейнер модального окна.
Компонент отвечает за инфраструктуру модалки: рендер в portal, закрытие по Escape/клику по фону, блокировку скролла body и семантику доступности (`role="dialog"`, `aria-modal`).

## Импорты и зависимости

1. `react` (`useEffect`, `ReactNode`) - управление side effects и тип children.
2. `react-dom` (`createPortal`) - рендер поверх основного дерева в `document.body`.
3. `lucide-react` (`X`) - иконка кнопки закрытия.

## Экспорты и контракты

1. Экспортируется default-компонент `BaseModal`.
2. Пропсы:
3. `isOpen: boolean` - управляет рендером модалки.
4. `title: string` - заголовок и `aria-label` диалога.
5. `onClose: () => void` - единый обработчик закрытия.
6. `children: ReactNode` - контент модалки.
7. Инварианты:
8. При `isOpen=false` компонент возвращает `null`.
9. При `isOpen=true` скролл страницы блокируется до размонтирования/закрытия.
10. Закрытие по Escape, по клику на фон и по кнопке использует один `onClose`.

## Нетривиальная логика

1. В `useEffect` запоминается оригинальный `document.body.style.overflow` и восстанавливается в cleanup, чтобы не ломать страницу после закрытия модалки.
2. Закрытие по мыши реализовано через сравнение `event.target === event.currentTarget`, чтобы клик внутри контента не закрывал окно.
3. Использование portal предотвращает проблемы со stacking context и позволяет модалке корректно перекрывать layout.

## Где используется

1. Прямое использование в `src/components/Auth/AuthModal.tsx`.
2. Косвенно участвует в auth-flow через `src/App.tsx` -> `AuthModal`.
3. Поведение закрытия проверяется в `src/components/Auth/AuthModal.test.tsx`.
