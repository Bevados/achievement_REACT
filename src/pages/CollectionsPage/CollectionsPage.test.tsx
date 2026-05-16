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

describe('CollectionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetOwnerCollections.mockResolvedValue({
      items: [makeCollection()],
      meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
    });
  });

  it('opens create collection modal', async () => {
    const user = userEvent.setup();

    renderPage();
    expect(await screen.findByText('Поездки 2026')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));

    expect(screen.getByRole('dialog', { name: 'Новая коллекция' })).toBeInTheDocument();
    expect(screen.getByLabelText('Название коллекции')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сохранить коллекцию' })).toBeEnabled();
  });

  it('submits create form and invalidates collections query', async () => {
    const user = userEvent.setup();

    mockedCreateCollection.mockResolvedValue({
      ...makeCollection(),
      id: 'collection-2',
      entriesCount: 0,
    });

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Мои коллекции' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));
    const dialog = screen.getByRole('dialog', { name: 'Новая коллекция' });
    const dialogQueries = within(dialog);

    await user.type(dialogQueries.getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.selectOptions(dialogQueries.getByLabelText('Категория'), 'other');
    await user.type(dialogQueries.getByLabelText('Своя категория'), 'Гастротуры');
    await user.click(dialogQueries.getByRole('button', { name: 'Сохранить коллекцию' }));

    await waitFor(() => {
      expect(mockedCreateCollection.mock.calls[0]?.[0]).toEqual({
        title: 'Поездки 2026',
        category: 'other',
        customCategory: 'Гастротуры',
        description: undefined,
        coverImageUrl: undefined,
      });
    });

    await waitFor(() => {
      expect(mockedGetOwnerCollections.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('opens edit modal from collection card and submits update', async () => {
    const user = userEvent.setup();

    mockedUpdateCollection.mockResolvedValue({
      ...makeCollection(),
      title: 'Обновленная коллекция',
      updatedAt: '2026-05-02T00:00:00.000Z',
    });

    renderPage();
    const cardTitle = await screen.findByText('Поездки 2026');
    const card = cardTitle.closest('.group');
    expect(card).not.toBeNull();

    await user.click(within(card as HTMLElement).getAllByRole('button')[0]);
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
    });
  });

  it('deletes collection from collection card and invalidates list', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockedDeleteCollection.mockResolvedValue(null);

    renderPage();
    const cardTitle = await screen.findByText('Поездки 2026');
    const card = cardTitle.closest('.group');
    expect(card).not.toBeNull();

    await user.click(within(card as HTMLElement).getAllByRole('button')[1]);

    await waitFor(() => {
      expect(mockedDeleteCollection).toHaveBeenCalledWith('collection-1');
    });

    await waitFor(() => {
      expect(mockedGetOwnerCollections.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows submit error inside create form', async () => {
    const user = userEvent.setup();

    mockedCreateCollection.mockRejectedValue(new Error('Коллекцию сохранить не удалось.'));

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Мои коллекции' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));
    const dialog = screen.getByRole('dialog', { name: 'Новая коллекция' });
    const dialogQueries = within(dialog);

    await user.type(dialogQueries.getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.selectOptions(dialogQueries.getByLabelText('Категория'), 'other');
    await user.type(dialogQueries.getByLabelText('Своя категория'), 'Гастротуры');
    await user.click(dialogQueries.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(await screen.findByText('Коллекцию сохранить не удалось.')).toBeInTheDocument();
  });
});
