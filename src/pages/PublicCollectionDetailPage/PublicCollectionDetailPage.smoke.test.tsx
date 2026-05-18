import { QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

function renderPage(initialPath = '/examples/collection-1/public-collection') {
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

describe('PublicCollectionDetailPage smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens public detail in read-only mode', async () => {
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

    renderPage();

    expect(await screen.findByRole('heading', { name: /Public collection/i })).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Редактировать/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Удалить/i })).not.toBeInTheDocument();
  });
});
