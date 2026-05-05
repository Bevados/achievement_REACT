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
      // РћС€РёР±РєР° СѓР¶Рµ Р·Р°РїРёСЃР°РЅР° РІ auth.store Рё РѕС‚РѕР±СЂР°Р¶Р°РµС‚СЃСЏ РїРѕР»СЊР·РѕРІР°С‚РµР»СЋ.
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
            required: 'Р’РІРµРґРёС‚Рµ email',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ email',
            },
          })}
        />
        {errors.email ? <p className="mt-1 text-sm text-danger">{errors.email.message}</p> : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">РџР°СЂРѕР»СЊ</span>
        <input
          type="password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="********"
          {...register('password', {
            required: 'Р’РІРµРґРёС‚Рµ РїР°СЂРѕР»СЊ',
            minLength: {
              value: 6,
              message: 'РџР°СЂРѕР»СЊ РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РЅРµ РєРѕСЂРѕС‡Рµ 6 СЃРёРјРІРѕР»РѕРІ',
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
        {isSubmitting ? 'Р’С…РѕРґРёРј...' : 'Р’РѕР№С‚Рё'}
      </button>

      <p className="text-center text-sm text-gray-600">
        РќРµС‚ Р°РєРєР°СѓРЅС‚Р°?{' '}
        <button
          type="button"
          onClick={() => {
            clearError();
            onSwitchToRegister();
          }}
          className="font-medium text-secondary hover:underline"
        >
          Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ
        </button>
      </p>
    </form>
  );
}
