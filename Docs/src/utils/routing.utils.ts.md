# src/utils/routing.utils.ts

## Что делает файл

Хранит небольшой helper-слой для человекочитаемых URL коллекций.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` — тип `CollectionView` для ссылочных helper-функций.

## Экспорты и контракты

1. `slugify(value)` — превращает заголовок в безопасный slug.
2. `getPrivateCollectionHref(collection)` — строит private URL вида `/collections/:id/:slug`.
3. `getPublicCollectionHref(collection)` — строит public URL вида `/examples/:id/:slug`.

## Нетривиальная логика

1. Slug строится с нормализацией Unicode, удалением диакритики и очисткой лишних символов, чтобы одинаково устойчиво работать и с латиницей, и с кириллицей.
2. `id` остаётся основной частью маршрута, а slug используется только для читаемости URL, поэтому смена названия коллекции не ломает доступ к detail-странице.
3. Если после очистки строка пустая, `slugify()` возвращает fallback `collection`.

## Где используется

1. `src/pages/CollectionsPage/CollectionsPage.tsx`
2. `src/pages/ExamplesPage/ExamplesPage.tsx`
3. `src/components/Collections/CollectionCard.test.tsx`
