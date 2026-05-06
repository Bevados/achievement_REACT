import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import EntryCard from './EntryCard';
import type { EntryView } from '../../../contracts/collection.contracts';

const baseEntry: EntryView = {
  id: 'entry-1',
  collectionId: 'collection-1',
  ownerId: 'user-1',
  title: 'Первая поездка',
  status: 'completed',
  createdAt: '2026-05-01T08:00:00.000Z',
  updatedAt: '2026-05-02T10:00:00.000Z',
};

describe('EntryCard', () => {
  it('renders required fields', () => {
    render(<EntryCard entry={baseEntry} />);

    expect(screen.getByText('Первая поездка')).toBeInTheDocument();
    expect(screen.getByText('Завершено')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Редактировать' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Удалить' })).toBeDisabled();
  });

  it('renders optional fields when provided', () => {
    render(
      <EntryCard
        entry={{
          ...baseEntry,
          description: 'Описание карточки.',
          imageUrl: 'https://example.com/entry.jpg',
          price: 24.5,
          tags: ['travel', 'japan'],
          rating: 9,
          date: '2026-04-28T00:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByText('Описание карточки.')).toBeInTheDocument();
    expect(screen.getByText('Цена')).toBeInTheDocument();
    expect(screen.getByText('$24.50')).toBeInTheDocument();
    expect(screen.getByText('Оценка')).toBeInTheDocument();
    expect(screen.getByText('9 / 10')).toBeInTheDocument();
    expect(screen.getByText('#travel')).toBeInTheDocument();
    expect(screen.getByText('#japan')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Изображение карточки Первая поездка' })).toBeInTheDocument();
  });

  it('stays compact when optional fields are missing', () => {
    render(<EntryCard entry={baseEntry} />);

    expect(screen.queryByText('Цена')).not.toBeInTheDocument();
    expect(screen.queryByText('Оценка')).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
