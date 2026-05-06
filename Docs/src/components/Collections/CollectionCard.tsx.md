# src/components/Collections/CollectionCard.tsx

## Что делает файл

Файл рендерит универсальную карточку коллекции.
Карточка используется и в публичном списке примеров, и в приватном списке пользователя, а на шаге 5.1 стала еще и точкой перехода на detail-страницу конкретной коллекции.

## Импорты и зависимости

1. `react-router-dom` (`Link`) нужен для перехода на `/collections/:collectionId`.
2. `contracts/collection.contracts.ts` (`CollectionView`) задает контракт входных данных.
3. `src/config/collections.config.ts` (`collectionCategoryLabels`) переводит slug категории в человекочитаемую подпись.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionCard`.
2. Входные данные: `collection: CollectionView`.
3. Карточка рендерит category, entriesCount, title, description/fallback, updatedAt и optional cover image.
4. Вся карточка кликабельна и ведет на `/collections/:collectionId`.
5. Если `isPublic=true`, отображается badge `Публичная`.

## Нетривиальная логика

1. Карточка реализована через `Link`, а не через локальный click-handler, поэтому маршрутизация остается декларативной и доступной для клавиатурной навигации.
2. Если `coverImageUrl` отсутствует, рендерится декоративная gradient-заглушка вместо изображения.
3. Если `description` отсутствует, используется текстовый fallback, чтобы высота карточки не выглядела сломанной.
4. Дата обновления форматируется локально через `toLocaleDateString('ru-RU')`.

## Где используется

1. `src/components/Collections/CollectionsGrid.tsx` рендерит `CollectionCard` для каждого элемента списка.
2. Через `CollectionsGrid` компонент используется на страницах `ExamplesPage` и `CollectionsPage`.
