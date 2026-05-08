import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CollectionDetailPage from './CollectionDetailPage';
import { getCollectionById, getCollectionEntries } from '../../api/collections.api';

vi.mock('../../api/collections.api', () => ({
  getCollectionById: vi.fn(),
  getCollectionEntries: vi.fn(),
}));

const mockedGetCollectionById = vi.mocked(getCollectionById);
const mockedGetCollectionEntries = vi.mocked(getCollectionEntries);

function renderPage(initialPath = '/collections/collection-1') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/collections/:collectionId" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('CollectionDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockedGetCollectionById.mockImplementation(
      () => new Promise(() => undefined) as ReturnType<typeof getCollectionById>,
    );
    mockedGetCollectionEntries.mockImplementation(
      () => new Promise(() => undefined) as ReturnType<typeof getCollectionEntries>,
    );

    renderPage();

    expect(document.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('renders error state and retries loading', async () => {
    const user = userEvent.setup();
    mockedGetCollectionById.mockRejectedValueOnce(new Error('Не удалось загрузить коллекцию.'));
    mockedGetCollectionEntries.mockRejectedValueOnce(new Error('Не удалось загрузить карточки.'));
    mockedGetCollectionById.mockResolvedValueOnce({
      id: 'collection-1',
      ownerId: 'user-1',
      title: 'Путешествия',
      category: 'travel',
      isPublic: false,
      entriesCount: 0,
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-02T08:00:00.000Z',
    });
    mockedGetCollectionEntries.mockResolvedValueOnce({
      items: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    });

    renderPage();

    expect(await screen.findByText('Не удалось загрузить коллекцию.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Повторить загрузку' }));

    await waitFor(() => {
      expect(mockedGetCollectionById).toHaveBeenCalledTimes(2);
      expect(mockedGetCollectionEntries).toHaveBeenCalledTimes(2);
    });
  });

  it('renders empty state for entries', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue({
      id: 'collection-1',
      ownerId: 'user-1',
      title: 'Моя коллекция',
      category: 'travel',
      isPublic: false,
      entriesCount: 0,
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-02T08:00:00.000Z',
    });
    mockedGetCollectionEntries.mockResolvedValue({
      items: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();
    expect(screen.getByText('По выбранным фильтрам карточки не найдены.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    expect(screen.getByLabelText('Статус')).toBeInTheDocument();
  });

  it('renders success state with entries', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue({
      id: 'collection-1',
      ownerId: 'user-1',
      title: 'Моя коллекция',
      category: 'travel',
      description: 'Описание коллекции.',
      isPublic: false,
      entriesCount: 1,
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-02T08:00:00.000Z',
    });
    mockedGetCollectionEntries.mockResolvedValue({
      items: [
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
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();
    expect(screen.getByText('Токио')).toBeInTheDocument();
    expect(screen.getByText('Первый город в маршруте.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    expect(screen.getByLabelText('Сортировка')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить карточку' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Редактировать коллекцию' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Удалить коллекцию' })).toBeDisabled();
  });
});
