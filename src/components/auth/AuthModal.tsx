import React, { useState } from 'react';
import { X, UserPlus, LogIn, Sparkles, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api, StudentProfile } from '../../services/api';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';
import { triggerCelebrationBurst } from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: StudentProfile, message?: string) => void;
}

export const AVATAR_OPTIONS = [
  { id: 'eco_sprout', name: 'Brote Eco', emoji: '🌱' },
  { id: 'girl_guardian', name: 'Niña Guardiana', emoji: '👧' },
  { id: 'boy_explorer', name: 'Niño Explorador', emoji: '👦' },
  { id: 'smart_toucan', name: 'Tucán Sabio', emoji: '🦜' },
  { id: 'friendly_bear', name: 'Osito Andino', emoji: '🐻' },
  { id: 'happy_bee', name: 'Abejita Feliz', emoji: '🐝' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('eco_sprout');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    sounds.playPop();

    if (!username.trim()) {
      setErrorMsg('Por favor escribe un nombre de usuario.');
      return;
    }
    if (!password) {
      setErrorMsg('Por favor escribe una contraseña.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden. ¡Revisa con cuidado!');
        return;
      }
      if (password.length < 4) {
        setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
        return;
      }
    }

    try {
      setLoading(true);
      if (mode === 'register') {
        const res = await api.register(username, password, confirmPassword, selectedAvatar);
        triggerCelebrationBurst();
        onAuthSuccess(res.user, '¡Bienvenido a ECO-COLEGIO! Tu cuenta ha sido creada.');
        onClose();
      } else {
        const res = await api.login(username, password);
        sounds.playFanfare();
        onAuthSuccess(res.user, res.streakInfo?.message || '¡Qué alegría verte de nuevo!');
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ocurrió un error. Intenta de nuevo.';
      setErrorMsg(msg);
      sounds.playGentleHint();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border-4 border-emerald-400 shadow-2xl relative p-5 sm:p-7 overflow-y-auto max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot & Heading */}
        <div className="text-center space-y-2 mb-4">
          <div className="flex justify-center">
            <EcoMascot
              mood="happy"
              size="sm"
              showSpeechBubble={false}
            />
          </div>
          <h2 className="font-fun font-black text-2xl text-emerald-950">
            {mode === 'login' ? '¡Bienvenido de vuelta!' : '¡Únete a ECO-COLEGIO!'}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            {mode === 'login'
              ? 'Ingresa con tu usuario para continuar cuidando tu colegio y subir en el ranking.'
              : 'Crea tu perfil individual para guardar tus puntos, rachas e insignias.'}
          </p>
        </div>

        {/* Tabs: Iniciar Sesión / Crear Cuenta */}
        <div className="flex p-1 bg-emerald-50 rounded-2xl border border-emerald-200 mb-4">
          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl font-fun font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playPop();
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl font-fun font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear Cuenta</span>
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 bg-rose-50 border-2 border-rose-300 text-rose-900 p-3 rounded-2xl text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Avatar Selector (only on register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Elige tu personaje:
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setSelectedAvatar(av.id);
                    }}
                    title={av.name}
                    className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                      selectedAvatar === av.id
                        ? 'bg-emerald-200 border-2 border-emerald-600 scale-110 shadow-xs'
                        : 'bg-slate-50 border border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    {av.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre de usuario:
            </label>
            <input
              type="text"
              autoComplete="username"
              maxLength={15}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej: SuperEco7, JuanVerde..."
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none font-fun font-bold text-sm text-slate-800"
              required
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Sin espacios ni nombres reales completos para tu seguridad.
            </span>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contraseña:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 4 letras o números"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none font-bold text-sm text-slate-800 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (only on register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirmar contraseña:
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Escribe la misma contraseña"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none font-bold text-sm text-slate-800"
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fun font-black text-base shadow-lg shadow-emerald-200 transition-transform hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Cargando...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-5 h-5" />
                <span>¡Entrar a mi cuenta!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>¡Crear mi cuenta!</span>
              </>
            )}
          </button>
        </form>

        {/* Friendly note */}
        <p className="text-[11px] text-center text-slate-500 mt-4 leading-tight">
          💡 En ECO-COLEGIO protegemos tu privacidad: no te pedimos correo electrónico ni datos personales privados.
        </p>
      </div>
    </div>
  );
};
