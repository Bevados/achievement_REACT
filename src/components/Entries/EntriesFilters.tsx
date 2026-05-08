import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import type { EntryStatus, EntrySortField, SortOrder } from '../../../contracts/collection.contracts';
import { ENTRY_STATUSES } from '../../../contracts/collection.contracts';
import { entrySortByOptions, entrySortOrderOptions, entryStatusLabels } from '../../config/entries.config';

interface EntriesFiltersProps {
  sortBy: EntrySortField;
  sortOrder: SortOrder;
  status: EntryStatus | '';
  createdAtFrom: string;
  createdAtTo: string;
  dateStartFrom: string;
  dateStartTo: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  maxRating: string;
  onSortByChange: (value: EntrySortField) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onStatusChange: (value: EntryStatus | '') => void;
  onCreatedAtFromChange: (value: string) => void;
  onCreatedAtToChange: (value: string) => void;
  onDateStartFromChange: (value: string) => void;
  onDateStartToChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onMinRatingChange: (value: string) => void;
  onMaxRatingChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function EntriesFilters({
  sortBy,
  sortOrder,
  status,
  createdAtFrom,
  createdAtTo,
  dateStartFrom,
  dateStartTo,
  minPrice,
  maxPrice,
  minRating,
  maxRating,
  onSortByChange,
  onSortOrderChange,
  onStatusChange,
  onCreatedAtFromChange,
  onCreatedAtToChange,
  onDateStartFromChange,
  onDateStartToChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinRatingChange,
  onMaxRatingChange,
  onApply,
  onReset,
}: EntriesFiltersProps) {
  const filtersPanelId = useId();
  const hasActiveFilters = Boolean(
    status ||
      createdAtFrom ||
      createdAtTo ||
      dateStartFrom ||
      dateStartTo ||
      minPrice ||
      maxPrice ||
      minRating ||
      maxRating,
  );
  const [isExpanded, setIsExpanded] = useState(hasActiveFilters);

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
    onApply();
  }

  return (
    <form className="rounded-xl border border-gray-200 bg-gray-50 p-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Фильтры карточек</p>
          <p className="mt-1 text-xs text-gray-500">
            {hasActiveFilters ? 'Есть активные условия фильтрации' : 'Можно отфильтровать список по полям карточки'}
          </p>
        </div>

        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={filtersPanelId}
          onClick={() => {
            setIsExpanded((prev) => !prev);
          }}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          {isExpanded ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>
      </div>

      {isExpanded ? (
        <div id={filtersPanelId} className="mt-4 space-y-3">
          <div className="grid gap-3 lg:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Сортировка
              <select
                value={sortBy}
                onChange={(event) => {
                  onSortByChange(event.target.value as EntrySortField);
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                {entrySortByOptions.map((option) => (
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
                {entrySortOrderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Статус
              <select
                value={status}
                onChange={(event) => {
                  onStatusChange(event.target.value as EntryStatus | '');
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Все статусы</option>
                {ENTRY_STATUSES.map((statusValue) => (
                  <option key={statusValue} value={statusValue}>
                    {entryStatusLabels[statusValue]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm font-medium text-gray-800">Дата создания</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  От
                  <input
                    type="date"
                    value={createdAtFrom}
                    onChange={(event) => {
                      onCreatedAtFromChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  До
                  <input
                    type="date"
                    value={createdAtTo}
                    onChange={(event) => {
                      onCreatedAtToChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm font-medium text-gray-800">Запланированная дата</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  От
                  <input
                    type="date"
                    value={dateStartFrom}
                    onChange={(event) => {
                      onDateStartFromChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  До
                  <input
                    type="date"
                    value={dateStartTo}
                    onChange={(event) => {
                      onDateStartToChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm font-medium text-gray-800">Цена</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  От
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={minPrice}
                    onChange={(event) => {
                      onMinPriceChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  До
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxPrice}
                    onChange={(event) => {
                      onMaxPriceChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-sm font-medium text-gray-800">Рейтинг</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  От
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    value={minRating}
                    onChange={(event) => {
                      onMinRatingChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-gray-700">
                  До
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="1"
                    value={maxRating}
                    onChange={(event) => {
                      onMaxRatingChange(event.target.value);
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
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
          </div>
        </div>
      ) : null}
    </form>
  );
}
