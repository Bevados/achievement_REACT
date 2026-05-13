import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionsPage from './CollectionsPage';
import { createCollection, getOwnerCollections } from '../../api/collections.api';

const reloadCollections = vi.fn(() => Promise.resolve());

vi.mock('../../api/collections.api', () => ({
  createCollection: vi.fn(),
  getOwnerCollections: vi.fn(),
}));

vi.mock('../../hooks/useCollectionsListController', () => ({
  useCollectionsListController: () => ({
    collections: [],
    meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    page: 1,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    category: 'all',
    searchInput: '',
    isLoading: false,
    errorMessage: null,
    setSortBy: () => undefined,
    setSortOrder: () => undefined,
    setCategory: () => undefined,
    setSearchInput: () => undefined,
    applySearch: () => undefined,
    resetFilters: () => undefined,
    goToPreviousPage: () => undefined,
    goToNextPage: () => undefined,
    reloadCollections,
  }),
}));

const mockedCreateCollection = vi.mocked(createCollection);
const mockedGetOwnerCollections = vi.mocked(getOwnerCollections);

describe('CollectionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reloadCollections.mockClear();
    mockedGetOwnerCollections.mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    });
  });

  it('opens create collection modal', async () => {
    const user = userEvent.setup();

    render(<CollectionsPage />);

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));

    expect(screen.getByRole('dialog', { name: 'Новая коллекция' })).toBeInTheDocument();
    expect(screen.getByLabelText('Название коллекции')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сохранить коллекцию' })).toBeEnabled();
  });

  it('submits create form and reloads collections', async () => {
    const user = userEvent.setup();

    mockedCreateCollection.mockResolvedValue({
      id: 'collection-1',
      ownerId: 'user-1',
      title: 'Поездки 2026',
      category: 'other',
      customCategory: 'Гастротуры',
      description: undefined,
      coverImageUrl: undefined,
      isPublic: false,
      entriesCount: 0,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-01T00:00:00.000Z',
    });

    render(<CollectionsPage />);

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));
    await user.type(screen.getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.type(screen.getByLabelText('Своя категория'), 'Гастротуры');
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    await waitFor(() => {
      expect(mockedCreateCollection).toHaveBeenCalledWith({
        title: 'Поездки 2026',
        category: 'other',
        customCategory: 'Гастротуры',
        description: undefined,
        coverImageUrl: undefined,
      });
      expect(reloadCollections).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByRole('dialog', { name: 'Новая коллекция' })).not.toBeInTheDocument();
  });

  it('shows submit error inside create form', async () => {
    const user = userEvent.setup();

    mockedCreateCollection.mockRejectedValue(new Error('Коллекцию сохранить не удалось.'));

    render(<CollectionsPage />);

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));
    await user.type(screen.getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.type(screen.getByLabelText('Своя категория'), 'Гастротуры');
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(await screen.findByText('Коллекцию сохранить не удалось.')).toBeInTheDocument();
    expect(reloadCollections).not.toHaveBeenCalled();
  });
});
