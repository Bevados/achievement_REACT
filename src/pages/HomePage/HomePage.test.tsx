import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

function renderHomePage(onCreateCollection = vi.fn()) {
  return render(
    <MemoryRouter>
      <HomePage onCreateCollection={onCreateCollection} />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('calls onCreateCollection when primary CTA is clicked', async () => {
    const user = userEvent.setup();
    const onCreateCollection = vi.fn();

    renderHomePage(onCreateCollection);

    await user.click(screen.getByRole('button', { name: 'Создать коллекцию' }));

    expect(onCreateCollection).toHaveBeenCalledTimes(1);
  });

  it('renders preview placeholders and desktop visual panel', () => {
    renderHomePage();

    expect(screen.getByRole('heading', { name: /Собирайте достижения/i })).toBeInTheDocument();
    expect(screen.getAllByTestId('preview-card')).toHaveLength(6);

    const visualPanel = screen.getByTestId('home-hero-visual');
    expect(visualPanel).toBeInTheDocument();
    expect(visualPanel.className).toContain('hidden');
    expect(visualPanel.className).toContain('lg:block');

    const examplesLink = screen.getByRole('link', { name: 'Посмотреть примеры' });
    expect(examplesLink).toHaveAttribute('href', '/examples');
  });
});
