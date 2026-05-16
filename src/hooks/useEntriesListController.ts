import { useCallback, useEffect, useReducer, useState } from 'react';
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

export type EntriesQuery = Pick<
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

interface UseEntriesListStateResult {
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
  query: EntriesQuery;
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
}

interface EntriesListState {
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
  createdAtFrom: string;
  createdAtTo: string;
  dateStartFrom: string;
  dateStartTo: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  maxRating: string;
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

function createEntriesListState(searchParams: URLSearchParams): EntriesListState {
  const createdAtFrom = parseText(searchParams.get('createdAtFrom'));
  const createdAtTo = parseText(searchParams.get('createdAtTo'));
  const dateStartFrom = parseText(searchParams.get('dateStartFrom'));
  const dateStartTo = parseText(searchParams.get('dateStartTo'));
  const minPrice = parseText(searchParams.get('minPrice'));
  const maxPrice = parseText(searchParams.get('maxPrice'));
  const minRating = parseText(searchParams.get('minRating'));
  const maxRating = parseText(searchParams.get('maxRating'));

  return {
    page: parsePage(searchParams.get('page')),
    sortBy: parseSortBy(searchParams.get('sortBy')),
    sortOrder: parseSortOrder(searchParams.get('sortOrder')),
    status: parseStatus(searchParams.get('status')),
    createdAtFromInput: createdAtFrom,
    createdAtToInput: createdAtTo,
    dateStartFromInput: dateStartFrom,
    dateStartToInput: dateStartTo,
    minPriceInput: minPrice,
    maxPriceInput: maxPrice,
    minRatingInput: minRating,
    maxRatingInput: maxRating,
    createdAtFrom,
    createdAtTo,
    dateStartFrom,
    dateStartTo,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
  };
}

type EntriesListAction =
  | { type: 'sync_from_url'; payload: EntriesListState }
  | { type: 'set_sort_by'; value: EntrySortField }
  | { type: 'set_sort_order'; value: SortOrder }
  | { type: 'set_status'; value: EntryStatus | '' }
  | {
      type:
        | 'set_created_at_from_input'
        | 'set_created_at_to_input'
        | 'set_date_start_from_input'
        | 'set_date_start_to_input'
        | 'set_min_price_input'
        | 'set_max_price_input'
        | 'set_min_rating_input'
        | 'set_max_rating_input';
      value: string;
    }
  | { type: 'apply_filters' }
  | { type: 'reset_filters' }
  | { type: 'go_to_previous_page' }
  | { type: 'go_to_next_page' };

function entriesListReducer(state: EntriesListState, action: EntriesListAction): EntriesListState {
  switch (action.type) {
    case 'sync_from_url':
      return action.payload;
    case 'set_sort_by':
      return { ...state, sortBy: action.value, page: 1 };
    case 'set_sort_order':
      return { ...state, sortOrder: action.value, page: 1 };
    case 'set_status':
      return { ...state, status: action.value, page: 1 };
    case 'set_created_at_from_input':
      return { ...state, createdAtFromInput: action.value };
    case 'set_created_at_to_input':
      return { ...state, createdAtToInput: action.value };
    case 'set_date_start_from_input':
      return { ...state, dateStartFromInput: action.value };
    case 'set_date_start_to_input':
      return { ...state, dateStartToInput: action.value };
    case 'set_min_price_input':
      return { ...state, minPriceInput: action.value };
    case 'set_max_price_input':
      return { ...state, maxPriceInput: action.value };
    case 'set_min_rating_input':
      return { ...state, minRatingInput: action.value };
    case 'set_max_rating_input':
      return { ...state, maxRatingInput: action.value };
    case 'apply_filters':
      return {
        ...state,
        page: 1,
        createdAtFrom: state.createdAtFromInput.trim(),
        createdAtTo: state.createdAtToInput.trim(),
        dateStartFrom: state.dateStartFromInput.trim(),
        dateStartTo: state.dateStartToInput.trim(),
        minPrice: state.minPriceInput.trim(),
        maxPrice: state.maxPriceInput.trim(),
        minRating: state.minRatingInput.trim(),
        maxRating: state.maxRatingInput.trim(),
      };
    case 'reset_filters':
      return {
        ...state,
        page: 1,
        status: '',
        createdAtFromInput: '',
        createdAtToInput: '',
        dateStartFromInput: '',
        dateStartToInput: '',
        minPriceInput: '',
        maxPriceInput: '',
        minRatingInput: '',
        maxRatingInput: '',
        createdAtFrom: '',
        createdAtTo: '',
        dateStartFrom: '',
        dateStartTo: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        maxRating: '',
      };
    case 'go_to_previous_page':
      return { ...state, page: Math.max(1, state.page - 1) };
    case 'go_to_next_page':
      return { ...state, page: state.page + 1 };
    default:
      return state;
  }
}

export function useEntriesListState(pageSize = 12): UseEntriesListStateResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(entriesListReducer, searchParams, createEntriesListState);

  const hasActiveFilters = Boolean(
    state.status ||
      state.createdAtFrom ||
      state.createdAtTo ||
      state.dateStartFrom ||
      state.dateStartTo ||
      state.minPrice ||
      state.maxPrice ||
      state.minRating ||
      state.maxRating
  );

  useEffect(() => {
    dispatch({ type: 'sync_from_url', payload: createEntriesListState(searchParams) });
  }, [searchParams]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);

    if (state.page === DEFAULT_PAGE) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(state.page));
    }

    if (state.sortBy === DEFAULT_SORT_BY) {
      nextParams.delete('sortBy');
    } else {
      nextParams.set('sortBy', state.sortBy);
    }

    if (state.sortOrder === DEFAULT_SORT_ORDER) {
      nextParams.delete('sortOrder');
    } else {
      nextParams.set('sortOrder', state.sortOrder);
    }

    const syncValue = (key: string, value: string) => {
      if (!value) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    };

    syncValue('status', state.status);
    syncValue('createdAtFrom', state.createdAtFrom);
    syncValue('createdAtTo', state.createdAtTo);
    syncValue('dateStartFrom', state.dateStartFrom);
    syncValue('dateStartTo', state.dateStartTo);
    syncValue('minPrice', state.minPrice);
    syncValue('maxPrice', state.maxPrice);
    syncValue('minRating', state.minRating);
    syncValue('maxRating', state.maxRating);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams);
    }
  }, [searchParams, setSearchParams, state]);

  function applyFilters(): void {
    dispatch({ type: 'apply_filters' });
  }

  function resetFilters(): void {
    dispatch({ type: 'reset_filters' });
  }

  function setSortBy(value: EntrySortField): void {
    dispatch({ type: 'set_sort_by', value });
  }

  function setSortOrder(value: SortOrder): void {
    dispatch({ type: 'set_sort_order', value });
  }

  function setStatus(value: EntryStatus | ''): void {
    dispatch({ type: 'set_status', value });
  }

  function goToPreviousPage(): void {
    dispatch({ type: 'go_to_previous_page' });
  }

  function goToNextPage(): void {
    dispatch({ type: 'go_to_next_page' });
  }

  return {
    hasActiveFilters,
    page: state.page,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    status: state.status,
    createdAtFromInput: state.createdAtFromInput,
    createdAtToInput: state.createdAtToInput,
    dateStartFromInput: state.dateStartFromInput,
    dateStartToInput: state.dateStartToInput,
    minPriceInput: state.minPriceInput,
    maxPriceInput: state.maxPriceInput,
    minRatingInput: state.minRatingInput,
    maxRatingInput: state.maxRatingInput,
    query: {
      page: state.page,
      limit: pageSize,
      sortBy: state.sortBy,
      sortOrder: state.sortOrder,
      status: state.status || undefined,
      createdAtFrom: state.createdAtFrom ? toIsoStartOfDay(state.createdAtFrom) : undefined,
      createdAtTo: state.createdAtTo ? toIsoEndOfDay(state.createdAtTo) : undefined,
      dateStartFrom: state.dateStartFrom ? toIsoStartOfDay(state.dateStartFrom) : undefined,
      dateStartTo: state.dateStartTo ? toIsoEndOfDay(state.dateStartTo) : undefined,
      minPrice: parseOptionalNumber(state.minPrice),
      maxPrice: parseOptionalNumber(state.maxPrice),
      minRating: parseOptionalNumber(state.minRating),
      maxRating: parseOptionalNumber(state.maxRating),
    },
    setSortBy,
    setSortOrder,
    setStatus,
    setCreatedAtFromInput: (value) => {
      dispatch({ type: 'set_created_at_from_input', value });
    },
    setCreatedAtToInput: (value) => {
      dispatch({ type: 'set_created_at_to_input', value });
    },
    setDateStartFromInput: (value) => {
      dispatch({ type: 'set_date_start_from_input', value });
    },
    setDateStartToInput: (value) => {
      dispatch({ type: 'set_date_start_to_input', value });
    },
    setMinPriceInput: (value) => {
      dispatch({ type: 'set_min_price_input', value });
    },
    setMaxPriceInput: (value) => {
      dispatch({ type: 'set_max_price_input', value });
    },
    setMinRatingInput: (value) => {
      dispatch({ type: 'set_min_rating_input', value });
    },
    setMaxRatingInput: (value) => {
      dispatch({ type: 'set_max_rating_input', value });
    },
    applyFilters,
    resetFilters,
    goToPreviousPage,
    goToNextPage,
  };
}

export function useEntriesListController(
  options: UseEntriesListControllerOptions,
): UseEntriesListControllerResult {
  const { collectionId, fetchEntries, fallbackErrorMessage, pageSize = 12 } = options;
  const state = useEntriesListState(pageSize);
  const [entries, setEntries] = useState<EntryView[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const result = await fetchEntries(collectionId, state.query);
      setEntries(result.items);
      setMeta(result.meta);
    } catch (error) {
      setEntries([]);
      setMeta(null);
      setErrorMessage(error instanceof Error ? error.message : fallbackErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [collectionId, fallbackErrorMessage, fetchEntries, state.query]);

  useEffect(() => {
    void reloadEntries();
  }, [reloadEntries]);

  return {
    entries,
    meta,
    hasActiveFilters: state.hasActiveFilters,
    page: state.page,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    status: state.status,
    createdAtFromInput: state.createdAtFromInput,
    createdAtToInput: state.createdAtToInput,
    dateStartFromInput: state.dateStartFromInput,
    dateStartToInput: state.dateStartToInput,
    minPriceInput: state.minPriceInput,
    maxPriceInput: state.maxPriceInput,
    minRatingInput: state.minRatingInput,
    maxRatingInput: state.maxRatingInput,
    isLoading,
    errorMessage,
    setSortBy: state.setSortBy,
    setSortOrder: state.setSortOrder,
    setStatus: state.setStatus,
    setCreatedAtFromInput: state.setCreatedAtFromInput,
    setCreatedAtToInput: state.setCreatedAtToInput,
    setDateStartFromInput: state.setDateStartFromInput,
    setDateStartToInput: state.setDateStartToInput,
    setMinPriceInput: state.setMinPriceInput,
    setMaxPriceInput: state.setMaxPriceInput,
    setMinRatingInput: state.setMinRatingInput,
    setMaxRatingInput: state.setMaxRatingInput,
    applyFilters: state.applyFilters,
    resetFilters: state.resetFilters,
    goToPreviousPage: state.goToPreviousPage,
    goToNextPage: state.goToNextPage,
    reloadEntries,
  };
}
