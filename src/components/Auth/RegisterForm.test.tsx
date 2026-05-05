import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';

const storeMocks = vi.hoisted(() => ({
  register: vi.fn(),
  clearError: vi.fn(),
  error: null as string | null,
}));

vi.mock('../../store/auth.store', () => ({
  // РРјРёС‚РёСЂСѓРµРј РїРѕРІРµРґРµРЅРёРµ Zustand-СЃРµР»РµРєС‚РѕСЂР°:
  // РєРѕРјРїРѕРЅРµРЅС‚ РїРµСЂРµРґР°РµС‚ С„СѓРЅРєС†РёСЋ selector(state) => value,
  // Р° РјС‹ РІРѕР·РІСЂР°С‰Р°РµРј Р·РЅР°С‡РµРЅРёРµ РёР· РјРѕРє-РѕР±СЉРµРєС‚Р° storeMocks.
  useAuthStore: (selector: (state: typeof storeMocks) => unknown) => selector(storeMocks),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeMocks.error = null;
    storeMocks.register.mockResolvedValue(undefined);
  });

  it('РїРѕРєР°Р·С‹РІР°РµС‚ РѕС€РёР±РєСѓ РїСЂРё РЅРµСЃРѕРІРїР°РґРµРЅРёРё РїР°СЂРѕР»РµР№ Рё РЅРµ РІС‹Р·С‹РІР°РµС‚ register', async () => {
    const user = userEvent.setup();

    render(<RegisterForm onSuccess={vi.fn()} onSwitchToLogin={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('РќР°РїСЂРёРјРµСЂ, Alex'), 'alex');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'alex@example.com');
    await user.type(screen.getByPlaceholderText('РњРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ'), 'secret123');
    await user.type(screen.getByPlaceholderText('РџРѕРІС‚РѕСЂРёС‚Рµ РїР°СЂРѕР»СЊ'), 'different123');

    await user.click(screen.getByRole('button', { name: 'Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ' }));

    expect(await screen.findByText('РџР°СЂРѕР»Рё РЅРµ СЃРѕРІРїР°РґР°СЋС‚')).toBeInTheDocument();
    expect(storeMocks.register).not.toHaveBeenCalled();
  });

  it('СѓСЃРїРµС€РЅРѕ РѕС‚РїСЂР°РІР»СЏРµС‚ nickname/email/password Рё РІС‹Р·С‹РІР°РµС‚ onSuccess', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    render(<RegisterForm onSuccess={onSuccess} onSwitchToLogin={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('РќР°РїСЂРёРјРµСЂ, Alex'), 'boromir');
    await user.type(screen.getByPlaceholderText('you@example.com'), 'boromir@example.com');
    await user.type(screen.getByPlaceholderText('РњРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ'), 'secret123');
    await user.type(screen.getByPlaceholderText('РџРѕРІС‚РѕСЂРёС‚Рµ РїР°СЂРѕР»СЊ'), 'secret123');

    await user.click(screen.getByRole('button', { name: 'Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ' }));

    await waitFor(() => {
      expect(storeMocks.register).toHaveBeenCalledWith(
        'boromir@example.com',
        'secret123',
        'boromir',
      );
    });

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('РїРѕРєР°Р·С‹РІР°РµС‚ РѕС€РёР±РєСѓ РёР· auth.store', () => {
    storeMocks.error = 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЃ С‚Р°РєРёРј email СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚.';

    render(<RegisterForm onSuccess={vi.fn()} onSwitchToLogin={vi.fn()} />);

    expect(screen.getByText('РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЃ С‚Р°РєРёРј email СѓР¶Рµ СЃСѓС‰РµСЃС‚РІСѓРµС‚.')).toBeInTheDocument();
  });
});
