import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

vi.mock('../ThemeToggle/ThemeToggle', () => ({
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
  it('shows loading state while auth is resolving', () => {
    renderHeader({ isAuthResolving: true, user: { login: '', isAuthenticated: false } });

    expect(screen.getByLabelText('Загрузка навигации')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Проверяем сессию').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Вход' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Регистрация' })).not.toBeInTheDocument();
  });

  it('shows public navigation for guests', () => {
    renderHeader({ isAuthResolving: false, user: { login: '', isAuthenticated: false } });

    expect(screen.getAllByText('Примеры коллекций').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Вход' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Регистрация' }).length).toBeGreaterThan(0);
  });

  it('shows greeting without collections nav for authenticated user', () => {
    renderHeader({
      isAuthResolving: false,
      user: { login: 'Alex', isAuthenticated: true },
    });

    expect(screen.getByText('Привет, Alex')).toBeInTheDocument();
    expect(screen.queryByText('Мои коллекции')).not.toBeInTheDocument();
    expect(screen.queryByText('Примеры коллекций')).not.toBeInTheDocument();
  });
});
