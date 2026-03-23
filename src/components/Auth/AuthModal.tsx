import BaseModal from '../Modal/BaseModal';
import { useModalStore } from '../../store/modal.store';
import { useAuthStore } from '../../store/auth.store';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthModal() {
  const isOpen = useModalStore((state) => state.isOpen);
  const activeModal = useModalStore((state) => state.activeModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const switchModal = useModalStore((state) => state.switchModal);
  const clearError = useAuthStore((state) => state.clearError);

  const handleClose = () => {
    clearError();
    closeModal();
  };

  const title = activeModal === 'register' ? 'Регистрация' : 'Вход';

  return (
    <BaseModal isOpen={isOpen} title={title} onClose={handleClose}>
      {activeModal === 'register' ? (
        <RegisterForm onSuccess={handleClose} onSwitchToLogin={() => switchModal('login')} />
      ) : (
        <LoginForm onSuccess={handleClose} onSwitchToRegister={() => switchModal('register')} />
      )}
    </BaseModal>
  );
}
