import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionForm from './CollectionForm';

describe('CollectionForm', () => {
  it('renders create mode and updates fields', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<CollectionForm mode="create" onCancel={onCancel} />);

    const titleInput = screen.getByLabelText('Название коллекции');
    const categorySelect = screen.getByLabelText('Категория');
    const descriptionInput = screen.getByLabelText('Описание');
    const coverInput = screen.getByLabelText('Обложка (URL)');

    await user.type(titleInput, 'Поездки 2026');
    await user.selectOptions(categorySelect, 'travel');
    await user.type(descriptionInput, 'Коллекция маршрутов и стран.');
    await user.type(coverInput, 'https://example.com/cover.jpg');

    expect(titleInput).toHaveValue('Поездки 2026');
    expect(categorySelect).toHaveValue('travel');
    expect(descriptionInput).toHaveValue('Коллекция маршрутов и стран.');
    expect(coverInput).toHaveValue('https://example.com/cover.jpg');
    expect(screen.getByRole('button', { name: 'Сохранить коллекцию' })).toBeDisabled();
    expect(screen.getByText(/Сохранение коллекции будет подключено/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders edit mode with initial values', () => {
    render(
      <CollectionForm
        mode="edit"
        initialValues={{
          title: 'Избранные рестораны',
          category: 'shopping',
          description: 'Лучшие места для ужина.',
          coverImageUrl: 'https://example.com/food.jpg',
        }}
        onCancel={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Название коллекции')).toHaveValue('Избранные рестораны');
    expect(screen.getByLabelText('Категория')).toHaveValue('shopping');
    expect(screen.getByLabelText('Описание')).toHaveValue('Лучшие места для ужина.');
    expect(screen.getByLabelText('Обложка (URL)')).toHaveValue('https://example.com/food.jpg');
    expect(screen.getByRole('button', { name: 'Сохранить изменения' })).toBeDisabled();
  });
});
