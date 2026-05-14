import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { CollectionView } from '../../../contracts/collection.contracts';
import CollectionCard from './CollectionCard';

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
  it('renders core collection data and uses provided link target', () => {
    render(
      <MemoryRouter>
        <CollectionCard
          collection={{
            ...baseCollection,
            description: 'Описание коллекции.',
            coverImageUrl:
              'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1200&q=80',
          }}
          to="/examples/collection-1/testovaya-kollektsiya"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Тестовая коллекция')).toBeInTheDocument();
    expect(screen.getByText('Путешествия')).toBeInTheDocument();
    expect(screen.getByText('8 карточек')).toBeInTheDocument();
    expect(screen.getByText('Публичная')).toBeInTheDocument();
    expect(screen.getByText('Описание коллекции.')).toBeInTheDocument();
    expect(screen.getByText(/Создано:/)).toBeInTheDocument();
    expect(screen.getByText(/Обновлено:/)).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Обложка коллекции Тестовая коллекция' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Открыть коллекцию Тестовая коллекция' })).toHaveAttribute(
      'href',
      '/examples/collection-1/testovaya-kollektsiya',
    );
  });

  it('renders fallbacks when optional fields are missing', () => {
    render(
      <MemoryRouter>
        <CollectionCard
          collection={{
            ...baseCollection,
            description: undefined,
            coverImageUrl: undefined,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Описание пока не добавлено.')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders custom category label when collection uses other + customCategory', () => {
    render(
      <MemoryRouter>
        <CollectionCard
          collection={{
            ...baseCollection,
            category: 'other',
            customCategory: 'Гастротуры',
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Гастротуры')).toBeInTheDocument();
    expect(screen.queryByText('Другое')).not.toBeInTheDocument();
  });

  it('calls edit and delete callbacks when action buttons are shown', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <MemoryRouter>
        <CollectionCard collection={baseCollection} onEdit={onEdit} onDelete={onDelete} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Редактировать коллекцию Тестовая коллекция' }));
    await user.click(screen.getByRole('button', { name: 'Удалить коллекцию Тестовая коллекция' }));

    expect(onEdit).toHaveBeenCalledWith(baseCollection);
    expect(onDelete).toHaveBeenCalledWith(baseCollection);
  });
});
