import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Menu, X, LogOut } from 'lucide-react';

import { siteConfig } from '../../config/site.config';

/** Интерфейс для данных пользователя */
interface User {
  login: string;
  isAuthenticated: boolean;
}

/** Интерфейс для пропсов Header компонента */
interface HeaderProps {
  user?: User; // Данные пользователя (опционально)
  onLogout?: () => void; // Callback функция при выходе
}

export default function Header({
  user = { login: '', isAuthenticated: false },
  onLogout,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [profileAnimateIn, setProfileAnimateIn] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  const location = useLocation();

  /** Используется для подсветки активного пункта меню */
  const isActive = (path: string) => location.pathname === path;

  /** Какую навигацию показывать: Для авторизованных или неавторизованных */
  const navItems = user?.isAuthenticated ? siteConfig.navItemsPrivate : siteConfig.navItemsPublic;

  // EFFECT: Обработка клавиши Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setProfileAnimateIn(false);
        setTimeout(() => setIsProfileDropdown(false), 200);
      }
    };

    if (isMenuOpen || isProfileDropdown) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen, isProfileDropdown]);

  // EFFECT: Фокус на первый элемент при открытии меню
  useEffect(() => {
    if (isMenuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [isMenuOpen]);

  // EFFECT: Закрытие меню при клике вне области
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Закрываем мобильное меню если кликнули вне его
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      // Закрываем профиль дропдаун если кликнули вне него
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        // animate out then unmount
        setProfileAnimateIn(false);
        setTimeout(() => setIsProfileDropdown(false), 200);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ОБРАБОТЧИКИ СОБЫТИЙ

  /** Переключает состояние мобильного меню */
  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /** Закрывает меню при клике на пункт навигации */
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  /** Закрывает дропдаун профиля и вызывает callback выхода */
  const handleLogout = () => {
    setProfileAnimateIn(false);
    setTimeout(() => setIsProfileDropdown(false), 200);
    onLogout?.();
  };

  const openProfile = () => {
    setIsProfileDropdown(true);
    setTimeout(() => setProfileAnimateIn(true), 10);
  };

  const closeProfile = () => {
    setProfileAnimateIn(false);
    setTimeout(() => setIsProfileDropdown(false), 200);
  };

  const handleProfileToggle = () => {
    if (isProfileDropdown) closeProfile();
    else openProfile();
  };

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black-semi z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          role="presentation"
        />
      )}

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-16 md:h-20 px-4 sm:px-6 lg:px-8">
            {/* ===== ЛОГОТИП И НАЗВАНИЕ САЙТА ===== */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-adaptive">A</span>
              </div>
              <span className="hidden md:inline font-bold text-adaptive text-primary">AchieveHub</span>
            </Link>

            {/* ===== НАВИГАЦИЯ ===== */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative font-medium text-adaptive transition-colors duration-200
                    ${isActive(item.path) ? 'text-secondary' : 'text-gray-700 hover:text-secondary'}
                  `}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary" />
                  )}
                </Link>
              ))}
            </div>

            {/* ===== АВТОРИЗАЦИЯ / ПРОФИЛЬ ===== */}
            <div className="hidden md:flex items-center gap-4">
              {/* ВАРИАНТ 1: Авторизованный пользователь - дропдаун профиля */}
              {user?.isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={handleProfileToggle}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-adaptive">Привет, {user.login}</span>
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.login.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {/* Блок дропдаун профиля */}
                  {isProfileDropdown && (
                    <div
                      className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transform transition-opacity transition-transform duration-200 ease-out ${
                        profileAnimateIn
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      {/* Кнопка "Мой профиль" */}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-adaptive"
                        onClick={closeProfile}
                      >
                        Мой профиль
                      </Link>

                      {/* Кнопка "Выход" */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-danger hover:bg-gray-50 transition-colors flex items-center gap-2 text-adaptive"
                      >
                        <LogOut size={16} />
                        Выход
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ВАРИАНТ 2: Неавторизованный пользователь - кнопки Вход/Регистрация */
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 text-secondary font-medium text-adaptive hover:bg-secondary-light rounded-lg transition-colors">
                    Вход
                  </button>
                  <button className="px-4 py-2 bg-secondary text-white font-medium text-adaptive rounded-lg hover:bg-secondary-dark transition-colors">
                    Регистрация
                  </button>
                </div>
              )}
            </div>

            {/*  ===== МОБИЛЬНОЕ МЕНЮ - BURGER КНОПКА =====*/}
            <div className="md:hidden flex items-center gap-4">
              {/* Аватар на мобильных (если авторизован) */}
              {user?.isAuthenticated && (
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.login.charAt(0).toUpperCase()}
                </div>
              )}

              {/* КНОПКА БУРГЕР */}
              <button
                onClick={handleMenuClick}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* ===== МОБИЛЬНОЕ МЕНЮ (ВЫЕЗЖАЮЩЕЕ) ===== */}
          <div
            ref={menuRef}
            className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
              isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-2 py-4 space-y-2 border-t border-gray-200">
              {/* ПУНКТЫ НАВИГАЦИИ МОБИЛЬНОГО МЕНЮ */}
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  ref={index === 0 ? firstMenuItemRef : null}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`
                    block px-4 py-3 rounded-lg font-medium text-adaptive transition-all duration-200
                    ${
                      isActive(item.path)
                        ? 'bg-secondary-light text-secondary font-semibold border-l-4 border-secondary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}

              {/* РАЗДЕЛИТЕЛЬ */}
              <div className="border-t border-gray-200 my-2" />

              {/* АВТОРИЗАЦИЯ/ПРОФИЛЬ НА МОБИЛЬНЫХ */}
              {user?.isAuthenticated ? (
                <>
                  {/* Ссылка на профиль */}
                  <Link
                    to="/profile"
                    onClick={handleNavClick}
                    className={`block px-4 py-3 rounded-lg font-medium text-adaptive transition-colors ${
                      isActive('/profile')
                        ? 'bg-secondary-light text-secondary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Мой профиль
                  </Link>

                  {/* Кнопка выхода */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-danger font-medium text-adaptive hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Выход
                  </button>
                </>
              ) : (
                /* Кнопки входа/регистрации для неавторизованных */
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 text-secondary font-medium text-adaptive hover:bg-secondary-light rounded-lg transition-colors border border-secondary">
                    Вход
                  </button>
                  <button className="w-full px-4 py-3 bg-secondary text-white font-medium text-adaptive rounded-lg hover:bg-secondary-dark transition-colors">
                    Регистрация
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
