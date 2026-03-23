import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const registerUser = useAuthStore((state) => state.register);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const probeProtectedApi = useAuthStore((state) => state.probeProtectedApi);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (values: RegisterFormValues) => {
    clearError();

    try {
      await registerUser(values.email, values.password);

      try {
        // После регистрации проверяем, что защищенный API доступен с новым токеном.
        // Ошибка smoke-теста не должна отменять успешную регистрацию.
        await probeProtectedApi();
      } catch (probeError) {
        console.warn('Protected API probe failed after registration:', probeError);
      }

      onSuccess();
    } catch {
      // Ошибка уже хранится и показывается через auth.store.
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
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="Минимум 6 символов"
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

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Повторите пароль</span>
        <input
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="Повторите пароль"
          {...register('confirmPassword', {
            required: 'Подтвердите пароль',
            validate: (value) => value === passwordValue || 'Пароли не совпадают',
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
        {isSubmitting ? 'Создаем аккаунт...' : 'Зарегистрироваться'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Уже есть аккаунт?{' '}
        <button
          type="button"
          onClick={() => {
            clearError();
            onSwitchToLogin();
          }}
          className="font-medium text-secondary hover:underline"
        >
          Войти
        </button>
      </p>
    </form>
  );
}
