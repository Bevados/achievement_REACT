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

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const probeProtectedApi = useAuthStore((state) => state.probeProtectedApi);

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

      try {
        // Пробный защищенный запрос: помогает убедиться, что токен уходит в API.
        // Если он не прошел (например, API не поднят локально), вход все равно успешен.
        await probeProtectedApi();
      } catch (probeError) {
        console.warn('Protected API probe failed after login:', probeError);
      }

      onSuccess();
    } catch {
      // Ошибка уже записана в auth.store и отображается пользователю.
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
            required: 'Введите email',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Введите корректный email',
            },
          })}
        />
        {errors.email ? <p className="mt-1 text-sm text-danger">{errors.email.message}</p> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Пароль</span>
        <input
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="********"
          {...register('password', {
            required: 'Введите пароль',
            minLength: {
              value: 6,
              message: 'Пароль должен быть не короче 6 символов',
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
        {isSubmitting ? 'Входим...' : 'Войти'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Нет аккаунта?{' '}
        <button
          type="button"
          onClick={() => {
            clearError();
            onSwitchToRegister();
          }}
          className="font-medium text-secondary hover:underline"
        >
          Зарегистрироваться
        </button>
      </p>
    </form>
  );
}
