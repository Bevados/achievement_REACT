import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/theme.store';

/**
 * РљРѕРјРїРѕРЅРµРЅС‚ ThemeToggle - РїРµСЂРµРєР»СЋС‡Р°С‚РµР»СЊ РјРµР¶РґСѓ СЃРІРµС‚Р»РѕР№ Рё С‚С‘РјРЅРѕР№ С‚РµРјРѕР№

 * РљР°Рє СЂР°Р±РѕС‚Р°РµС‚:
 * 1. РџСЂРё РєР»РёРєРµ РЅР° РєРЅРѕРїРєСѓ РІС‹Р·С‹РІР°РµС‚ toggleTheme()
 * 2. Store Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё РѕР±РЅРѕРІР»СЏРµС‚ HTML РєР»Р°СЃСЃ 'dark' Рё localStorage
 * 3. Р’СЃРµ РєРѕРјРїРѕРЅРµРЅС‚С‹ РєРѕС‚РѕСЂС‹Рµ РёСЃРїРѕР»СЊР·СѓСЋС‚ useThemeStore РѕР±РЅРѕРІР»СЏСЋС‚СЃСЏ
 */

interface ThemeToggleProps {
  rotate?: boolean;
}

export default function ThemeToggle({ rotate = false }: ThemeToggleProps) {
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative h-7 w-14 rounded-full transition-all duration-300
        ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
        hover:shadow-md focus:outline-none
        ease-in-out
        ${rotate ? 'rotate-90' : ''}
      `}
      aria-label={isDark ? 'РџРµСЂРµР№С‚Рё РЅР° СЃРІРµС‚Р»СѓСЋ С‚РµРјСѓ' : 'РџРµСЂРµР№С‚Рё РЅР° С‚С‘РјРЅСѓСЋ С‚РµРјСѓ'}
      title={isDark ? 'РЎРІРµС‚Р»Р°СЏ С‚РµРјР°' : 'РўС‘РјРЅР°СЏ С‚РµРјР°'}
    >
      <div
        className={`
          absolute top-1 h-5 w-5 rounded-full bg-white
          flex items-center justify-center
          transition-transform duration-300 ease-in-out
          shadow-md
          ${isDark ? 'translate-x-8' : 'translate-x-1'}
          ${rotate ? '-rotate-90' : ''}
        `}
      >
        {isDark ? (
          <Moon size={16} className="shrink-0 text-secondary" aria-hidden="true" />
        ) : (
          <Sun size={16} className="shrink-0 text-yellow-500" aria-hidden="true" />
        )}
      </div>

      <span className="sr-only">
        {isDark ? 'РўРµРєСѓС‰Р°СЏ С‚РµРјР°: РўС‘РјРЅР°СЏ' : 'РўРµРєСѓС‰Р°СЏ С‚РµРјР°: РЎРІРµС‚Р»Р°СЏ'}
      </span>
    </button>
  );
}
