import { QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ExamplesPage from './ExamplesPage';
import { getPublicCollections } from '../../api/collections.api';
import { createAppQueryClient } from '../../lib/query-client';

vi.mock('../../api/collections.api', () => ({
  getPublicCollections: vi.fn(),
}));

const mockedGetPublicCollections = vi.mocked(getPublicCollections);

function renderPage(initialPath = '/examples') {
  const queryClient = createAppQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <ExamplesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ExamplesPage smoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads public examples list', async () => {
    mockedGetPublicCollections.mockResolvedValue({
      items: [
        {
          id: 'collection-1',
          ownerId: 'system',
          title: 'Japan trip',
          description: 'Read-only example collection',
          category: 'travel',
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

    renderPage();

    expect(await screen.findByRole('link', { name: /Japan trip/i })).toHaveAttribute(
      'href',
      '/examples/collection-1/japan-trip',
    );
  });
});
