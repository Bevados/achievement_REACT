# src/components/Collections/CollectionCard.tsx

## Что делает файл

Компонент рендерит одну карточку коллекции в общем grid-списке.
Он показывает обложку, категорию, количество карточек, описание, дату обновления и умеет работать как с private, так и с public навигацией.

## Импорты и зависимости

1. `react-router-dom` (`Link`) — кликабельная навигация по карточке.
2. `contracts/collection.contracts.ts` — тип `CollectionView`.
3. `src/config/collections.config.ts` — человекочитаемые подписи категорий.

## Экспорты и контракты

1. Экспортируется `CollectionCard`.
2. Пропсы:
   - `collection: CollectionView`
   - `to?: string`
3. Если `to` передан, карточка рендерится как `Link`.
4. Если `to` не передан, карточка остается статичным блоком без навигации.

## Нетривиальная логика

1. Внутренний `CollectionCardContent` отделяет общий UI от способа обертки (`Link` или `div`).
2. Опциональные `coverImageUrl` и `description` имеют аккуратные fallback-состояния.
3. Проп `to` позволяет переиспользовать один и тот же компонент и для `/collections/:id`, и для `/examples/:id`.

## Где используется

1. `src/components/Collections/CollectionsGrid.tsx` — рендер списка карточек коллекций.
