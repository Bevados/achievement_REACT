import type {
  CollectionCategory,
  CollectionSortField,
  CollectionView,
  SortOrder,
} from '../../contracts/collection.contracts';

export const collectionCategoryLabels: Record<CollectionCategory, string> = {
  travel: 'Путешествия',
  sport: 'Спорт',
  shopping: 'Покупки',
  learning: 'Обучение',
  health_body: 'Здоровье и тело',
  creativity: 'Творчество',
  hobby: 'Хобби',
  career: 'Карьера',
  family: 'Семья',
  home: 'Дом',
  self_development: 'Саморазвитие',
  other: 'Другое',
};

export const collectionSortByOptions: Array<{ value: CollectionSortField; label: string }> = [
  { value: 'updatedAt', label: 'Сначала недавно обновленные' },
  { value: 'createdAt', label: 'Сначала недавно созданные' },
  { value: 'title', label: 'По названию' },
  { value: 'entriesCount', label: 'По количеству карточек' },
];

export const collectionSortOrderOptions: Array<{ value: SortOrder; label: string }> = [
  { value: 'desc', label: 'По убыванию' },
  { value: 'asc', label: 'По возрастанию' },
];

export function getCollectionCategoryLabel(
  collection: Pick<CollectionView, 'category' | 'customCategory'>,
): string {
  if (collection.category === 'other' && collection.customCategory) {
    return collection.customCategory;
  }

  return collectionCategoryLabels[collection.category];
}
