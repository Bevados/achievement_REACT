import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CollectionCard from './CollectionCard';
import type { CollectionView } from '../../../contracts/collection.contracts';

const baseCollection: CollectionView = {
  id: 'collection-1',
  ownerId: 'system_examples',
  title: 'Тестовая коллекция',
  category: 'travel',
  isPublic: true,
  entriesCount: 8,
  createdAt: '2026-04-10T08:00:00.000Z',
  updatedAt: '2026-04-12T08:00:00.000Z',
};

describe('CollectionCard', () => {
  it('renders core collection data', () => {
    render(
      <CollectionCard
        collection={{
          ...baseCollection,
          description: 'Описание коллекции.',
          coverImageUrl:
            'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80',
        }}
      />,
    );

    expect(screen.getByText('Тестовая коллекция')).toBeInTheDocument();
    expect(screen.getByText('Путешествия')).toBeInTheDocument();
    expect(screen.getByText('8 карточек')).toBeInTheDocument();
    expect(screen.getByText('Публичная')).toBeInTheDocument();
    expect(screen.getByText('Описание коллекции.')).toBeInTheDocument();
    expect(screen.getByText(/Обновлено:/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Обложка коллекции Тестовая коллекция' }),
    ).toBeInTheDocument();
  });

  it('renders fallbacks when optional fields are missing', () => {
    render(
      <CollectionCard
        collection={{
          ...baseCollection,
          description: undefined,
          coverImageUrl: undefined,
        }}
      />,
    );

    expect(screen.getByText('Описание пока не добавлено.')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
