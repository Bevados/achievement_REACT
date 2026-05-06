# src/components/Collections/CollectionCard.test.tsx

## Что делает файл

Файл тестирует UI-контракт карточки коллекции.
Покрывает основной сценарий отображения данных, fallback для optional-полей и навигационную ссылку на detail-страницу.

## Импорты и зависимости

1. `vitest` используется как тестовый раннер и assertion layer.
2. `@testing-library/react` рендерит компонент и ищет элементы в DOM.
3. `react-router-dom` (`MemoryRouter`) нужен, потому что `CollectionCard` внутри использует `Link`.
4. `src/components/Collections/CollectionCard.tsx` - тестируемый компонент.
5. `contracts/collection.contracts.ts` дает тип `CollectionView` для тестовых данных.

## Экспорты и контракты

1. Runtime-экспортов нет.
2. Проверяемые контракты:
2.1. карточка показывает title, category, entriesCount, public badge и updatedAt;
2.2. при наличии `coverImageUrl` рендерится изображение;
2.3. при отсутствии optional-полей используются fallback-состояния;
2.4. карточка рендерит ссылку на `/collections/:collectionId`.

## Нетривиальная логика

1. Тесты оборачивают компонент в `MemoryRouter`, потому что без router-контекста `Link` не может быть отрендерен корректно.
2. Проверка `href` важна как часть нового контракта шага 5.1: клик по карточке теперь открывает detail page коллекции.

## Где используется

1. Запускается в наборе `npm run test`.
2. Защищает от регрессий `src/components/Collections/CollectionCard.tsx`.
