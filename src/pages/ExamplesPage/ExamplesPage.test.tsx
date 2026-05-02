import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExamplesPage from './ExamplesPage';
import type { CollectionView, PaginationMeta } from '../../../contracts/collection.contracts';
import { useCollectionsListController } from '../../hooks/useCollectionsListController';

vi.mock('../../hooks/useCollectionsListController', () => ({
  useCollectionsListController: vi.fn(),
}));

const mockedUseCollectionsListController = vi.mocked(useCollectionsListController);

const baseMeta: PaginationMeta = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1,
};

const baseControllerState = {
  collections: [] as CollectionView[],
  meta: baseMeta,
  page: 1,
  sortBy: 'updatedAt' as const,
  sortOrder: 'desc' as const,
  category: '' as const,
  searchInput: '',
  isLoading: false,
  errorMessage: null as string | null,
  setSortBy: vi.fn(),
  setSortOrder: vi.fn(),
  setCategory: vi.fn(),
  setSearchInput: vi.fn(),
  applySearch: vi.fn(),
  resetFilters: vi.fn(),
  goToPreviousPage: vi.fn(),
  goToNextPage: vi.fn(),
  reloadCollections: vi.fn().mockResolvedValue(undefined),
};

describe('ExamplesPage states', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockedUseCollectionsListController.mockReturnValue({
      ...baseControllerState,
      isLoading: true,
    });

    render(<ExamplesPage />);

    expect(screen.getByRole('heading', { name: 'Примеры коллекций' })).toBeInTheDocument();
    expect(document.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('renders error state and retries loading', async () => {
    const user = userEvent.setup();
    const reloadCollections = vi.fn().mockResolvedValue(undefined);

    mockedUseCollectionsListController.mockReturnValue({
      ...baseControllerState,
      errorMessage: 'Не удалось загрузить публичные коллекции.',
      reloadCollections,
    });

    render(<ExamplesPage />);

    expect(screen.getByText('Не удалось загрузить публичные коллекции.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Повторить загрузку' }));
    expect(reloadCollections).toHaveBeenCalledTimes(1);
  });

  it('renders empty state', () => {
    mockedUseCollectionsListController.mockReturnValue({
      ...baseControllerState,
      collections: [],
      errorMessage: null,
      isLoading: false,
    });

    render(<ExamplesPage />);

    expect(screen.getByText('Публичные примеры пока отсутствуют.')).toBeInTheDocument();
  });

  it('renders success state', () => {
    mockedUseCollectionsListController.mockReturnValue({
      ...baseControllerState,
      collections: [
        {
          id: 'collection-1',
          ownerId: 'system_examples',
          title: 'Путешествие по Японии',
          category: 'travel',
          description: 'Маршрут и планы по городам.',
          coverImageUrl: undefined,
          isPublic: true,
          entriesCount: 14,
          createdAt: '2026-04-12T09:00:00.000Z',
          updatedAt: '2026-04-15T10:00:00.000Z',
        },
      ],
      meta: {
        page: 1,
        limit: 12,
        total: 1,
        totalPages: 1,
      },
    });

    render(<ExamplesPage />);

    expect(screen.getByText('Путешествие по Японии')).toBeInTheDocument();
    expect(screen.getByText(/Страница 1 из 1/)).toBeInTheDocument();
  });
});
