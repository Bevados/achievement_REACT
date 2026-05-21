import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LOGIN_TEXT = {
  emailRequired: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 email',
  emailInvalid: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 email',
  passwordLabel: '\u041f\u0430\u0440\u043e\u043b\u044c',
  passwordRequired: '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043f\u0430\u0440\u043e\u043b\u044c',
  passwordMinLength:
    '\u041f\u0430\u0440\u043e\u043b\u044c \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u043d\u0435 \u043a\u043e\u0440\u043e\u0447\u0435 6 \u0441\u0438\u043c\u0432\u043e\u043b\u043e\u0432',
  submitting: '\u0412\u0445\u043e\u0434\u0438\u043c...',
  submit: '\u0412\u043e\u0439\u0442\u0438',
  noAccount: '\u041d\u0435\u0442 \u0430\u043a\u043a\u0430\u0443\u043d\u0442\u0430?',
  switchToRegister: '\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f',
} as const;

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearError();

    try {
      await login(values.email, values.password);
      onSuccess();
    } catch {
      // Error text is already stored in auth.store.
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
        <input
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="you@example.com"
          {...register('email', {
            required: LOGIN_TEXT.emailRequired,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: LOGIN_TEXT.emailInvalid,
            },
          })}
        />
        {errors.email ? <p className="mt-1 text-sm text-danger">{errors.email.message}</p> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">{LOGIN_TEXT.passwordLabel}</span>
        <input
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="********"
          {...register('password', {
            required: LOGIN_TEXT.passwordRequired,
            minLength: {
              value: 6,
              message: LOGIN_TEXT.passwordMinLength,
            },
          })}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-danger">{errors.password.message}</p>
        ) : null}
      </label>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-secondary px-4 py-2 font-medium text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? LOGIN_TEXT.submitting : LOGIN_TEXT.submit}
      </button>

      <p className="text-center text-sm text-gray-600">
        {LOGIN_TEXT.noAccount}{' '}
        <button
          type="button"
          onClick={() => {
            clearError();
            onSwitchToRegister();
          }}
          className="font-medium text-secondary hover:underline"
        >
          {LOGIN_TEXT.switchToRegister}
        </button>
      </p>
    </form>
  );
}
