# src/components/Collections/CollectionCard.test.tsx

## Что делает файл

Тестирует рендер и навигационное поведение `CollectionCard`.

## Импорты и зависимости

1. `vitest` — test runner и assertions.
2. `@testing-library/react` — рендер компонента.
3. `react-router-dom` (`MemoryRouter`) — окружение для `Link`.

## Экспорты и контракты

1. Файл не экспортирует production-сущности.
2. Проверяет:
   - базовый рендер карточки,
   - корректный `href` из пропса `to`,
   - fallback для опциональных полей,
   - отсутствие `Link`, если `to` не передан.

## Нетривиальная логика

1. Тесты подтверждают, что одна и та же карточка может использоваться и для private, и для public route.

## Где используется

1. `npm test` — покрытие `CollectionCard`.
