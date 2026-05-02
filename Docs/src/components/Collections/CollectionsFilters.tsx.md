# src/components/Collections/CollectionsFilters.tsx

## Что делает файл

Файл содержит общий UI-блок фильтров для страниц списков коллекций.
Компонент отображает сортировку, порядок, категорию, поле поиска и кнопки Применить/Сбросить.

## Импорты и зависимости

1. `react` (`FormEvent`) - типизация submit-обработчика формы.
2. `contracts/collection.contracts.ts` - типы сортировки/категории и список категорий.
3. `src/config/collections.config.ts` - подписи категорий и опции сортировки/порядка.

## Экспорты и контракты

1. Экспортируется default-компонент `CollectionsFilters`.
2. Входные параметры:
   - текущие значения: `sortBy`, `sortOrder`, `category`, `searchInput`;
   - callbacks изменения значений и действий (`onApplySearch`, `onReset`).
3. Компонент не хранит бизнес-состояние, работает как контролируемая форма.

## Нетривиальная логика

1. Submit формы не перезагружает страницу и делегируется в `onApplySearch`.
2. Компонент полностью переиспользуем между public/private страницами, отличается только контекст данных, но не UI.

## Где используется

1. `src/pages/ExamplesPage/ExamplesPage.tsx`.
2. `src/pages/CollectionsPage/CollectionsPage.tsx`.
