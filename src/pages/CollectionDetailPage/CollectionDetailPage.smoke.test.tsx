import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CollectionDetailPage from './CollectionDetailPage';
import {
  createEntry,
  deleteCollection,
  deleteEntry,
  getCollectionById,
  getCollectionEntries,
  updateEntry,
} from '../../api/collections.api';
import { createAppQueryClient } from '../../lib/query-client';
import type { EntryView } from '../../../contracts/collection.contracts';

vi.mock('../../api/collections.api', () => ({
  createEntry: vi.fn(),
  deleteCollection: vi.fn(),
  deleteEntry: vi.fn(),
  getCollectionById: vi.fn(),
  getCollectionEntries: vi.fn(),
  updateCollection: vi.fn(),
  updateEntry: vi.fn(),
}));

const mockedCreateEntry = vi.mocked(createEntry);
const mockedDeleteCollection = vi.mocked(deleteCollection);
const mockedDeleteEntry = vi.mocked(deleteEntry);
const mockedGetCollectionById = vi.mocked(getCollectionById);
const mockedGetCollectionEntries = vi.mocked(getCollectionEntries);
const mockedUpdateEntry = vi.mocked(updateEntry);

function renderPage(initialPath = '/collections/collection-1') {
  const queryClient = createAppQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/collections" element={<div>Список коллекций</div>} />
          <Route path="/collections/:collectionId/:collectionSlug?" element={<CollectionDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function makeCollection(overrides: Partial<Awaited<ReturnType<typeof getCollectionById>>> = {}) {
  return {
    id: 'collection-1',
    ownerId: 'user-1',
    title: 'Моя коллекция',
    category: 'travel' as const,
    description: 'Описание коллекции.',
    isPublic: false,
    entriesCount: 1,
    createdAt: '2026-05-01T08:00:00.000Z',
    updatedAt: '2026-05-02T08:00:00.000Z',
    ...overrides,
  };
}

function makeEntriesResult(items: EntryView[]) {
  return {
    items,
    meta: {
      page: 1,
      limit: 12,
      total: items.length,
      totalPages: 1,
    },
  };
}

describe('CollectionDetailPage smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(
      makeEntriesResult([
        {
          id: 'entry-1',
          collectionId: 'collection-1',
          ownerId: 'user-1',
          title: 'Токио',
          status: 'planned',
          description: 'Первый город в маршруте.',
          createdAt: '2026-05-01T08:00:00.000Z',
          updatedAt: '2026-05-02T08:00:00.000Z',
        },
      ]),
    );
  });

  it('loads detail and supports filter UI', async () => {
    const user = userEvent.setup();

    renderPage('/collections/collection-1?status=planned');
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();
    expect(screen.getByText('Токио')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Скрыть фильтры' }));
    expect(screen.getByRole('button', { name: 'Показать фильтры' })).toBeInTheDocument();
  });

  it('creates, updates and deletes entry', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockedCreateEntry.mockResolvedValue({
      id: 'entry-2',
      collectionId: 'collection-1',
      ownerId: 'user-1',
      title: 'Kyoto',
      status: 'planned',
      createdAt: '2026-05-03T08:00:00.000Z',
      updatedAt: '2026-05-03T08:00:00.000Z',
    });
    mockedUpdateEntry.mockResolvedValue({
      id: 'entry-1',
      collectionId: 'collection-1',
      ownerId: 'user-1',
      title: 'Osaka',
      status: 'planned',
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-03T08:00:00.000Z',
    });
    mockedDeleteEntry.mockResolvedValue(null);
    mockedDeleteCollection.mockResolvedValue(null);

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Добавить карточку' }));
    await user.type(screen.getByLabelText('Название карточки'), 'Kyoto');
    await user.click(screen.getByRole('button', { name: 'Сохранить карточку' }));
    await waitFor(() => expect(mockedCreateEntry).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: 'Редактировать' }));
    await user.clear(screen.getByLabelText('Название карточки'));
    await user.type(screen.getByLabelText('Название карточки'), 'Osaka');
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }));
    await waitFor(() => expect(mockedUpdateEntry).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: 'Удалить' }));
    await waitFor(() => expect(mockedDeleteEntry).toHaveBeenCalledWith('collection-1', 'entry-1'));
  });
});
