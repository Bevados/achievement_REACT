import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

    await user.type(titleInput, 'Поездки 2026');
    await user.selectOptions(categorySelect, 'travel');

    expect(screen.queryByLabelText('Своя категория')).not.toBeInTheDocument();

    await user.selectOptions(categorySelect, 'other');
    await user.type(screen.getByLabelText('Своя категория'), 'Гастротуры');
    await user.type(descriptionInput, 'Коллекция маршрутов и стран.');
    await user.type(coverInput, 'https://example.com/cover.jpg');

    expect(titleInput).toHaveValue('Поездки 2026');
    expect(categorySelect).toHaveValue('other');
    expect(screen.getByLabelText('Своя категория')).toHaveValue('Гастротуры');
    expect(descriptionInput).toHaveValue('Коллекция маршрутов и стран.');
    expect(coverInput).toHaveValue('https://example.com/cover.jpg');
    expect(
      screen.getByRole('button', { name: 'Сохранить коллекцию' }),
    ).toBeEnabled();
    expect(
      screen.getByText(/Сохранение коллекции в API будет подключено/),
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

    await user.type(screen.getByLabelText('Название коллекции'), 'Нишевая коллекция');
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(await screen.findByText('Введите свою категорию')).toBeInTheDocument();
  });

  it('validates cover url and submits normalized values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CollectionForm mode="create" onCancel={() => undefined} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Название коллекции'), 'Поездки 2026');
    await user.selectOptions(screen.getByLabelText('Категория'), 'other');
    await user.type(screen.getByLabelText('Своя категория'), 'Гастротуры');
    await user.type(screen.getByLabelText('Обложка (URL)'), 'not-a-url');
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(await screen.findByText(/Invalid URL|Invalid input/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText(/Обложка \(URL\)/));
    await user.type(
      screen.getByLabelText(/Обложка \(URL\)/),
      'https://example.com/cover.jpg',
    );
    await user.click(screen.getByRole('button', { name: 'Сохранить коллекцию' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Поездки 2026',
      category: 'other',
      customCategory: 'Гастротуры',
      description: undefined,
      coverImageUrl: 'https://example.com/cover.jpg',
    });
  });
});
