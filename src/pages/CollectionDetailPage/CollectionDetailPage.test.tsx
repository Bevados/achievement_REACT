import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
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
  updateCollection,
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
const mockedUpdateCollection = vi.mocked(updateCollection);
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
    mockedGetCollectionEntries.mockResolvedValueOnce(makeEntriesResult([]));
    mockedGetCollectionById.mockResolvedValueOnce(makeCollection());
    mockedGetCollectionEntries.mockResolvedValueOnce(makeEntriesResult([]));

    renderPage();

    expect(await screen.findByText('Не удалось загрузить коллекцию.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Повторить загрузку' }));

    await waitFor(() => {
      expect(mockedGetCollectionById).toHaveBeenCalledTimes(2);
    });
  });

  it('renders empty state for entries without active filters', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue(makeCollection({ entriesCount: 0 }));
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();
    expect(screen.getByText('Вы пока еще не создали ни одной карточки.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    expect(screen.getByLabelText('Статус')).toBeInTheDocument();
  });

  it('renders filtered empty state when active filters remove all entries', async () => {
    mockedGetCollectionById.mockResolvedValue(makeCollection({ entriesCount: 0 }));
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));

    renderPage('/collections/collection-1?status=planned');

    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();
    expect(screen.getByText('По выбранным фильтрам карточки не найдены.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Скрыть фильтры' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders success state with entries', async () => {
    const user = userEvent.setup();

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

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();
    expect(screen.getByText('Токио')).toBeInTheDocument();
    expect(screen.getByText('Первый город в маршруте.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    expect(screen.getByLabelText('Сортировка')).toBeInTheDocument();
  });

  it('opens collection and entry modals in private mode', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue(
      makeCollection({ coverImageUrl: 'https://example.com/cover.jpg' }),
    );
    mockedGetCollectionEntries.mockResolvedValue(
      makeEntriesResult([
        {
          id: 'entry-1',
          collectionId: 'collection-1',
          ownerId: 'user-1',
          title: 'Токио',
          status: 'completed',
          description: 'Первый город в маршруте.',
          price: 24.5,
          tags: ['travel', 'japan'],
          rating: 9,
          dateStart: '2026-05-01T00:00:00.000Z',
          dateEnd: '2026-05-03T00:00:00.000Z',
          createdAt: '2026-05-01T08:00:00.000Z',
          updatedAt: '2026-05-02T08:00:00.000Z',
        },
      ]),
    );

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Редактировать коллекцию' }));
    expect(screen.getByRole('dialog', { name: 'Редактирование коллекции' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    await user.click(screen.getByRole('button', { name: 'Добавить карточку' }));
    expect(screen.getByRole('dialog', { name: 'Новая карточка' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    await user.click(screen.getByRole('button', { name: 'Редактировать' }));
    const entryDialog = screen.getByRole('dialog', { name: 'Редактирование карточки' });
    const entryDialogQueries = within(entryDialog);
    expect(entryDialogQueries.getByLabelText('Название карточки')).toHaveValue('Токио');
    expect(entryDialogQueries.getByLabelText('Рейтинг')).toHaveValue(9);
  });

  it('submits collection edit form and refreshes detail query', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById
      .mockResolvedValueOnce(makeCollection())
      .mockResolvedValueOnce(
        makeCollection({
          title: 'Обновленная коллекция',
          description: 'Новое описание.',
          updatedAt: '2026-05-03T08:00:00.000Z',
        }),
      );
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));
    mockedUpdateCollection.mockResolvedValue(
      makeCollection({
        title: 'Обновленная коллекция',
        description: 'Новое описание.',
        updatedAt: '2026-05-03T08:00:00.000Z',
      }),
    );

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Редактировать коллекцию' }));
    await user.clear(screen.getByLabelText('Название коллекции'));
    await user.type(screen.getByLabelText('Название коллекции'), 'Обновленная коллекция');
    await user.clear(screen.getByLabelText('Описание'));
    await user.type(screen.getByLabelText('Описание'), 'Новое описание.');
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }));

    await waitFor(() => {
      expect(mockedUpdateCollection).toHaveBeenCalledWith('collection-1', expect.objectContaining({
        title: 'Обновленная коллекция',
        description: 'Новое описание.',
      }));
    });

    expect(await screen.findByRole('heading', { name: 'Обновленная коллекция' })).toBeInTheDocument();
  });

  it('shows collection submit error inside modal', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));
    mockedUpdateCollection.mockRejectedValue(new Error('Изменения сохранить не удалось.'));

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Редактировать коллекцию' }));
    await user.clear(screen.getByLabelText('Название коллекции'));
    await user.type(screen.getByLabelText('Название коллекции'), 'Обновленная коллекция');
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }));

    expect(await screen.findByText('Изменения сохранить не удалось.')).toBeInTheDocument();
  });

  it('deletes collection after confirmation and navigates back to list', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));
    mockedDeleteCollection.mockResolvedValue(null);

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить коллекцию' }));

    await waitFor(() => {
      expect(mockedDeleteCollection).toHaveBeenCalledWith('collection-1');
    });

    expect(await screen.findByText('Список коллекций')).toBeInTheDocument();
  });

  it('shows collection delete error when deletion fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));
    mockedDeleteCollection.mockRejectedValue(new Error('Удалить коллекцию не удалось.'));

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить коллекцию' }));

    expect(await screen.findByText('Удалить коллекцию не удалось.')).toBeInTheDocument();
  });

  it('submits create entry form and refreshes queries', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById
      .mockResolvedValueOnce(makeCollection())
      .mockResolvedValueOnce(makeCollection({ entriesCount: 2 }));
    mockedGetCollectionEntries
      .mockResolvedValueOnce(makeEntriesResult([]))
      .mockResolvedValueOnce(
        makeEntriesResult([
          {
            id: 'entry-2',
            collectionId: 'collection-1',
            ownerId: 'user-1',
            title: 'Kyoto',
            status: 'planned',
            createdAt: '2026-05-03T08:00:00.000Z',
            updatedAt: '2026-05-03T08:00:00.000Z',
          },
        ]),
      );
    mockedCreateEntry.mockResolvedValue({
      id: 'entry-2',
      collectionId: 'collection-1',
      ownerId: 'user-1',
      title: 'Kyoto',
      status: 'planned',
      createdAt: '2026-05-03T08:00:00.000Z',
      updatedAt: '2026-05-03T08:00:00.000Z',
    });

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Добавить карточку' }));
    await user.type(screen.getByLabelText('Название карточки'), 'Kyoto');
    await user.click(screen.getByRole('button', { name: 'Сохранить карточку' }));

    await waitFor(() => {
      expect(mockedCreateEntry).toHaveBeenCalledWith('collection-1', expect.objectContaining({
        title: 'Kyoto',
        status: 'planned',
      }));
    });

    expect(await screen.findByText('2 карточек')).toBeInTheDocument();
  });

  it('submits edit entry form and refreshes entries query', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries
      .mockResolvedValueOnce(
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
      )
      .mockResolvedValueOnce(
        makeEntriesResult([
          {
            id: 'entry-1',
            collectionId: 'collection-1',
            ownerId: 'user-1',
            title: 'Osaka',
            status: 'planned',
            description: 'Обновленная карточка.',
            createdAt: '2026-05-01T08:00:00.000Z',
            updatedAt: '2026-05-03T08:00:00.000Z',
          },
        ]),
      );
    mockedUpdateEntry.mockResolvedValue({
      id: 'entry-1',
      collectionId: 'collection-1',
      ownerId: 'user-1',
      title: 'Osaka',
      status: 'planned',
      description: 'Обновленная карточка.',
      createdAt: '2026-05-01T08:00:00.000Z',
      updatedAt: '2026-05-03T08:00:00.000Z',
    });

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Редактировать' }));
    await user.clear(screen.getByLabelText('Название карточки'));
    await user.type(screen.getByLabelText('Название карточки'), 'Osaka');
    await user.clear(screen.getByLabelText('Описание'));
    await user.type(screen.getByLabelText('Описание'), 'Обновленная карточка.');
    await user.click(screen.getByRole('button', { name: 'Сохранить изменения' }));

    await waitFor(() => {
      expect(mockedUpdateEntry).toHaveBeenCalledWith('collection-1', 'entry-1', expect.objectContaining({
        title: 'Osaka',
        description: 'Обновленная карточка.',
      }));
    });

    await waitFor(() => {
      expect(mockedGetCollectionEntries.mock.calls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows entry submit error inside modal', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));
    mockedCreateEntry.mockRejectedValue(new Error('Карточку сохранить не удалось.'));

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Добавить карточку' }));
    await user.type(screen.getByLabelText('Название карточки'), 'Kyoto');
    await user.click(screen.getByRole('button', { name: 'Сохранить карточку' }));

    expect(await screen.findByText('Карточку сохранить не удалось.')).toBeInTheDocument();
  });

  it('deletes entry after confirmation and refreshes queries', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockedGetCollectionById
      .mockResolvedValueOnce(makeCollection())
      .mockResolvedValueOnce(makeCollection({ entriesCount: 0 }));
    mockedGetCollectionEntries
      .mockResolvedValueOnce(
        makeEntriesResult([
          {
            id: 'entry-1',
            collectionId: 'collection-1',
            ownerId: 'user-1',
            title: 'Токио',
            status: 'planned',
            createdAt: '2026-05-01T08:00:00.000Z',
            updatedAt: '2026-05-02T08:00:00.000Z',
          },
        ]),
      )
      .mockResolvedValueOnce(makeEntriesResult([]));
    mockedDeleteEntry.mockResolvedValue(null);

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(mockedDeleteEntry).toHaveBeenCalledWith('collection-1', 'entry-1');
    });

    expect(await screen.findByText('0 карточек')).toBeInTheDocument();
  });

  it('shows entry delete error when deletion fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(
      makeEntriesResult([
        {
          id: 'entry-1',
          collectionId: 'collection-1',
          ownerId: 'user-1',
          title: 'Токио',
          status: 'planned',
          createdAt: '2026-05-01T08:00:00.000Z',
          updatedAt: '2026-05-02T08:00:00.000Z',
        },
      ]),
    );
    mockedDeleteEntry.mockRejectedValue(new Error('Удалить карточку не удалось.'));

    renderPage();
    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    expect(await screen.findByText('Удалить карточку не удалось.')).toBeInTheDocument();
  });
});
