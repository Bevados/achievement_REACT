# src/components/Entries/EntryCard.tsx

## Что делает файл

Файл рендерит базовую read-only карточку `Entry`.
Это первый UI-компонент для карточек коллекции на шаге 5.1: он показывает обязательные поля, умеет аккуратно отображать optional-данные и уже содержит action-зону-заглушку для будущих edit/delete сценариев.

## Импорты и зависимости

1. `contracts/collection.contracts.ts` (`EntryView`, `EntryStatus`) задает контракт данных и enum статусов.
2. Внешних store/API-зависимостей нет: компонент чисто презентационный.

## Экспорты и контракты

1. Экспортируется default-компонент `EntryCard`.
2. Входные данные: `entry: EntryView`.
3. Обязательный вывод: `title`, `status`, `updatedAt`.
4. Optional-поля `description`, `imageUrl`, `price`, `tags`, `rating`, `date` рендерятся только если они есть.
5. В карточке присутствуют disabled-кнопки `Редактировать` и `Удалить` как визуальные заглушки для следующих подпунктов CRUD.

## Нетривиальная логика

1. Статусы переводятся из contract enum в локализованные подписи и CSS-оформление через две map-таблицы `statusLabels` и `statusClasses`.
2. `hasMeta` и `hasTags` не дают рендерить пустые блоки метаданных, если optional-поля отсутствуют.
3. Цена форматируется через `Intl.NumberFormat`, а даты - через `toLocaleDateString('ru-RU')`.

## Где используется

1. `src/components/Entries/EntriesGrid.tsx` рендерит `EntryCard` для каждого `entry`.
2. `src/pages/CollectionDetailPage/CollectionDetailPage.tsx` показывает список карточек коллекции через этот компонент.
