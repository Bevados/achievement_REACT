import { QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ExamplesPage from './ExamplesPage';
import { getPublicCollections } from '../../api/collections.api';
import { createAppQueryClient } from '../../lib/query-client';

vi.mock('../../api/collections.api', () => ({
  getPublicCollections: vi.fn(),
}));

const mockedGetPublicCollections = vi.mocked(getPublicCollections);

const RETRY_LABEL = '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0443';
const EMPTY_MESSAGE = '\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u043f\u0440\u0438\u043c\u0435\u0440\u044b \u043f\u043e\u043a\u0430 \u043e\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044e\u0442.';

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

describe('ExamplesPage states', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests public collections on load', async () => {
    mockedGetPublicCollections.mockResolvedValue({
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
      expect(mockedGetPublicCollections).toHaveBeenCalledWith({
        page: 1,
        limit: 12,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
        category: undefined,
        search: undefined,
      });
    });
  });

  it('retries after error', async () => {
    const user = userEvent.setup();

    mockedGetPublicCollections
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
      expect(mockedGetPublicCollections).toHaveBeenCalledTimes(2);
    });

    expect(await screen.findByText(EMPTY_MESSAGE)).toBeInTheDocument();
  });

  it('renders empty state', async () => {
    mockedGetPublicCollections.mockResolvedValue({
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

  it('renders success state', async () => {
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
    expect(screen.getByText(/\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430\s*1\s*\u0438\u0437\s*1/)).toBeInTheDocument();
  });
});
