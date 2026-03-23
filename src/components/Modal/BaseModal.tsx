import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function BaseModal({ isOpen, title, onClose, children }: BaseModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Пока модалка открыта, запрещаем скролл страницы.
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/45 backdrop-blur-[1px] flex items-center justify-center p-4"
      onMouseDown={(event) => {
        // Закрываем только при клике по фону, а не по контенту.
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <section
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          <button
            type="button"
            className="rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-100"
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            <X size={20} />
          </button>
        </header>

        {children}
      </section>
    </div>,
    document.body,
  );
}
