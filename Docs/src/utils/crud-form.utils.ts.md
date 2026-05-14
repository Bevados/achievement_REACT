# src/utils/crud-form.utils.ts

## Что делает файл

Хранит общий form-helper слой для private CRUD-форм коллекции и карточки.
Файл объединяет:
- raw типы form-values для RHF;
- нормализацию данных в DTO-совместимый вид;
- лёгкий adapter-resolver между `react-hook-form` и shared Zod-схемами.

## Импорты и зависимости

1. `react-hook-form` (`FieldErrors`, `FieldValues`, `Resolver`) — типы для кастомных resolver-ов.
2. `zod` — чтение ошибок shared schema и преобразование их в RHF field errors.
3. `contracts/collection.contracts.ts` — типы DTO и enum-значения.
4. `contracts/collection.contracts.schema.ts` — shared Zod-схемы `createCollectionSchema` и `createEntrySchema`.

## Экспорты и контракты

1. `CollectionFormValues` — raw модель private формы коллекции.
2. `EntryFormValues` — raw модель private формы карточки.
3. `EntryDateMode` — UI-режим даты `single | range`.
4. `normalizeCollectionFormValues()` — превращает raw form-values в `CreateCollectionDto`.
5. `normalizeEntryFormValues()` — превращает raw form-values в `CreateEntryDto`.
6. `collectionFormResolver` — RHF resolver для `CollectionForm`.
7. `createEntryFormResolver(dateMode)` — RHF resolver для `EntryForm`.

## Нетривиальная логика

1. Файл не тянет новую зависимость вроде `@hookform/resolvers`: проекту достаточно лёгкого локального adapter-слоя над уже существующими shared Zod-схемами.
2. Нормализация выполняется до shared schema:
   - пустые строки превращаются в `undefined`;
   - даты `<input type="date">` превращаются в ISO-строки;
   - `tags` очищаются, разделяются по запятым и дедуплицируются.
3. Resolver для коллекции добавляет клиентское UX-правило `customCategory required when category=other`, даже если backend schema хранит это правило мягче.
4. Ошибки Zod преобразуются в field errors RHF, чтобы формы могли показывать их рядом с конкретными полями.
5. Для UX формы коллекции resolver отдельно обрабатывает пустое стартовое значение `category=''`: это позволяет показывать placeholder в select и выдавать понятную ошибку `Выберите категорию`, не ломая shared DTO-модель.

## Где используется

1. `src/components/Collections/CollectionForm.tsx`
2. `src/components/Entries/EntryForm.tsx`
