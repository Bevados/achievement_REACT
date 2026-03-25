import { describe, expect, it, beforeEach } from 'vitest';
import { useModalStore } from './modal.store';

describe('modal.store', () => {
  beforeEach(() => {
    // Перед каждым тестом сбрасываем состояние стора к начальному.
    // Это важно, чтобы тесты были независимыми:
    // результат одного теста не должен влиять на следующий.
    useModalStore.setState({
      activeModal: null,
      isOpen: false,
    });
  });

  it('opens login modal', () => {
    // ДЕЙСТВИЕ: открываем модалку логина.
    useModalStore.getState().openModal('login');

    // ПРОВЕРКА: стор должен перейти в состояние
    // "модалка открыта" + "активный тип login".
    const state = useModalStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.activeModal).toBe('login');
  });

  it('switches modal content while staying open', () => {
    // ПОДГОТОВКА: открываем модалку в режиме login.
    useModalStore.getState().openModal('login');

    // ДЕЙСТВИЕ: переключаем контент модалки на register.
    useModalStore.getState().switchModal('register');

    // ПРОВЕРКА:
    // 1) модалка все еще открыта,
    // 2) изменился только тип контента.
    const state = useModalStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.activeModal).toBe('register');
  });

  it('closes modal and clears active modal type', () => {
    // ПОДГОТОВКА: сначала открываем любую модалку.
    useModalStore.getState().openModal('register');

    // ДЕЙСТВИЕ: закрываем модалку.
    useModalStore.getState().closeModal();

    // ПРОВЕРКА: состояние должно полностью вернуться в исходное.
    const state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.activeModal).toBeNull();
  });
});
