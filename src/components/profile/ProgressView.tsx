import React, { useState } from 'react';
import { Award, Trophy, Star, Sparkles, Printer, Edit2, Check, ShieldCheck, Heart, Flame, Calendar, LogOut, Lock } from 'lucide-react';
import { StudentProfile } from '../../services/api';
import { AVATAR_OPTIONS } from '../auth/AuthModal';
import { ALL_BADGES } from '../../data/badges';
import { getLevelData } from '../../utils/levels';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/storage';

interface ProgressViewProps {
  currentUser: StudentProfile | null;
  onUpdateAvatar: (avatarId: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  currentUser,
  onUpdateAvatar,
  onOpenAuth,
  onLogout,
  onNavigate,
}) => {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // If not logged in, prompt kindly to log in or create an account
  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-emerald-300 shadow-xl max-w-xl mx-auto text-center space-y-6 my-8">
        <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center text-5xl animate-bounce-gentle">
          🌱
        </div>
        <div className="space-y-2">
          <h2 className="font-fun font-black text-3xl text-emerald-950">
            ¡Crea tu Perfil de Estudiante!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Inicia sesión o crea una cuenta para guardar tus puntos verdes, racha de días consecutivos, insignias y posición en el ranking de ECO-COLEGIO.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fun font-black text-base shadow-lg shadow-emerald-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Iniciar sesión / Crear cuenta
          </button>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelData(currentUser.greenPoints);

  const activeAvatar = AVATAR_OPTIONS.find(a => a.id === currentUser.avatarId) || AVATAR_OPTIONS[0];

  const handleOpenCertificate = () => {
    sounds.playFanfare();
    triggerConfetti(0.5);
    setShowCertificateModal(true);
  };

  const getStreakMessage = (streak: number) => {
    if (streak <= 1) return '¡Comenzaste tu aventura ecológica!';
    if (streak === 2) return '¡Dos días seguidos cuidando el colegio!';
    if (streak === 3) return '¡Tres días cuidando el planeta!';
    if (streak < 7) return `¡Gran constancia! ${streak} días protegiendo la naturaleza.`;
    if (streak === 7) return '¡Una semana siendo un guardián ambiental!';
    if (streak < 15) return `¡Tu compromiso está creciendo! ${streak} días de disciplina.`;
    if (streak === 15) return '¡Tu compromiso está creciendo!';
    if (streak < 30) return `¡Impresionante! ${streak} días seguidos de amor ecológico.`;
    return '¡Eres una leyenda de ECO-COLEGIO!';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Mi Perfil de Estudiante
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Consulta tu nivel ecológico, tus rachas de participación y tu diploma oficial.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCertificate}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-fun font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Mi Diploma Oficial</span>
          </button>

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-fun font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* STUDENT PROFILE CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-emerald-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar Circle */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-100 to-teal-200 border-4 border-emerald-400 flex items-center justify-center text-5xl shadow-md">
                {activeAvatar.emoji}
              </div>
              <button
                onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 text-emerald-700 flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                title="Cambiar avatar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-fun font-black text-3xl text-emerald-950">
                  {currentUser.username}
                </h3>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border ${levelInfo.color}`}>
                  <span>{levelInfo.icon}</span>
                  <span>Nivel {levelInfo.level}: {levelInfo.name}</span>
                </span>

                <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ranking #{currentUser.rank || 1}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <EcoMascot
              mood="celebrating"
              message="¡Tu constancia escolar es admirable! Cada día que participas mantienes limpia nuestra institución."
              size="sm"
            />
          </div>
        </div>

        {/* Avatar Picker Dropdown */}
        {isEditingAvatar && (
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 animate-fadeIn space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Elige tu nuevo avatar:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    sounds.playPop();
                    onUpdateAvatar(av.id);
                    setIsEditingAvatar(false);
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 transition-transform cursor-pointer ${
                    currentUser.avatarId === av.id
                      ? 'border-emerald-600 bg-white scale-110 shadow-sm'
                      : 'border-emerald-200 bg-emerald-100/50 hover:bg-white'
                  }`}
                  title={av.name}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level Progression Bar */}
        <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border border-emerald-200 space-y-2">
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-emerald-950">
            <div className="flex items-center gap-1.5">
              <span>{levelInfo.icon}</span>
              <span>Nivel {levelInfo.level}: {levelInfo.name}</span>
            </div>
            <span>{currentUser.greenPoints} / {levelInfo.max} Puntos Verdes</span>
          </div>

          <div className="w-full bg-emerald-200/70 h-4 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>

          <p className="text-[11px] text-emerald-800 font-semibold">
            {levelInfo.pointsToNext > 0
              ? `¡Te faltan ${levelInfo.pointsToNext} puntos verdes para alcanzar el siguiente nivel ecológico!`
              : '¡Has alcanzado el nivel máximo de Campeón de ECO-COLEGIO! 👑'}
          </p>
        </div>

        {/* 4 STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200 text-center">
            <span className="text-2xl mb-1 block">🌿</span>
            <span className="font-fun font-black text-2xl text-emerald-900 leading-none">
              {currentUser.greenPoints}
            </span>
            <span className="text-[11px] text-slate-600 font-bold block mt-1">
              Total Puntos Verdes
            </span>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 text-center">
            <span className="text-2xl mb-1 block">🔥</span>
            <span className="font-fun font-black text-2xl text-amber-900 leading-none">
              {currentUser.streak} días
            </span>
            <span className="text-[11px] text-amber-800 font-bold block mt-1">
              Racha Consecutiva
            </span>
          </div>

          <div className="bg-sky-50 rounded-2xl p-4 border-2 border-sky-200 text-center">
            <span className="text-2xl mb-1 block">🏆</span>
            <span className="font-fun font-black text-2xl text-sky-900 leading-none">
              {currentUser.longestStreak} días
            </span>
            <span className="text-[11px] text-sky-800 font-bold block mt-1">
              Récord de Racha
            </span>
          </div>

          <div className="bg-teal-50 rounded-2xl p-4 border-2 border-teal-200 text-center">
            <span className="text-2xl mb-1 block">🏫</span>
            <span className="font-fun font-black text-2xl text-teal-900 leading-none">
              {currentUser.completedMissions?.length || 0}
            </span>
            <span className="text-[11px] text-teal-800 font-bold block mt-1">
              Misiones Completadas
            </span>
          </div>
        </div>
      </div>

      {/* DAILY STREAK SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h3 className="font-fun font-black text-xl text-slate-900">
              Sistema de Rachas Ecológicas
            </h3>
          </div>
          <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Zona horaria: Colombia (UTC-5)
          </span>
        </div>

        {/* Motivational message banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border-2 border-amber-200 flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <h4 className="font-fun font-bold text-sm text-amber-950">
              {getStreakMessage(currentUser.streak)}
            </h4>
            <p className="text-xs text-amber-900 mt-0.5">
              Participa cada día completando un juego, misión o reto escolar para mantener tu llama encendida.
            </p>
          </div>
        </div>

        {/* Calendar of active days */}
        <div>
          <h4 className="font-fun font-bold text-sm text-slate-800 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Días Activos Registrados ({currentUser.activeDates?.length || 1})</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {(currentUser.activeDates || [currentUser.lastActiveDateColombia]).map((dateStr, idx) => (
              <span
                key={idx}
                className="bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-1"
              >
                <span>✅</span>
                <span>{dateStr}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BADGES GALLERY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <h3 className="font-fun font-black text-xl text-slate-900">
              Insignias Desbloqueadas ({currentUser.unlockedBadges?.length || 0})
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = currentUser.unlockedBadges?.includes(badge.id) ||
              currentUser.unlockedBadges?.includes(badge.id.replace('badge_', ''));

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-55 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-inner flex-shrink-0 ${
                  isUnlocked ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-400'
                }`}>
                  {isUnlocked ? badge.icon : '🔒'}
                </div>

                <div>
                  <h4 className="font-fun font-bold text-sm text-slate-900">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                  {isUnlocked && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 mt-2 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>¡Conseguida!</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OFFICIAL DIPLOMA MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-8 border-amber-400 shadow-2xl p-6 sm:p-10 relative text-center space-y-6">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-2 border-b-2 border-amber-200 pb-4">
              <span className="text-4xl block">🌱 🏅 🌍</span>
              <span className="text-xs font-black tracking-widest uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                CERTIFICADO OFICIAL DE HONOR
              </span>
              <h2 className="font-fun font-black text-3xl sm:text-4xl text-emerald-950">
                ECO-COLEGIO
              </h2>
              <p className="font-fun font-bold text-sm text-emerald-800 italic">
                “¡Un colegio limpio es un planeta feliz!”
              </p>
            </div>

            <div className="space-y-3 py-2">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold uppercase tracking-wider">
                Se otorga con orgullo y alegría al estudiante:
              </p>
              <h3 className="font-fun font-black text-3xl sm:text-4xl text-emerald-700 underline decoration-amber-400 decoration-wavy">
                {currentUser.username}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed font-medium">
                Con nivel oficial de <strong>{currentUser.levelName}</strong> y {currentUser.greenPoints} Puntos Verdes acumulados, por demostrar compromiso con la separación de residuos y la protección ambiental de nuestra escuela.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t-2 border-amber-200 pt-4 max-w-md mx-auto text-center">
              <div>
                <div className="font-fun font-black text-emerald-800 text-sm">
                  Eco 🌱
                </div>
                <div className="text-[10px] text-slate-500 font-bold border-t border-slate-300 mt-1 pt-1">
                  Mascota Guía Ambiental
                </div>
              </div>
              <div>
                <div className="font-fun font-black text-emerald-800 text-sm">
                  Equipo ECO-COLEGIO
                </div>
                <div className="text-[10px] text-slate-500 font-bold border-t border-slate-300 mt-1 pt-1">
                  Bryan, Alisson, Juan David, Michell, Joan
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-fun font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Diploma</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-sm cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
