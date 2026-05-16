import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { useEntriesListController } from './useEntriesListController';

function createWrapper(initialPath = '/collections/collection-1') {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/collections/:collectionId/:collectionSlug?" element={children} />
        </Routes>
      </MemoryRouter>
    );
  };
}

describe('useEntriesListController', () => {
  it('loads entries with default query state', async () => {
    const fetchEntries = vi.fn().mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    });

    const { result } = renderHook(
      () =>
        useEntriesListController({
          collectionId: 'collection-1',
          fetchEntries,
          fallbackErrorMessage: 'Ошибка',
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(fetchEntries.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    expect(result.current.sortBy).toBe('updatedAt');
    expect(result.current.sortOrder).toBe('desc');
  });

  it('applies filters and resets page to first', async () => {
    const fetchEntries = vi.fn().mockResolvedValue({
      items: [],
      meta: { page: 1, limit: 12, total: 0, totalPages: 1 },
    });

    const { result } = renderHook(
      () =>
        useEntriesListController({
          collectionId: 'collection-1',
          fetchEntries,
          fallbackErrorMessage: 'Ошибка',
        }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(fetchEntries.mock.calls.length).toBeGreaterThanOrEqual(1);
    });

    act(() => {
      result.current.setMinRatingInput('7');
      result.current.setMaxRatingInput('9');
    });

    act(() => {
      result.current.applyFilters();
    });

    await waitFor(() => {
      expect(fetchEntries.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    expect(fetchEntries).toHaveBeenLastCalledWith(
      'collection-1',
      expect.objectContaining({
        minRating: 7,
        maxRating: 9,
      }),
    );
    expect(result.current.page).toBe(1);
  });
});
