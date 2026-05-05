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
      // РћС€РёР±РєР° СѓР¶Рµ С…СЂР°РЅРёС‚СЃСЏ Рё РїРѕРєР°Р·С‹РІР°РµС‚СЃСЏ С‡РµСЂРµР· auth.store.
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Nickname</span>
        <input
          type="text"
          autoComplete="nickname"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="РќР°РїСЂРёРјРµСЂ, Alex"
          {...register('nickname', {
            required: 'Р’РІРµРґРёС‚Рµ nickname',
            minLength: {
              value: 3,
              message: 'Nickname РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РЅРµ РєРѕСЂРѕС‡Рµ 3 СЃРёРјРІРѕР»РѕРІ',
            },
            maxLength: {
              value: 20,
              message: 'Nickname РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ РЅРµ РґР»РёРЅРЅРµРµ 20 СЃРёРјРІРѕР»РѕРІ',
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'РўРѕР»СЊРєРѕ Р»Р°С‚РёРЅСЃРєРёРµ Р±СѓРєРІС‹, С†РёС„СЂС‹ Рё _',
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
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="РњРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ"
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

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-gray-700">РџРѕРІС‚РѕСЂРёС‚Рµ РїР°СЂРѕР»СЊ</span>
        <input
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-secondary"
          placeholder="РџРѕРІС‚РѕСЂРёС‚Рµ РїР°СЂРѕР»СЊ"
          {...register('confirmPassword', {
            required: 'РџРѕРґС‚РІРµСЂРґРёС‚Рµ РїР°СЂРѕР»СЊ',
            validate: (value, formValues) =>
              value === formValues.password || 'РџР°СЂРѕР»Рё РЅРµ СЃРѕРІРїР°РґР°СЋС‚',
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
        {isSubmitting ? 'РЎРѕР·РґР°РµРј Р°РєРєР°СѓРЅС‚...' : 'Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ'}
      </button>

      <p className="text-center text-sm text-gray-600">
        РЈР¶Рµ РµСЃС‚СЊ Р°РєРєР°СѓРЅС‚?{' '}
        <button
          type="button"
          onClick={() => {
            clearError();
            onSwitchToLogin();
          }}
          className="font-medium text-secondary hover:underline"
        >
          Р’РѕР№С‚Рё
        </button>
      </p>
    </form>
  );
}
