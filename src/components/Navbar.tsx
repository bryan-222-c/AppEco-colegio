import React, { useState } from 'react';
import { Volume2, VolumeX, Award, HelpCircle, Users, BookOpen, Calendar, Home, Sparkles, Hammer, Menu, X, LogIn, LogOut, Flame, Trophy, Gift, UserCheck, TrendingDown } from 'lucide-react';
import { sounds } from '../utils/audio';
import { StudentProfile } from '../services/api';
import { AVATAR_OPTIONS } from './auth/AuthModal';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  currentUser: StudentProfile | null;
  greenPoints: number;
  onOpenHowToPlay: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  greenPoints,
  onOpenHowToPlay,
  onOpenAuth,
  onLogout,
}) => {
  const [soundOn, setSoundOn] = useState<boolean>(sounds.isEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const next = !soundOn;
    sounds.setEnabled(next);
    setSoundOn(next);
    if (next) {
      sounds.playPop();
    }
  };

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'juegos', label: 'Juegos', icon: Sparkles },
    { id: 'juego_mision', label: 'Misiones', icon: Hammer },
    { id: 'impacto', label: 'Impacto Mensual', icon: TrendingDown },
    { id: 'recompensas', label: 'Mis Recompensas', icon: Gift },
    { id: 'ranking', label: 'Ranking Ecológico', icon: Trophy },
    { id: 'progreso', label: 'Mi Perfil', icon: Award },
  ];

  const handleItemClick = (id: string) => {
    sounds.playPop();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const getAvatarEmoji = (avatarId: string) => {
    const found = AVATAR_OPTIONS.find(a => a.id === avatarId);
    return found ? found.emoji : '🌱';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-emerald-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          onClick={() => handleItemClick('inicio')}
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
            <span className="text-xl sm:text-2xl transform -rotate-6">🌱</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-fun font-black text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-emerald-700 via-teal-600 to-green-600 bg-clip-text text-transparent">
                ECO-COLEGIO
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-800 -mt-1 hidden xs:block">
              ¡Un colegio limpio es un planeta feliz!
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-emerald-50/70 p-1.5 rounded-2xl border border-emerald-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 scale-105'
                    : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-100/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Green Points Capsule */}
          <div
            onClick={() => handleItemClick('recompensas')}
            title="¡Tus Puntos Verdes acumulados! Haz clic para ver tus recompensas"
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-emerald-50 border-2 border-emerald-300 px-2.5 sm:px-3 py-1 rounded-full shadow-xs cursor-pointer hover:border-emerald-400 transition-transform active:scale-95"
          >
            <span className="text-base sm:text-lg animate-pulse-subtle">🌿</span>
            <div className="text-right">
              <span className="font-fun font-black text-emerald-900 text-sm sm:text-base leading-none">
                {greenPoints}
              </span>
              <span className="text-[10px] text-emerald-700 block font-bold leading-none -mt-0.5 hidden sm:block">
                Puntos
              </span>
            </div>
          </div>

          {/* User Status / Streak / Login Buttons */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Daily Streak Indicator */}
              <div
                onClick={() => handleItemClick('progreso')}
                title={`Racha actual: ${currentUser.streak} días consecutivos`}
                className="flex items-center gap-1 bg-amber-50 border border-amber-300 px-2 sm:px-2.5 py-1 rounded-full cursor-pointer hover:bg-amber-100 transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="font-fun font-black text-xs text-amber-900">
                  {currentUser.streak}d
                </span>
              </div>

              {/* User Avatar + Name */}
              <button
                onClick={() => handleItemClick('progreso')}
                className="hidden md:flex items-center gap-1.5 bg-emerald-100/70 border border-emerald-300 pl-1.5 pr-3 py-1 rounded-full cursor-pointer hover:bg-emerald-200 transition-colors"
              >
                <span className="text-lg">{getAvatarEmoji(currentUser.avatarId)}</span>
                <span className="font-fun font-bold text-xs text-emerald-950 truncate max-w-[90px]">
                  {currentUser.username}
                </span>
              </button>

              {/* Logout button */}
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-fun font-bold text-xs border border-emerald-300 transition-colors cursor-pointer shadow-xs"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer hidden sm:block"
              >
                Crear cuenta
              </button>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Desactivar sonidos' : 'Activar sonidos'}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border transition-transform hover:scale-105 shadow-xs ${
              soundOn
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-500 border-slate-300'
            }`}
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* How to Play Help button */}
          <button
            onClick={onOpenHowToPlay}
            title="¿Cómo jugar? Guía para niños"
            className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center justify-center font-bold border border-amber-300 transition-transform hover:scale-105 shadow-xs"
          >
            <HelpCircle className="w-5 h-5 text-amber-700" />
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b-2 border-emerald-200 px-4 py-3 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  active
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-700 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-emerald-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {!currentUser && (
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-fun font-bold text-xs text-center border border-emerald-300"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-fun font-bold text-xs text-center"
              >
                Crear Cuenta
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
