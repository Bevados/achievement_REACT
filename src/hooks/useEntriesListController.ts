import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  EntryListQueryDto,
  EntrySortField,
  EntryStatus,
  EntryView,
  PaginatedResult,
  PaginationMeta,
  SortOrder,
} from '../../contracts/collection.contracts';
import { ENTRY_SORT_FIELDS, ENTRY_STATUSES, SORT_ORDERS } from '../../contracts/collection.contracts';

type EntriesQuery = Pick<
  EntryListQueryDto,
  | 'page'
  | 'limit'
  | 'sortBy'
  | 'sortOrder'
  | 'status'
  | 'createdAtFrom'
  | 'createdAtTo'
  | 'dateStartFrom'
  | 'dateStartTo'
  | 'minPrice'
  | 'maxPrice'
  | 'minRating'
  | 'maxRating'
>;

interface UseEntriesListControllerOptions {
  collectionId: string;
  fetchEntries: (collectionId: string, query: EntriesQuery) => Promise<PaginatedResult<EntryView>>;
  fallbackErrorMessage: string;
  pageSize?: number;
}

interface UseEntriesListControllerResult {
  entries: EntryView[];
  meta: PaginationMeta | null;
  hasActiveFilters: boolean;
  page: number;
  sortBy: EntrySortField;
  sortOrder: SortOrder;
  status: EntryStatus | '';
  createdAtFromInput: string;
  createdAtToInput: string;
  dateStartFromInput: string;
  dateStartToInput: string;
  minPriceInput: string;
  maxPriceInput: string;
  minRatingInput: string;
  maxRatingInput: string;
  isLoading: boolean;
  errorMessage: string | null;
  setSortBy: (value: EntrySortField) => void;
  setSortOrder: (value: SortOrder) => void;
  setStatus: (value: EntryStatus | '') => void;
  setCreatedAtFromInput: (value: string) => void;
  setCreatedAtToInput: (value: string) => void;
  setDateStartFromInput: (value: string) => void;
  setDateStartToInput: (value: string) => void;
  setMinPriceInput: (value: string) => void;
  setMaxPriceInput: (value: string) => void;
  setMinRatingInput: (value: string) => void;
  setMaxRatingInput: (value: string) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  reloadEntries: () => Promise<void>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_SORT_BY: EntrySortField = 'updatedAt';
const DEFAULT_SORT_ORDER: SortOrder = 'desc';

function parsePage(value: string | null): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return DEFAULT_PAGE;
  }

  return parsed;
}

function parseSortBy(value: string | null): EntrySortField {
  if (value && ENTRY_SORT_FIELDS.includes(value as EntrySortField)) {
    return value as EntrySortField;
  }

  return DEFAULT_SORT_BY;
}

function parseSortOrder(value: string | null): SortOrder {
  if (value && SORT_ORDERS.includes(value as SortOrder)) {
    return value as SortOrder;
  }

  return DEFAULT_SORT_ORDER;
}

function parseStatus(value: string | null): EntryStatus | '' {
  if (value && ENTRY_STATUSES.includes(value as EntryStatus)) {
    return value as EntryStatus;
  }

  return '';
}

function parseText(value: string | null): string {
  return value?.trim() ?? '';
}

function toIsoStartOfDay(value: string): string {
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function toIsoEndOfDay(value: string): string {
  return new Date(`${value}T23:59:59.999Z`).toISOString();
}

function parseOptionalNumber(value: string): number | undefined {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function useEntriesListController(
  options: UseEntriesListControllerOptions,
): UseEntriesListControllerResult {
  const { collectionId, fetchEntries, fallbackErrorMessage, pageSize = 12 } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parsePage(searchParams.get('page'));
  const initialSortBy = parseSortBy(searchParams.get('sortBy'));
  const initialSortOrder = parseSortOrder(searchParams.get('sortOrder'));
  const initialStatus = parseStatus(searchParams.get('status'));
  const initialCreatedAtFrom = parseText(searchParams.get('createdAtFrom'));
  const initialCreatedAtTo = parseText(searchParams.get('createdAtTo'));
  const initialDateStartFrom = parseText(searchParams.get('dateStartFrom'));
  const initialDateStartTo = parseText(searchParams.get('dateStartTo'));
  const initialMinPrice = parseText(searchParams.get('minPrice'));
  const initialMaxPrice = parseText(searchParams.get('maxPrice'));
  const initialMinRating = parseText(searchParams.get('minRating'));
  const initialMaxRating = parseText(searchParams.get('maxRating'));

  const [entries, setEntries] = useState<EntryView[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortByState] = useState<EntrySortField>(initialSortBy);
  const [sortOrder, setSortOrderState] = useState<SortOrder>(initialSortOrder);
  const [status, setStatusState] = useState<EntryStatus | ''>(initialStatus);
  const [createdAtFromInput, setCreatedAtFromInput] = useState(initialCreatedAtFrom);
  const [createdAtToInput, setCreatedAtToInput] = useState(initialCreatedAtTo);
  const [dateStartFromInput, setDateStartFromInput] = useState(initialDateStartFrom);
  const [dateStartToInput, setDateStartToInput] = useState(initialDateStartTo);
  const [minPriceInput, setMinPriceInput] = useState(initialMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(initialMaxPrice);
  const [minRatingInput, setMinRatingInput] = useState(initialMinRating);
  const [maxRatingInput, setMaxRatingInput] = useState(initialMaxRating);
  const [createdAtFrom, setCreatedAtFrom] = useState(initialCreatedAtFrom);
  const [createdAtTo, setCreatedAtTo] = useState(initialCreatedAtTo);
  const [dateStartFrom, setDateStartFrom] = useState(initialDateStartFrom);
  const [dateStartTo, setDateStartTo] = useState(initialDateStartTo);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minRating, setMinRating] = useState(initialMinRating);
  const [maxRating, setMaxRating] = useState(initialMaxRating);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  useEffect(() => {
    const nextPage = parsePage(searchParams.get('page'));
    const nextSortBy = parseSortBy(searchParams.get('sortBy'));
    const nextSortOrder = parseSortOrder(searchParams.get('sortOrder'));
    const nextStatus = parseStatus(searchParams.get('status'));
    const nextCreatedAtFrom = parseText(searchParams.get('createdAtFrom'));
    const nextCreatedAtTo = parseText(searchParams.get('createdAtTo'));
    const nextDateStartFrom = parseText(searchParams.get('dateStartFrom'));
    const nextDateStartTo = parseText(searchParams.get('dateStartTo'));
    const nextMinPrice = parseText(searchParams.get('minPrice'));
    const nextMaxPrice = parseText(searchParams.get('maxPrice'));
    const nextMinRating = parseText(searchParams.get('minRating'));
    const nextMaxRating = parseText(searchParams.get('maxRating'));

    setPage((prev) => (prev === nextPage ? prev : nextPage));
    setSortByState((prev) => (prev === nextSortBy ? prev : nextSortBy));
    setSortOrderState((prev) => (prev === nextSortOrder ? prev : nextSortOrder));
    setStatusState((prev) => (prev === nextStatus ? prev : nextStatus));

    setCreatedAtFrom((prev) => (prev === nextCreatedAtFrom ? prev : nextCreatedAtFrom));
    setCreatedAtTo((prev) => (prev === nextCreatedAtTo ? prev : nextCreatedAtTo));
    setDateStartFrom((prev) => (prev === nextDateStartFrom ? prev : nextDateStartFrom));
    setDateStartTo((prev) => (prev === nextDateStartTo ? prev : nextDateStartTo));
    setMinPrice((prev) => (prev === nextMinPrice ? prev : nextMinPrice));
    setMaxPrice((prev) => (prev === nextMaxPrice ? prev : nextMaxPrice));
    setMinRating((prev) => (prev === nextMinRating ? prev : nextMinRating));
    setMaxRating((prev) => (prev === nextMaxRating ? prev : nextMaxRating));

    setCreatedAtFromInput((prev) => (prev === nextCreatedAtFrom ? prev : nextCreatedAtFrom));
    setCreatedAtToInput((prev) => (prev === nextCreatedAtTo ? prev : nextCreatedAtTo));
    setDateStartFromInput((prev) => (prev === nextDateStartFrom ? prev : nextDateStartFrom));
    setDateStartToInput((prev) => (prev === nextDateStartTo ? prev : nextDateStartTo));
    setMinPriceInput((prev) => (prev === nextMinPrice ? prev : nextMinPrice));
    setMaxPriceInput((prev) => (prev === nextMaxPrice ? prev : nextMaxPrice));
    setMinRatingInput((prev) => (prev === nextMinRating ? prev : nextMinRating));
    setMaxRatingInput((prev) => (prev === nextMaxRating ? prev : nextMaxRating));
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (page === DEFAULT_PAGE) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(page));
    }

    if (sortBy === DEFAULT_SORT_BY) {
      nextParams.delete('sortBy');
    } else {
      nextParams.set('sortBy', sortBy);
    }

    if (sortOrder === DEFAULT_SORT_ORDER) {
      nextParams.delete('sortOrder');
    } else {
      nextParams.set('sortOrder', sortOrder);
    }

    const syncValue = (key: string, value: string) => {
      if (!value) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    };

    syncValue('status', status);
    syncValue('createdAtFrom', createdAtFrom);
    syncValue('createdAtTo', createdAtTo);
    syncValue('dateStartFrom', dateStartFrom);
    syncValue('dateStartTo', dateStartTo);
    syncValue('minPrice', minPrice);
    syncValue('maxPrice', maxPrice);
    syncValue('minRating', minRating);
    syncValue('maxRating', maxRating);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  }, [
    createdAtFrom,
    createdAtTo,
    dateStartFrom,
    dateStartTo,
    maxPrice,
    maxRating,
    minPrice,
    minRating,
    page,
    searchParams,
    setSearchParams,
    sortBy,
    sortOrder,
    status,
  ]);

  const reloadEntries = useCallback(async () => {
    if (!collectionId) {
      setEntries([]);
      setMeta(null);
      setErrorMessage('Не удалось определить идентификатор коллекции.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchEntries(collectionId, {
        page,
        limit: pageSize,
        sortBy,
        sortOrder,
        status: status || undefined,
        createdAtFrom: createdAtFrom ? toIsoStartOfDay(createdAtFrom) : undefined,
        createdAtTo: createdAtTo ? toIsoEndOfDay(createdAtTo) : undefined,
        dateStartFrom: dateStartFrom ? toIsoStartOfDay(dateStartFrom) : undefined,
        dateStartTo: dateStartTo ? toIsoEndOfDay(dateStartTo) : undefined,
        minPrice: parseOptionalNumber(minPrice),
        maxPrice: parseOptionalNumber(maxPrice),
        minRating: parseOptionalNumber(minRating),
        maxRating: parseOptionalNumber(maxRating),
      });

      setEntries(result.items);
      setMeta(result.meta);
    } catch (error) {
      setEntries([]);
      setMeta(null);
      setErrorMessage(error instanceof Error ? error.message : fallbackErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    collectionId,
    createdAtFrom,
    createdAtTo,
    dateStartFrom,
    dateStartTo,
    fallbackErrorMessage,
    fetchEntries,
    maxPrice,
    maxRating,
    minPrice,
    minRating,
    page,
    pageSize,
    sortBy,
    sortOrder,
    status,
  ]);

  useEffect(() => {
    void reloadEntries();
  }, [reloadEntries]);

  function applyFilters(): void {
    setPage(1);
    setCreatedAtFrom(createdAtFromInput.trim());
    setCreatedAtTo(createdAtToInput.trim());
    setDateStartFrom(dateStartFromInput.trim());
    setDateStartTo(dateStartToInput.trim());
    setMinPrice(minPriceInput.trim());
    setMaxPrice(maxPriceInput.trim());
    setMinRating(minRatingInput.trim());
    setMaxRating(maxRatingInput.trim());
  }

  function resetFilters(): void {
    setStatusState('');
    setCreatedAtFromInput('');
    setCreatedAtToInput('');
    setDateStartFromInput('');
    setDateStartToInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setMinRatingInput('');
    setMaxRatingInput('');

    setCreatedAtFrom('');
    setCreatedAtTo('');
    setDateStartFrom('');
    setDateStartTo('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMaxRating('');
    setPage(1);
  }

  function setSortBy(value: EntrySortField): void {
    setSortByState(value);
    setPage(1);
  }

  function setSortOrder(value: SortOrder): void {
    setSortOrderState(value);
    setPage(1);
  }

  function setStatus(value: EntryStatus | ''): void {
    setStatusState(value);
    setPage(1);
  }

  function goToPreviousPage(): void {
    setPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextPage(): void {
    setPage((prev) => prev + 1);
  }

  return {
    entries,
    meta,
    hasActiveFilters,
    page,
    sortBy,
    sortOrder,
    status,
    createdAtFromInput,
    createdAtToInput,
    dateStartFromInput,
    dateStartToInput,
    minPriceInput,
    maxPriceInput,
    minRatingInput,
    maxRatingInput,
    isLoading,
    errorMessage,
    setSortBy,
    setSortOrder,
    setStatus,
    setCreatedAtFromInput,
    setCreatedAtToInput,
    setDateStartFromInput,
    setDateStartToInput,
    setMinPriceInput,
    setMaxPriceInput,
    setMinRatingInput,
    setMaxRatingInput,
    applyFilters,
    resetFilters,
    goToPreviousPage,
    goToNextPage,
    reloadEntries,
  };
}
