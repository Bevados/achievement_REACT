import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionsPage from './CollectionsPage';

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
    reloadCollections: () => Promise.resolve(),
  }),
}));

describe('CollectionsPage', () => {
  it('opens create collection modal', async () => {
    const user = userEvent.setup();

    render(<CollectionsPage />);

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));

    expect(screen.getByRole('dialog', { name: 'Новая коллекция' })).toBeInTheDocument();
    expect(screen.getByLabelText('Название коллекции')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сохранить коллекцию' })).toBeEnabled();
  });
});
