import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getPublicCollectionById, getPublicCollectionEntries } from '../../api/collections.api';
import PublicCollectionDetailPage from './PublicCollectionDetailPage';

vi.mock('../../api/collections.api', () => ({
  getPublicCollectionById: vi.fn(),
  getPublicCollectionEntries: vi.fn(),
}));

const mockedGetPublicCollectionById = vi.mocked(getPublicCollectionById);
const mockedGetPublicCollectionEntries = vi.mocked(getPublicCollectionEntries);

function renderPage(initialPath = '/examples/collection-1') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/examples/:collectionId" element={<PublicCollectionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('PublicCollectionDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    mockedGetPublicCollectionById.mockImplementation(
      () => new Promise(() => undefined) as ReturnType<typeof getPublicCollectionById>,
    );
    mockedGetPublicCollectionEntries.mockImplementation(
      () => new Promise(() => undefined) as ReturnType<typeof getPublicCollectionEntries>,
    );

    renderPage();

    expect(document.querySelector('[aria-live="polite"]')).not.toBeNull();
  });

  it('renders error state and retries loading', async () => {
    const user = userEvent.setup();

    mockedGetPublicCollectionById.mockRejectedValueOnce(new Error('Не удалось загрузить публичную коллекцию.'));
    mockedGetPublicCollectionEntries.mockRejectedValueOnce(new Error('Не удалось загрузить карточки.'));

    mockedGetPublicCollectionById.mockResolvedValueOnce({
      id: 'collection-1',
      ownerId: 'system_examples',
      title: 'Путешествия',
      category: 'travel',
      isPublic: true,
      entriesCount: 0,
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-02T08:00:00.000Z',
    });
    mockedGetPublicCollectionEntries.mockResolvedValueOnce({
      items: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    });

    renderPage();

    expect(await screen.findByText('Не удалось загрузить публичную коллекцию.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Повторить загрузку' }));

    await waitFor(() => {
      expect(mockedGetPublicCollectionById).toHaveBeenCalledTimes(2);
      expect(mockedGetPublicCollectionEntries).toHaveBeenCalledTimes(2);
    });
  });

  it('renders empty state for public entries', async () => {
    const user = userEvent.setup();

    mockedGetPublicCollectionById.mockResolvedValue({
      id: 'collection-1',
      ownerId: 'system_examples',
      title: 'Публичная коллекция',
      category: 'travel',
      isPublic: true,
      entriesCount: 0,
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-02T08:00:00.000Z',
    });
    mockedGetPublicCollectionEntries.mockResolvedValue({
      items: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
      },
    });

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Публичная коллекция' })).toBeInTheDocument();
    expect(screen.getByText('По выбранным фильтрам карточки не найдены.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    expect(screen.getByLabelText('Статус')).toBeInTheDocument();
  });

  it('renders success state without private actions', async () => {
    const user = userEvent.setup();

    mockedGetPublicCollectionById.mockResolvedValue({
      id: 'collection-1',
      ownerId: 'system_examples',
      title: 'Публичная коллекция',
      category: 'travel',
      description: 'Описание публичной коллекции.',
      isPublic: true,
      entriesCount: 1,
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-02T08:00:00.000Z',
    });
    mockedGetPublicCollectionEntries.mockResolvedValue({
      items: [
        {
          id: 'entry-1',
          collectionId: 'collection-1',
          ownerId: 'system_examples',
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

    expect(await screen.findByRole('heading', { name: 'Публичная коллекция' })).toBeInTheDocument();
    expect(screen.getByText('Токио')).toBeInTheDocument();
    expect(screen.getByText('Первый город в маршруте.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    expect(screen.getByLabelText('Сортировка')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Редактировать' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument();
  });
});
