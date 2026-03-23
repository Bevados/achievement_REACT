import { create } from 'zustand';

export type ModalType = 'login' | 'register' | null;

interface ModalStore {
  activeModal: ModalType;
  isOpen: boolean;
  openModal: (modal: Exclude<ModalType, null>) => void;
  closeModal: () => void;
  switchModal: (modal: Exclude<ModalType, null>) => void;
}

/*
  Отдельный UI-store для модалок.
  Идея: состояние модалки не смешивается с бизнес-логикой авторизации.
*/
export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  isOpen: false,
  openModal: (modal) => set({ activeModal: modal, isOpen: true }),
  closeModal: () => set({ activeModal: null, isOpen: false }),
  switchModal: (modal) => set({ activeModal: modal, isOpen: true }),
}));
