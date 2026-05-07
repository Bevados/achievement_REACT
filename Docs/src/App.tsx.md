# src/App.tsx

## Что делает файл

Это корневой route-shell приложения.

## Импорты и зависимости

1. `react-router-dom` — маршрутизация и redirect.
2. auth/theme/modal stores — глобальные состояния приложения.
3. pages — публичные и приватные страницы.

## Экспорты и контракты

1. Экспортируется `App`.
2. Guest routes:
   - `/`
   - `/examples`
   - `/examples/:collectionId`
3. Private routes:
   - `/collections`
   - `/collections/:collectionId`
   - `/profile`

## Нетривиальная логика

1. `/examples/:collectionId` работает только для гостя и редиректит авторизованного пользователя в private-зону.
2. Root route redirect-ит авторизованного пользователя в `/collections`.

## Где используется

1. Главная точка входа frontend-приложения.
