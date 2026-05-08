import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EntriesFilters from './EntriesFilters';

describe('EntriesFilters', () => {
  const baseProps = {
    sortBy: 'updatedAt' as const,
    sortOrder: 'desc' as const,
    status: '' as const,
    createdAtFrom: '',
    createdAtTo: '',
    dateStartFrom: '',
    dateStartTo: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    maxRating: '',
    onSortByChange: vi.fn(),
    onSortOrderChange: vi.fn(),
    onStatusChange: vi.fn(),
    onCreatedAtFromChange: vi.fn(),
    onCreatedAtToChange: vi.fn(),
    onDateStartFromChange: vi.fn(),
    onDateStartToChange: vi.fn(),
    onMinPriceChange: vi.fn(),
    onMaxPriceChange: vi.fn(),
    onMinRatingChange: vi.fn(),
    onMaxRatingChange: vi.fn(),
    onApply: vi.fn(),
    onReset: vi.fn(),
  };

  it('renders all filter groups', () => {
    render(<EntriesFilters {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Показать фильтры' })).toBeInTheDocument();
  });

  it('opens and closes filter panel by button', async () => {
    const user = userEvent.setup();

    render(<EntriesFilters {...baseProps} />);

    expect(screen.queryByLabelText('Сортировка')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));

    expect(screen.getByLabelText('Сортировка')).toBeInTheDocument();
    expect(screen.getByLabelText('Порядок')).toBeInTheDocument();
    expect(screen.getByLabelText('Статус')).toBeInTheDocument();
    expect(screen.getByText('Дата создания')).toBeInTheDocument();
    expect(screen.getByText('Запланированная дата')).toBeInTheDocument();
    expect(screen.getByText('Цена')).toBeInTheDocument();
    expect(screen.getByText('Рейтинг')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Скрыть фильтры' }));

    expect(screen.queryByLabelText('Сортировка')).not.toBeInTheDocument();
  });

  it('submits filters through apply callback', async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(<EntriesFilters {...baseProps} onApply={onApply} />);

    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    await user.click(screen.getByRole('button', { name: 'Применить' }));

    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('resets filters through reset callback', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<EntriesFilters {...baseProps} onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: 'Показать фильтры' }));
    await user.click(screen.getByRole('button', { name: 'Сбросить' }));

    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
