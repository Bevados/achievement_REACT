import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

vi.mock('../ThemeToggle/ThemeToggle', () => ({
  // ThemeToggle не участвует в этих сценариях,
  // поэтому заменяем его легкой заглушкой для стабильности тестов.
  default: () => <div data-testid="theme-toggle" />,
}));

function renderHeader(props?: Partial<Parameters<typeof Header>[0]>) {
  return render(
    <MemoryRouter>
      <Header {...props} />
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('в режиме проверки сессии показывает loading-состояние и скрывает гостевые кнопки', () => {
    renderHeader({ isAuthResolving: true, user: { login: '', isAuthenticated: false } });

    // Пока Firebase проверяет сохраненную сессию, мы показываем скелетоны.
    // Это убирает визуальное "мигание" гостевого интерфейса.
    expect(screen.getByLabelText('Загрузка навигации')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Проверяем сессию').length).toBeGreaterThan(0);

    // Гостевые кнопки не должны быть видны в этом состоянии.
    expect(screen.queryByRole('button', { name: 'Вход' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Регистрация' })).not.toBeInTheDocument();
  });

  it('для гостя показывает публичную навигацию и кнопки входа/регистрации', () => {
    renderHeader({ isAuthResolving: false, user: { login: '', isAuthenticated: false } });

    // Публичная навигация должна содержать "Примеры коллекций".
    expect(screen.getAllByText('Примеры коллекций').length).toBeGreaterThan(0);

    // Для гостя должны быть кнопки входа и регистрации.
    expect(screen.getAllByRole('button', { name: 'Вход' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Регистрация' }).length).toBeGreaterThan(0);
  });

  it('для авторизованного пользователя показывает private-навигацию и приветствие', () => {
    renderHeader({
      isAuthResolving: false,
      user: { login: 'Alex', isAuthenticated: true },
    });

    // Приветствие должно использовать имя пользователя.
    expect(screen.getByText('Привет, Alex')).toBeInTheDocument();

    // В private-навигации есть "Мои коллекции".
    expect(screen.getAllByText('Мои коллекции').length).toBeGreaterThan(0);

    // А публичный пункт "Примеры коллекций" уже не должен отображаться.
    expect(screen.queryByText('Примеры коллекций')).not.toBeInTheDocument();
  });
});
