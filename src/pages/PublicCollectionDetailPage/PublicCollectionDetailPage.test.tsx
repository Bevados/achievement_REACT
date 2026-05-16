import { QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getPublicCollectionById, getPublicCollectionEntries } from '../../api/collections.api';
import { createAppQueryClient } from '../../lib/query-client';
import PublicCollectionDetailPage from './PublicCollectionDetailPage';

vi.mock('../../api/collections.api', () => ({
  getPublicCollectionById: vi.fn(),
  getPublicCollectionEntries: vi.fn(),
}));

const mockedGetPublicCollectionById = vi.mocked(getPublicCollectionById);
const mockedGetPublicCollectionEntries = vi.mocked(getPublicCollectionEntries);

const RETRY_LABEL = '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0443';
const EMPTY_MESSAGE = '\u0412 \u044d\u0442\u043e\u0439 \u043a\u043e\u043b\u043b\u0435\u043a\u0446\u0438\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a.';
const FILTERED_EMPTY_MESSAGE =
  '\u041f\u043e \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u043c \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.';

function renderPage(initialPath = '/examples/collection-1') {
  const queryClient = createAppQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/examples/:collectionId/:collectionSlug?" element={<PublicCollectionDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function makeCollection() {
  return {
    id: 'collection-1',
    ownerId: 'system',
    title: 'Public collection',
    description: 'Read-only example collection',
    category: 'travel' as const,
    isPublic: true,
    entriesCount: 1,
    createdAt: '2026-04-12T09:00:00.000Z',
    updatedAt: '2026-04-15T10:00:00.000Z',
  };
}

describe('PublicCollectionDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests detail and entries on load', async () => {
    mockedGetPublicCollectionById.mockResolvedValue(makeCollection());
    mockedGetPublicCollectionEntries.mockResolvedValue({
      items: [],
      meta: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1,
      },
    });

    renderPage();

    await waitFor(() => {
      expect(mockedGetPublicCollectionById).toHaveBeenCalledWith('collection-1');
      expect(mockedGetPublicCollectionEntries).toHaveBeenCalledWith('collection-1', {
        page: 1,
        limit: 12,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
        status: undefined,
        createdAtFrom: undefined,
        createdAtTo: undefined,
        dateStartFrom: undefined,
        dateStartTo: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        minRating: undefined,
        maxRating: undefined,
      });
    });
  });

  it('retries after error', async () => {
    const user = userEvent.setup();

    mockedGetPublicCollectionById.mockRejectedValueOnce(new Error('boom')).mockResolvedValueOnce(makeCollection());
    mockedGetPublicCollectionEntries
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({
        items: [],
        meta: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 1,
        },
      });

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('boom');

    await user.click(screen.getByRole('button', { name: RETRY_LABEL }));

    await waitFor(() => {
      expect(mockedGetPublicCollectionById).toHaveBeenCalledTimes(2);
      expect(mockedGetPublicCollectionEntries).toHaveBeenCalledTimes(2);
    });
  });

  it('renders empty state without filters', async () => {
    mockedGetPublicCollectionById.mockResolvedValue(makeCollection());
    mockedGetPublicCollectionEntries.mockResolvedValue({
      items: [],
      meta: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1,
      },
    });

    renderPage();

    expect(await screen.findByText(EMPTY_MESSAGE)).toBeInTheDocument();
  });

  it('renders filtered empty state', async () => {
    mockedGetPublicCollectionById.mockResolvedValue(makeCollection());
    mockedGetPublicCollectionEntries.mockResolvedValue({
      items: [],
      meta: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1,
      },
    });

    renderPage('/examples/collection-1/public-collection?status=completed');

    expect(await screen.findByText(FILTERED_EMPTY_MESSAGE)).toBeInTheDocument();
  });

  it('renders success state without private actions', async () => {
    mockedGetPublicCollectionById.mockResolvedValue(makeCollection());
    mockedGetPublicCollectionEntries.mockResolvedValue({
      items: [
        {
          id: 'entry-1',
          collectionId: 'collection-1',
          ownerId: 'system',
          title: 'Tokyo',
          description: 'First city on the route.',
          status: 'completed',
          rating: 8,
          tags: ['city'],
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

    renderPage('/examples/collection-1/public-collection');

    expect(await screen.findByRole('heading', { name: /Public collection/i })).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.getByText('First city on the route.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /\u0423\u0434\u0430\u043b\u0438\u0442\u044c/i })).not.toBeInTheDocument();
  });
});
