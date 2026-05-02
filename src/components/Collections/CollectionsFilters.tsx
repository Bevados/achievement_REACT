import type { FormEvent } from 'react';
import type {
  CollectionCategory,
  CollectionSortField,
  SortOrder,
} from '../../../contracts/collection.contracts';
import { COLLECTION_CATEGORIES } from '../../../contracts/collection.contracts';
import {
  collectionCategoryLabels,
  collectionSortByOptions,
  collectionSortOrderOptions,
} from '../../config/collections.config';

interface CollectionsFiltersProps {
  sortBy: CollectionSortField;
  sortOrder: SortOrder;
  category: CollectionCategory | '';
  searchInput: string;
  onSortByChange: (value: CollectionSortField) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onCategoryChange: (value: CollectionCategory | '') => void;
  onSearchInputChange: (value: string) => void;
  onApplySearch: () => void;
  onReset: () => void;
}

export default function CollectionsFilters({
  sortBy,
  sortOrder,
  category,
  searchInput,
  onSortByChange,
  onSortOrderChange,
  onCategoryChange,
  onSearchInputChange,
  onApplySearch,
  onReset,
}: CollectionsFiltersProps) {
  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    onApplySearch();
  }

  return (
    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Сортировка
          <select
            value={sortBy}
            onChange={(event) => {
              onSortByChange(event.target.value as CollectionSortField);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {collectionSortByOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Порядок
          <select
            value={sortOrder}
            onChange={(event) => {
              onSortOrderChange(event.target.value as SortOrder);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {collectionSortOrderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-gray-700">
          Категория
          <select
            value={category}
            onChange={(event) => {
              onCategoryChange(event.target.value as CollectionCategory | '');
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">Все категории</option>
            {COLLECTION_CATEGORIES.map((categoryValue) => (
              <option key={categoryValue} value={categoryValue}>
                {collectionCategoryLabels[categoryValue]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <input
          type="search"
          value={searchInput}
          onChange={(event) => {
            onSearchInputChange(event.target.value);
          }}
          placeholder="Поиск по названию и описанию"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Применить
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Сбросить
        </button>
      </form>
    </div>
  );
}
