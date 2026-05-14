import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/collections" element={<div>Список коллекций</div>} />
        <Route path="/collections/:collectionId" element={<CollectionDetailPage />} />
      </Routes>
    </MemoryRouter>,
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
      limit: 10,
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
    mockedGetCollectionEntries.mockRejectedValueOnce(new Error('Не удалось загрузить карточки.'));
    mockedGetCollectionById.mockResolvedValueOnce(makeCollection());
    mockedGetCollectionEntries.mockResolvedValueOnce(makeEntriesResult([]));

    renderPage();

    expect(await screen.findByText('Не удалось загрузить коллекцию.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Повторить загрузку' }));

    await waitFor(() => {
      expect(mockedGetCollectionById).toHaveBeenCalledTimes(2);
      expect(mockedGetCollectionEntries).toHaveBeenCalledTimes(2);
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
    expect(screen.getByRole('button', { name: 'Скрыть фильтры' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByLabelText('Статус')).toHaveValue('planned');
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
    expect(screen.getByRole('button', { name: 'Добавить карточку' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Редактировать коллекцию' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Удалить коллекцию' })).toBeEnabled();
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
    expect(screen.getByLabelText('Название коллекции')).toHaveValue('Моя коллекция');
    expect(screen.getByRole('button', { name: 'Сохранить изменения' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Редактирование коллекции' })).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Добавить карточку' }));
    expect(screen.getByRole('dialog', { name: 'Новая карточка' })).toBeInTheDocument();
    expect(screen.getByLabelText('Название карточки')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Сохранить карточку' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Новая карточка' })).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Редактировать' }));
    const entryDialog = screen.getByRole('dialog', { name: 'Редактирование карточки' });
    const entryDialogQueries = within(entryDialog);

    expect(entryDialog).toBeInTheDocument();
    expect(entryDialogQueries.getByLabelText('Название карточки')).toHaveValue('Токио');
    expect(entryDialogQueries.getByLabelText('Статус')).toHaveValue('completed');
    expect(entryDialogQueries.getByLabelText('Описание')).toHaveValue('Первый город в маршруте.');
    expect(entryDialogQueries.getByLabelText('Цена')).toHaveValue(24.5);
    expect(entryDialogQueries.getByLabelText('Рейтинг')).toHaveValue(9);
    expect(entryDialogQueries.getByLabelText('Теги')).toHaveValue('travel, japan');
    expect(entryDialogQueries.getByLabelText('Дата начала')).toHaveValue('2026-05-01');
    expect(entryDialogQueries.getByLabelText('Дата окончания')).toHaveValue('2026-05-03');
    expect(entryDialogQueries.getByRole('button', { name: 'Сохранить изменения' })).toBeEnabled();
  });

  it('submits collection edit form and updates detail card', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue(makeCollection());
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
      expect(mockedUpdateCollection).toHaveBeenCalledWith('collection-1', {
        title: 'Обновленная коллекция',
        category: 'travel',
        customCategory: undefined,
        description: 'Новое описание.',
        coverImageUrl: undefined,
      });
    });

    expect(screen.queryByRole('dialog', { name: 'Редактирование коллекции' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Обновленная коллекция' })).toBeInTheDocument();
    expect(screen.getByText('Новое описание.')).toBeInTheDocument();
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
    expect(screen.getByRole('dialog', { name: 'Редактирование коллекции' })).toBeInTheDocument();
  });

  it('deletes collection after confirmation and navigates back to list', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));
    mockedDeleteCollection.mockResolvedValue(null);

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить коллекцию' }));

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledWith(
        'Удалить коллекцию "Моя коллекция" вместе со всеми карточками? Это действие нельзя отменить.',
      );
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

  it('submits create entry form, reloads entries and updates count', async () => {
    const user = userEvent.setup();

    mockedGetCollectionById.mockResolvedValue(makeCollection());
    mockedGetCollectionEntries.mockResolvedValue(makeEntriesResult([]));
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
    expect(screen.getByText('1 карточек')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Добавить карточку' }));
    await user.type(screen.getByLabelText('Название карточки'), 'Kyoto');
    await user.click(screen.getByRole('button', { name: 'Сохранить карточку' }));

    await waitFor(() => {
      expect(mockedCreateEntry).toHaveBeenCalledWith('collection-1', {
        title: 'Kyoto',
        status: 'planned',
        description: undefined,
        imageUrl: undefined,
        price: undefined,
        tags: undefined,
        rating: undefined,
        dateStart: undefined,
        dateEnd: undefined,
      });
      expect(mockedGetCollectionEntries).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByRole('dialog', { name: 'Новая карточка' })).not.toBeInTheDocument();
    expect(screen.getByText('2 карточек')).toBeInTheDocument();
  });

  it('submits edit entry form and reloads entries', async () => {
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
      expect(mockedUpdateEntry).toHaveBeenCalledWith('collection-1', 'entry-1', {
        title: 'Osaka',
        status: 'planned',
        description: 'Обновленная карточка.',
        imageUrl: undefined,
        price: undefined,
        tags: undefined,
        rating: undefined,
        dateStart: undefined,
        dateEnd: undefined,
      });
      expect(mockedGetCollectionEntries).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByRole('dialog', { name: 'Редактирование карточки' })).not.toBeInTheDocument();
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
    expect(screen.getByRole('dialog', { name: 'Новая карточка' })).toBeInTheDocument();
  });

  it('deletes entry after confirmation, reloads list and updates count', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

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
    mockedDeleteEntry.mockResolvedValue(null);

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Моя коллекция' })).toBeInTheDocument();
    expect(screen.getByText('1 карточек')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalledWith(
        'Удалить карточку "Токио"? Это действие нельзя отменить.',
      );
      expect(mockedDeleteEntry).toHaveBeenCalledWith('collection-1', 'entry-1');
      expect(mockedGetCollectionEntries).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByText('0 карточек')).toBeInTheDocument();
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
