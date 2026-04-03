# src/components/Header/Header.tsx

## Что делает файл

Файл реализует компонент верхней панели приложения (Header) с адаптивной навигацией для desktop/mobile.
Компонент решает три задачи:

1. Показывает разные пункты навигации для гостя и авторизованного пользователя.
2. Управляет UX-состояниями меню: мобильный бургер, дропдаун профиля, закрытие по Escape и клику вне.
3. Прокидывает действия авторизации наружу через callback-пропсы (вход, регистрация, выход).

## Импорты и зависимости

1. react (`useState`, `useEffect`, `useRef`) - хранение локального UI-состояния и работа с побочными эффектами (keydown, click outside, focus).
2. react-router-dom (`Link`, `useLocation`) - построение навигации и подсветка активного маршрута.
3. lucide-react (`Menu`, `X`, `LogOut`) - иконки кнопок меню/закрытия/выхода.
4. siteConfig - источник navItemsPublic/navItemsPrivate, чтобы не дублировать конфигурацию пунктов меню внутри Header.
5. ThemeToggle - отдельный компонент переключения темы для desktop и mobile блоков Header.

## Экспорты и контракты

1. Экспортируется default-компонент `Header`.
2. Входные пропсы (`HeaderProps`):
3. `user?: { login: string; isAuthenticated: boolean }`.
4. `isAuthResolving?: boolean` - флаг проверки текущей auth-сессии.
5. `onLogout?: () => void | Promise<void>`.
6. `onOpenLogin?: () => void`.
7. `onOpenRegister?: () => void`.
8. Возвращает JSX-разметку Header.
9. Инварианты контракта:
10. При `isAuthResolving=true` вместо навигации/кнопок показываются skeleton-заглушки.
11. При `user.isAuthenticated=true` показываются приватные пункты меню и профиль.
12. При `user.isAuthenticated=false` показываются публичные пункты и кнопки входа/регистрации.

## Нетривиальная логика

1. Выбор набора навигации:
2. Если идет проверка сессии (`isAuthResolving`) - меню временно не показывается.
3. Если пользователь авторизован - берутся `siteConfig.navItemsPrivate`.
4. Иначе берутся `siteConfig.navItemsPublic`.
5. Управление закрытием меню и дропдауна:
6. Обработчик Escape закрывает мобильное меню и профиль.
7. Клик вне `menuRef` закрывает мобильное меню.
8. Клик вне `profileRef` закрывает профиль.
9. Анимация дропдауна профиля разделена на два состояния:
10. `isProfileDropdown` отвечает за mount/unmount блока.
11. `profileAnimateIn` отвечает за классы opacity/scale для плавного входа/выхода.
12. При закрытии сначала выключается анимация, затем через timeout компонент размонтируется.
13. Доступность и UX:
14. При открытии мобильного меню фокус переводится на первый пункт (`firstMenuItemRef`).
15. Для загрузочных состояний используются `aria-live` и `aria-label`, чтобы экранные читалки получали корректный контекст.

## Где используется

1. Основной рендер компонента: `src/App.tsx` (импорт `./components/Header/Header` и передача пропсов `user`, `isAuthResolving`, `onLogout`, `onOpenLogin`, `onOpenRegister`).
2. Данные для пропса `user` собираются в `src/App.tsx` из `useAuthStore`.
3. Колбэки `onOpenLogin` и `onOpenRegister` в `src/App.tsx` связаны с `useModalStore().openModal(...)`.
4. Тесты компонента: `src/components/Header/Header.test.tsx`.
