import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EntriesPagination from './EntriesPagination';

describe('EntriesPagination', () => {
  it('renders current page and total', () => {
    render(
      <EntriesPagination
        meta={{ page: 2, limit: 12, total: 25, totalPages: 3 }}
        page={2}
        isLoading={false}
        onPreviousPage={vi.fn()}
        onNextPage={vi.fn()}
      />,
    );

    expect(screen.getByText(/Страница 2 из 3/)).toBeInTheDocument();
    expect(screen.getByText(/Всего карточек: 25/)).toBeInTheDocument();
  });

  it('triggers pagination handlers', async () => {
    const user = userEvent.setup();
    const onPreviousPage = vi.fn();
    const onNextPage = vi.fn();

    render(
      <EntriesPagination
        meta={{ page: 2, limit: 12, total: 25, totalPages: 3 }}
        page={2}
        isLoading={false}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Назад' }));
    await user.click(screen.getByRole('button', { name: 'Вперед' }));

    expect(onPreviousPage).toHaveBeenCalledTimes(1);
    expect(onNextPage).toHaveBeenCalledTimes(1);
  });
});
