import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EntryForm from './EntryForm';

describe('EntryForm', () => {
  it('renders create mode, updates fields and switches to range mode', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<EntryForm mode="create" onCancel={onCancel} />);

    fireEvent.change(screen.getByLabelText('Название карточки'), {
      target: { value: 'Tokyo trip' },
    });
    await user.selectOptions(screen.getByLabelText('Статус'), 'completed');
    fireEvent.change(screen.getByLabelText('Описание'), { target: { value: 'Form check.' } });
    fireEvent.change(screen.getByLabelText('Изображение (URL)'), {
      target: { value: 'https://example.com/tokyo.jpg' },
    });
    fireEvent.change(screen.getByLabelText('Цена'), { target: { value: '120' } });
    fireEvent.change(screen.getByLabelText('Рейтинг'), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText('Теги'), { target: { value: 'travel, japan' } });
    fireEvent.change(screen.getByLabelText('Дата'), { target: { value: '2026-05-12' } });

    expect(screen.getByLabelText('Название карточки')).toHaveValue('Tokyo trip');
    expect(screen.getByLabelText('Статус')).toHaveValue('completed');
    expect(screen.getByLabelText('Описание')).toHaveValue('Form check.');
    expect(screen.getByLabelText('Изображение (URL)')).toHaveValue('https://example.com/tokyo.jpg');
    expect(screen.getByLabelText('Цена')).toHaveValue(120);
    expect(screen.getByLabelText('Рейтинг')).toHaveValue(9);
    expect(screen.getByLabelText('Теги')).toHaveValue('travel, japan');
    expect(screen.getByLabelText('Дата')).toHaveValue('2026-05-12');
    expect(screen.getByRole('button', { name: 'Сохранить карточку' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Период' }));

    expect(screen.getByLabelText('Дата начала')).toHaveValue('2026-05-12');
    expect(screen.getByLabelText('Дата окончания')).toHaveValue('');
    expect(
      screen.getByText(/Сохранение карточки в API будет подключено/),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders edit mode with initial values and range dates', () => {
    render(
      <EntryForm
        mode="edit"
        initialValues={{
          title: 'Майский маршрут',
          status: 'in_progress',
          description: 'Тест редактирования.',
          imageUrl: 'https://example.com/may.jpg',
          price: '77.50',
          tags: 'travel, may',
          rating: '8',
          dateStart: '2026-05-01',
          dateEnd: '2026-05-07',
        }}
        onCancel={() => undefined}
      />,
    );

    expect(screen.getByLabelText('Название карточки')).toHaveValue('Майский маршрут');
    expect(screen.getByLabelText('Статус')).toHaveValue('in_progress');
    expect(screen.getByLabelText('Описание')).toHaveValue('Тест редактирования.');
    expect(screen.getByLabelText('Изображение (URL)')).toHaveValue('https://example.com/may.jpg');
    expect(screen.getByLabelText('Цена')).toHaveValue(77.5);
    expect(screen.getByLabelText('Рейтинг')).toHaveValue(8);
    expect(screen.getByLabelText('Теги')).toHaveValue('travel, may');
    expect(screen.getByLabelText('Дата начала')).toHaveValue('2026-05-01');
    expect(screen.getByLabelText('Дата окончания')).toHaveValue('2026-05-07');
    expect(screen.getByRole('button', { name: 'Сохранить изменения' })).toBeEnabled();
  });

  it('requires rating and date for completed status', async () => {
    const user = userEvent.setup();

    render(<EntryForm mode="create" onCancel={() => undefined} />);

    fireEvent.change(screen.getByLabelText('Название карточки'), {
      target: { value: 'Tokyo' },
    });
    await user.selectOptions(screen.getByLabelText('Статус'), 'completed');
    await user.click(screen.getByRole('button', { name: 'Сохранить карточку' }));

    expect(await screen.findByText('rating is required when status is completed')).toBeInTheDocument();
    expect(screen.getByText('dateStart is required when status is completed')).toBeInTheDocument();
  });

  it('validates date range and submits normalized payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<EntryForm mode="create" onCancel={() => undefined} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Название карточки'), {
      target: { value: 'Tokyo' },
    });
    await user.selectOptions(screen.getByLabelText('Статус'), 'completed');
    fireEvent.change(screen.getByLabelText('Цена'), { target: { value: '120.50' } });
    fireEvent.change(screen.getByLabelText('Рейтинг'), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText('Теги'), {
      target: { value: 'travel, japan, travel' },
    });
    await user.click(screen.getByRole('button', { name: 'Период' }));
    const dateStartInput = screen.getByLabelText('Дата начала');
    const dateEndInput = screen.getByLabelText('Дата окончания');

    fireEvent.change(dateStartInput, {
      target: { value: '2026-05-10' },
    });
    fireEvent.change(dateEndInput, {
      target: { value: '2026-05-05' },
    });
    await user.click(screen.getByRole('button', { name: 'Сохранить карточку' }));

    expect(
      await screen.findByText('dateEnd must be greater than or equal to dateStart'),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(dateEndInput, {
      target: { value: '2026-05-12' },
    });
    await user.click(screen.getByRole('button', { name: 'Сохранить карточку' }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Tokyo',
      status: 'completed',
      description: undefined,
      imageUrl: undefined,
      price: 120.5,
      tags: ['travel', 'japan'],
      rating: 9,
      dateStart: '2026-05-10T00:00:00.000Z',
      dateEnd: '2026-05-12T00:00:00.000Z',
    });
  });
});
