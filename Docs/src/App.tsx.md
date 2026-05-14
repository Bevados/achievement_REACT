# src/App.tsx

## Что делает файл

Файл собирает корневую маршрутизацию приложения, общую шапку и auth-гейты.

## Импорты и зависимости

1. `react`
2. `react-router-dom`
3. `src/components/Header/Header.tsx`
4. `src/components/Auth/AuthModal.tsx`
5. страницы из `src/pages/*`
6. auth/theme/modal stores

## Экспорты и контракты

1. Экспортируется default-компонент `App`.
2. Основные маршруты:
   - `/`
   - `/examples`
   - `/examples/:collectionId/:collectionSlug?`
   - `/collections`
   - `/collections/:collectionId/:collectionSlug?`
   - `/profile`

## Нетривиальная логика

1. Для detail-страниц коллекций маршрут принимает optional slug, но загрузка данных всё равно идёт по `collectionId`.
2. Гостевые и private-разделы разводятся через `Navigate`.
3. Авторизованный пользователь уходит с `/` в `/collections`.

## Где используется

1. Корневая точка frontend-приложения.
