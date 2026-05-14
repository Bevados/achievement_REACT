# src/components/Modal/BaseModal.tsx

## Что делает файл

Это базовый переиспользуемый контейнер модального окна.
Компонент отвечает за portal-рендер, закрытие по Escape/клику по фону, блокировку скролла страницы и базовую доступность.
После UX-правки модалка ещё и ограничивает высоту по viewport, а контент внутри получает собственный вертикальный скролл.

## Импорты и зависимости

1. `react` (`useEffect`, `ReactNode`) — управление side effects и тип children.
2. `react-dom` (`createPortal`) — рендер поверх основного дерева в `document.body`.
3. `lucide-react` (`X`) — иконка кнопки закрытия.

## Экспорты и контракты

1. Экспортируется default-компонент `BaseModal`.
2. Пропсы:
   - `isOpen: boolean`
   - `title: string`
   - `onClose: () => void`
   - `children: ReactNode`
3. Инварианты:
   - при `isOpen=false` возвращает `null`;
   - при `isOpen=true` блокирует скролл страницы до закрытия;
   - один и тот же `onClose` используется для Escape, overlay-click и кнопки закрытия.

## Нетривиальная логика

1. В `useEffect` запоминается исходный `document.body.style.overflow` и восстанавливается в cleanup.
2. Закрытие по клику мышью реализовано через проверку `event.target === event.currentTarget`, чтобы взаимодействие внутри контента не закрывало окно.
3. Контейнер модалки стал `flex` + `max-h`, а children обёрнуты в `overflow-y-auto`, поэтому длинные формы больше не выпадают за пределы экрана.

## Где используется

1. `src/components/Auth/AuthModal.tsx`
2. `src/pages/CollectionsPage/CollectionsPage.tsx`
3. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx`
