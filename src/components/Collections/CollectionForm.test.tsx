import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionForm from './CollectionForm';

describe('CollectionForm', () => {
  it('renders create mode, updates fields and closes by cancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<CollectionForm mode="create" onCancel={onCancel} />);

    const titleInput = screen.getByLabelText('Название коллекции');
    const categorySelect = screen.getByLabelText('Категория');
    const descriptionInput = screen.getByLabelText('Описание');
    const coverInput = screen.getByLabelText('Обложка (URL)');

    fireEvent.change(titleInput, { target: { value: 'Trips' } });
    await user.selectOptions(categorySelect, 'travel');

    expect(screen.queryByLabelText('Своя категория')).not.toBeInTheDocument();

    await user.selectOptions(categorySelect, 'other');
    fireEvent.change(screen.getByLabelText('Своя категория'), {
      target: { value: 'Food tours' },
    });
    fireEvent.change(descriptionInput, { target: { value: 'Routes and places.' } });
    fireEvent.change(coverInput, { target: { value: 'https://example.com/cover.jpg' } });

    expect(titleInput).toHaveValue('Trips');
    expect(categorySelect).toHaveValue('other');
    expect(screen.getByLabelText('Своя категория')).toHaveValue('Food tours');
    expect(descriptionInput).toHaveValue('Routes and places.');
    expect(coverInput).toHaveValue('https://example.com/cover.jpg');
    expect(screen.getByRole('button', { name: 'Сохранить коллекцию' })).toBeEnabled();
    expect(
      screen.getByText(/Создание и редактирование коллекции уже подключены/),
    ).toBeInTheDocument();

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
          customCategory: '',
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
    expect(screen.getByRole('button', { name: 'Сохранить изменения' })).toBeEnabled();
  });

  it('requires custom category when other is selected', async () => {
    const user = userEvent.setup();

    render(<CollectionForm mode="create" onCancel={() => undefined} />);

    fireEvent.change(screen.getByLabelText('Название коллекции'), {
      target: { value: 'Нишевая коллекция' },
    });
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(await screen.findByText('Введите свою категорию')).toBeInTheDocument();
  });

  it('validates cover url and submits normalized values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CollectionForm mode="create" onCancel={() => undefined} onSubmit={onSubmit} />);

    const coverInput = screen.getByLabelText(/Обложка \(URL\)/);

    fireEvent.change(screen.getByLabelText('Название коллекции'), {
      target: { value: 'Trips 2026' },
    });
    await user.selectOptions(screen.getByLabelText('Категория'), 'other');
    fireEvent.change(screen.getByLabelText('Своя категория'), {
      target: { value: 'Food tours' },
    });
    fireEvent.change(coverInput, {
      target: { value: 'not-a-url' },
    });
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(await screen.findByText(/Invalid URL|Invalid input/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(coverInput, {
      target: { value: 'https://example.com/cover.jpg' },
    });
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Trips 2026',
      category: 'other',
      customCategory: 'Food tours',
      description: undefined,
      coverImageUrl: 'https://example.com/cover.jpg',
    });
  });
});
