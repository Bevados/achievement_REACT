import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';

interface RegisterFormValues {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

const REGISTER_TEXT = {
  nicknameLabel: '\u041d\u0438\u043a\u043d\u0435\u0439\u043c',
  nicknamePlaceholder: '\u041d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, Alex',
  nicknameRequired: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0438\u043a\u043d\u0435\u0439\u043c',
  nicknameMinLength:
    '\u041d\u0438\u043a\u043d\u0435\u0439\u043c \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u043d\u0435 \u043a\u043e\u0440\u043e\u0447\u0435 3 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432',
  nicknameMaxLength:
    '\u041d\u0438\u043a\u043d\u0435\u0439\u043c \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u043d\u0435 \u0434\u043b\u0438\u043d\u043d\u0435\u0435 20 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432',
  nicknamePattern:
    '\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0439\u0442\u0435 \u043b\u0430\u0442\u0438\u043d\u0441\u043a\u0438\u0435 \u0431\u0443\u043a\u0432\u044b, \u0446\u0438\u0444\u0440\u044b \u0438 \u0441\u0438\u043c\u0432\u043e\u043b _',
  emailRequired: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 email',
  emailInvalid: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 email',
  passwordLabel: '\u041f\u0430\u0440\u043e\u043b\u044c',
  passwordPlaceholder: '\u041c\u0438\u043d\u0438\u043c\u0443\u043c 6 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432',
  passwordRequired: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c',
  passwordMinLength:
    '\u041f\u0430\u0440\u043e\u043b\u044c \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u043d\u0435 \u043a\u043e\u0440\u043e\u0447\u0435 6 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432',
  confirmPasswordLabel: '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c',
  confirmPasswordPlaceholder: '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c',
  confirmPasswordRequired: '\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c',
  confirmPasswordMismatch: '\u041f\u0430\u0440\u043e\u043b\u0438 \u043d\u0435 \u0441\u043e\u0432\u043f\u0430\u0434\u0430\u044e\u0442',
  submitting: '\u0421\u043e\u0437\u0434\u0430\u0435\u043c \u0430\u043a\u043a\u0430\u0443\u043d\u0442...',
  submit: '\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f',
  hasAccount: '\u0423\u0436\u0435 \u0435\u0441\u0442\u044c \u0430\u043a\u043a\u0430\u0443\u043d\u0442?',
  switchToLogin: '\u0412\u043e\u0439\u0442\u0438',
} as const;

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const registerUser = useAuthStore((state) => state.register);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    clearError();

    try {
      await registerUser(values.email, values.password, values.nickname);
      onSuccess();
    } catch {
      // Error text is already stored in auth.store.
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">{REGISTER_TEXT.nicknameLabel}</span>
        <input
          type="text"
          autoComplete="nickname"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder={REGISTER_TEXT.nicknamePlaceholder}
          {...register('nickname', {
            required: REGISTER_TEXT.nicknameRequired,
            minLength: {
              value: 3,
              message: REGISTER_TEXT.nicknameMinLength,
            },
            maxLength: {
              value: 20,
              message: REGISTER_TEXT.nicknameMaxLength,
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: REGISTER_TEXT.nicknamePattern,
            },
          })}
        />
        {errors.nickname ? (
          <p className="mt-1 text-sm text-danger">{errors.nickname.message}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
        <input
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="you@example.com"
          {...register('email', {
            required: REGISTER_TEXT.emailRequired,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: REGISTER_TEXT.emailInvalid,
            },
          })}
        />
        {errors.email ? <p className="mt-1 text-sm text-danger">{errors.email.message}</p> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">{REGISTER_TEXT.passwordLabel}</span>
        <input
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder={REGISTER_TEXT.passwordPlaceholder}
          {...register('password', {
            required: REGISTER_TEXT.passwordRequired,
            minLength: {
              value: 6,
              message: REGISTER_TEXT.passwordMinLength,
            },
          })}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">{REGISTER_TEXT.confirmPasswordLabel}</span>
        <input
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder={REGISTER_TEXT.confirmPasswordPlaceholder}
          {...register('confirmPassword', {
            required: REGISTER_TEXT.confirmPasswordRequired,
            validate: (value, formValues) =>
              value === formValues.password || REGISTER_TEXT.confirmPasswordMismatch,
          })}
        />
        {errors.confirmPassword ? (
          <p className="mt-1 text-sm text-danger">{errors.confirmPassword.message}</p>
        ) : null}
      </label>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-secondary px-4 py-2 font-medium text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? REGISTER_TEXT.submitting : REGISTER_TEXT.submit}
      </button>

      <p className="text-center text-sm text-gray-600">
        {REGISTER_TEXT.hasAccount}{' '}
        <button
          type="button"
          onClick={() => {
            clearError();
            onSwitchToLogin();
          }}
          className="font-medium text-secondary hover:underline"
        >
          {REGISTER_TEXT.switchToLogin}
        </button>
      </p>
    </form>
  );
}
