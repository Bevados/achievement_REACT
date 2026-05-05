import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

const storeMocks = vi.hoisted(() => ({
  login: vi.fn(),
  clearError: vi.fn(),
  error: null as string | null,
}));

vi.mock('../../store/auth.store', () => ({
  // РРјРёС‚РёСЂСѓРµРј РїРѕРІРµРґРµРЅРёРµ useAuthStore(selector).
  // РљРѕРјРїРѕРЅРµРЅС‚ РїСЂРѕСЃРёС‚ РєСѓСЃРѕРє СЃС‚РѕСЂР° С‡РµСЂРµР· selector,
  // Р° РјС‹ РІРѕР·РІСЂР°С‰Р°РµРј РґР°РЅРЅС‹Рµ РёР· РєРѕРЅС‚СЂРѕР»РёСЂСѓРµРјРѕРіРѕ РјРѕРє-РѕР±СЉРµРєС‚Р°.
  useAuthStore: (selector: (state: typeof storeMocks) => unknown) => selector(storeMocks),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeMocks.error = null;
    storeMocks.login.mockResolvedValue(undefined);
  });

  it('РїРѕРєР°Р·С‹РІР°РµС‚ РѕС€РёР±РєСѓ РІР°Р»РёРґР°С†РёРё РґР»СЏ РєРѕСЂРѕС‚РєРѕРіРѕ РїР°СЂРѕР»СЏ Рё РЅРµ РІС‹Р·С‹РІР°РµС‚ login', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSuccess={vi.fn()} onSwitchToRegister={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('********'), '123');

    await user.click(screen.getByRole('button', { name: 'Р’РѕР№С‚Рё' }));

    expect(
      await screen.findByText('РџР°СЂРѕР»СЊ РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РЅРµ РєРѕСЂРѕС‡Рµ 6 СЃРёРјРІРѕР»РѕРІ'),
    ).toBeInTheDocument();
    expect(storeMocks.login).not.toHaveBeenCalled();
  });

  it('СѓСЃРїРµС€РЅРѕ РѕС‚РїСЂР°РІР»СЏРµС‚ email/password Рё РІС‹Р·С‹РІР°РµС‚ onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<LoginForm onSuccess={onSuccess} onSwitchToRegister={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('********'), 'secret123');

    await user.click(screen.getByRole('button', { name: 'Р’РѕР№С‚Рё' }));

    await waitFor(() => {
      expect(storeMocks.login).toHaveBeenCalledWith('alex@example.com', 'secret123');
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('РїРѕРєР°Р·С‹РІР°РµС‚ РѕС€РёР±РєСѓ РёР· auth.store', () => {
    storeMocks.error = 'РќРµРІРµСЂРЅС‹Р№ email РёР»Рё РїР°СЂРѕР»СЊ.';

    render(<LoginForm onSuccess={vi.fn()} onSwitchToRegister={vi.fn()} />);

    expect(screen.getByText('РќРµРІРµСЂРЅС‹Р№ email РёР»Рё РїР°СЂРѕР»СЊ.')).toBeInTheDocument();
  });

  it('РїРѕ РєРЅРѕРїРєРµ РїРµСЂРµС…РѕРґР° РІ СЂРµРіРёСЃС‚СЂР°С†РёСЋ РІС‹Р·С‹РІР°РµС‚ clearError Рё onSwitchToRegister', async () => {
    const user = userEvent.setup();
    const onSwitchToRegister = vi.fn();

    render(<LoginForm onSuccess={vi.fn()} onSwitchToRegister={onSwitchToRegister} />);

    await user.click(screen.getByRole('button', { name: 'Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ' }));

    expect(storeMocks.clearError).toHaveBeenCalledTimes(1);
    expect(onSwitchToRegister).toHaveBeenCalledTimes(1);
  });
});
