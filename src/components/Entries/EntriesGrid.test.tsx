import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import EntriesGrid from './EntriesGrid';
import type { EntryView } from '../../../contracts/collection.contracts';

const entries: EntryView[] = [
  {
    id: 'entry-1',
    collectionId: 'collection-1',
    ownerId: 'user-1',
    title: 'Первая карточка',
    status: 'planned',
    createdAt: '2026-05-01T08:00:00.000Z',
    updatedAt: '2026-05-02T10:00:00.000Z',
  },
  {
    id: 'entry-2',
    collectionId: 'collection-1',
    ownerId: 'user-1',
    title: 'Вторая карточка',
    status: 'completed',
    rating: 8,
    dateStart: '2026-05-03T08:00:00.000Z',
    createdAt: '2026-05-03T08:00:00.000Z',
    updatedAt: '2026-05-04T10:00:00.000Z',
  },
];

describe('EntriesGrid', () => {
  it('renders empty state when entries are missing', () => {
    render(<EntriesGrid entries={[]} emptyMessage="Пока пусто" />);

    expect(screen.getByText('Пока пусто')).toBeInTheDocument();
  });

  it('renders cards in the same order as the source array', () => {
    render(<EntriesGrid entries={entries} emptyMessage="Пусто" />);

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Первая карточка',
      'Вторая карточка',
    ]);
  });

  it('keeps public read-only mode without action buttons', () => {
    render(<EntriesGrid entries={entries} emptyMessage="Пусто" showActions={false} />);

    expect(screen.queryByRole('button', { name: 'Редактировать' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Удалить' })).not.toBeInTheDocument();
  });
});
