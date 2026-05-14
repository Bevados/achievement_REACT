import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CollectionsPage from './CollectionsPage';
import {
  createCollection,
  deleteCollection,
  getOwnerCollections,
  updateCollection,
} from '../../api/collections.api';

const reloadCollections = vi.fn(() => Promise.resolve());

vi.mock('../../api/collections.api', () => ({
  createCollection: vi.fn(),
  deleteCollection: vi.fn(),
  getOwnerCollections: vi.fn(),
  updateCollection: vi.fn(),
}));

vi.mock('../../hooks/useCollectionsListController', () => ({
  useCollectionsListController: () => ({
    collections: [
      {
        id: 'collection-1',
        ownerId: 'user-1',
        title: 'Поездки 2026',
        category: 'other',
        customCategory: 'Гастротуры',
        description: 'Лучшие маршруты.',
        isPublic: false,
        entriesCount: 3,
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T00:00:00.000Z',
      },
    ],
    meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
    page: 1,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    category: '',
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
const mockedDeleteCollection = vi.mocked(deleteCollection);
const mockedGetOwnerCollections = vi.mocked(getOwnerCollections);
const mockedUpdateCollection = vi.mocked(updateCollection);

function renderPage() {
  return render(
    <MemoryRouter>
      <CollectionsPage />
    </MemoryRouter>,
  );
}

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

    renderPage();

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

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));
    const dialog = screen.getByRole('dialog', { name: 'Новая коллекция' });
    const dialogQueries = within(dialog);

    await user.type(dialogQueries.getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.selectOptions(dialogQueries.getByLabelText('Категория'), 'other');
    await user.type(dialogQueries.getByLabelText('Своя категория'), 'Гастротуры');
    await user.click(dialogQueries.getByRole('button', { name: 'Сохранить коллекцию' }));

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
  });

  it('opens edit modal from collection card and submits update', async () => {
    const user = userEvent.setup();

    mockedUpdateCollection.mockResolvedValue({
      id: 'collection-1',
      ownerId: 'user-1',
      title: 'Обновленная коллекция',
      category: 'other',
      customCategory: 'Гастротуры',
      description: 'Лучшие маршруты.',
      coverImageUrl: undefined,
      isPublic: false,
      entriesCount: 3,
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    });

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Редактировать коллекцию Поездки 2026' }));
    expect(screen.getByRole('dialog', { name: 'Редактирование коллекции' })).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Название коллекции'));
    await user.type(screen.getByLabelText('Название коллекции'), 'Обновленная коллекция');
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }));

    await waitFor(() => {
      expect(mockedUpdateCollection).toHaveBeenCalledWith('collection-1', {
        title: 'Обновленная коллекция',
        category: 'other',
        customCategory: 'Гастротуры',
        description: 'Лучшие маршруты.',
        coverImageUrl: undefined,
      });
      expect(reloadCollections).toHaveBeenCalledTimes(1);
    });
  });

  it('deletes collection from collection card and reloads list', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockedDeleteCollection.mockResolvedValue(null);

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Удалить коллекцию Поездки 2026' }));

    await waitFor(() => {
      expect(mockedDeleteCollection).toHaveBeenCalledWith('collection-1');
      expect(reloadCollections).toHaveBeenCalledTimes(1);
    });
  });

  it('shows submit error inside create form', async () => {
    const user = userEvent.setup();

    mockedCreateCollection.mockRejectedValue(new Error('Коллекцию сохранить не удалось.'));

    renderPage();

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));
    const dialog = screen.getByRole('dialog', { name: 'Новая коллекция' });
    const dialogQueries = within(dialog);

    await user.type(dialogQueries.getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.selectOptions(dialogQueries.getByLabelText('Категория'), 'other');
    await user.type(dialogQueries.getByLabelText('Своя категория'), 'Гастротуры');
    await user.click(dialogQueries.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(await screen.findByText('Коллекцию сохранить не удалось.')).toBeInTheDocument();
    expect(reloadCollections).not.toHaveBeenCalled();
  });
});
