import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CollectionsPage from './CollectionsPage';
import {
  createCollection,
  deleteCollection,
  getOwnerCollections,
  updateCollection,
} from '../../api/collections.api';
import { createAppQueryClient } from '../../lib/query-client';

vi.mock('../../api/collections.api', () => ({
  createCollection: vi.fn(),
  deleteCollection: vi.fn(),
  getOwnerCollections: vi.fn(),
  updateCollection: vi.fn(),
}));

const mockedCreateCollection = vi.mocked(createCollection);
const mockedDeleteCollection = vi.mocked(deleteCollection);
const mockedGetOwnerCollections = vi.mocked(getOwnerCollections);
const mockedUpdateCollection = vi.mocked(updateCollection);

function makeCollection() {
  return {
    id: 'collection-1',
    ownerId: 'user-1',
    title: 'Поездки 2026',
    category: 'other' as const,
    customCategory: 'Гастротуры',
    description: 'Лучшие маршруты.',
    isPublic: false,
    entriesCount: 3,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

function renderPage() {
  const queryClient = createAppQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CollectionsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('CollectionsPage smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetOwnerCollections.mockResolvedValue({
      items: [makeCollection()],
      meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
    });
  });

  it('loads collections list', async () => {
    renderPage();

    expect(await screen.findByText('Поездки 2026')).toBeInTheDocument();
    expect(mockedGetOwnerCollections).toHaveBeenCalled();
  });

  it('creates and updates collection', async () => {
    const user = userEvent.setup();

    mockedCreateCollection.mockResolvedValue({
      ...makeCollection(),
      id: 'collection-2',
      entriesCount: 0,
    });
    mockedUpdateCollection.mockResolvedValue({
      ...makeCollection(),
      title: 'Обновленная коллекция',
    });

    renderPage();
    expect(await screen.findByText('Поездки 2026')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));
    const createDialog = screen.getByRole('dialog', { name: 'Новая коллекция' });
    await user.type(within(createDialog).getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.selectOptions(within(createDialog).getByLabelText('Категория'), 'other');
    await user.type(within(createDialog).getByLabelText('Своя категория'), 'Гастротуры');
    await user.click(within(createDialog).getByRole('button', { name: 'Сохранить коллекцию' }));

    await waitFor(() => {
      expect(mockedCreateCollection).toHaveBeenCalled();
    });

    const card = screen.getByText('Поездки 2026').closest('.group');
    expect(card).not.toBeNull();
    await user.click(within(card as HTMLElement).getAllByRole('button')[0]);
    await user.clear(screen.getByLabelText('Название коллекции'));
    await user.type(screen.getByLabelText('Название коллекции'), 'Обновленная коллекция');
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }));

    await waitFor(() => {
      expect(mockedUpdateCollection).toHaveBeenCalledWith(
        'collection-1',
        expect.objectContaining({ title: 'Обновленная коллекция' }),
      );
    });
  });

  it('deletes collection from list', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockedDeleteCollection.mockResolvedValue(null);

    renderPage();
    const card = (await screen.findByText('Поездки 2026')).closest('.group');
    expect(card).not.toBeNull();

    await user.click(within(card as HTMLElement).getAllByRole('button')[1]);

    await waitFor(() => {
      expect(mockedDeleteCollection).toHaveBeenCalledWith('collection-1');
    });
  });
});
