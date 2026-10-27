import React from 'react';
import { Award, Flame, Gift, Star, Sparkles, CheckCircle2, Lock, ArrowRight, Trophy } from 'lucide-react';
import { StudentProfile } from '../../services/api';
import { ALL_BADGES } from '../../data/badges';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';

interface RewardsViewProps {
  currentUser: StudentProfile | null;
  onOpenAuth: () => void;
  onNavigate: (tab: string) => void;
}

const STREAK_MILESTONES = [
  { days: 3, points: 50, badgeName: 'Racha Verde de 3 Días', icon: '🥉', desc: 'Conéctate y realiza una actividad 3 días seguidos.' },
  { days: 7, points: 100, badgeName: 'Semana Ecológica Completa', icon: '🥈', desc: 'Una semana completa de constancia ambiental escolar.' },
  { days: 15, points: 200, badgeName: 'Guardián Quincenal', icon: '🥇', desc: '15 días protegiendo los recursos naturales.' },
  { days: 30, points: 500, badgeName: 'Leyenda Mensual de ECO-COLEGIO', icon: '👑', desc: '30 días consecutivos siendo un héroe del planeta.' },
];

export const RewardsView: React.FC<RewardsViewProps> = ({
  currentUser,
  onOpenAuth,
  onNavigate,
}) => {
  const userStreak = currentUser?.streak || 0;
  const claimedRewards = currentUser?.claimedRewards || [];
  const unlockedBadges = currentUser?.unlockedBadges || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Mis Recompensas e Insignias
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            ¡Descubre todos los premios, medallas y puntos que puedes ganar cuidando la escuela!
          </p>
        </div>

        {currentUser && (
          <div className="bg-emerald-50 border-2 border-emerald-300 px-4 py-1.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Puntos Acumulados</span>
            <span className="font-fun font-black text-lg text-emerald-900 leading-tight">
              🌿 {currentUser.greenPoints}
            </span>
          </div>
        )}
      </div>

      {/* HOW TO EARN REWARDS SUMMARY CARD */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-6 sm:p-8 border-4 border-emerald-300 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Tabla Oficial de Puntuación
            </span>
            <h3 className="font-fun font-black text-2xl text-slate-900 mt-1">
              ¿Cómo ganar Puntos Verdes?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Cada acción positiva que completas suma recompensas seguras a tu cuenta:
            </p>
          </div>

          <EcoMascot mood="happy" size="sm" showSpeechBubble={false} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-sky-50 rounded-2xl p-3.5 border-2 border-sky-200 text-center">
            <span className="text-3xl block mb-1">🗑️</span>
            <span className="font-fun font-black text-base text-sky-900 block leading-tight">+10 pts</span>
            <span className="text-[11px] text-slate-600 font-semibold mt-1 block">Separar residuo</span>
          </div>

          <div className="bg-amber-50 rounded-2xl p-3.5 border-2 border-amber-200 text-center">
            <span className="text-3xl block mb-1">❓</span>
            <span className="font-fun font-black text-base text-amber-900 block leading-tight">+10 pts</span>
            <span className="text-[11px] text-slate-600 font-semibold mt-1 block">Pregunta acertada</span>
          </div>

          <div className="bg-teal-50 rounded-2xl p-3.5 border-2 border-teal-200 text-center">
            <span className="text-3xl block mb-1">🏫</span>
            <span className="font-fun font-black text-base text-teal-900 block leading-tight">+25 pts</span>
            <span className="text-[11px] text-slate-600 font-semibold mt-1 block">Misión completada</span>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3.5 border-2 border-emerald-200 text-center">
            <span className="text-3xl block mb-1">📅</span>
            <span className="font-fun font-black text-base text-emerald-900 block leading-tight">+30 pts</span>
            <span className="text-[11px] text-slate-600 font-semibold mt-1 block">Reto escolar del día</span>
          </div>

          <div className="bg-purple-50 rounded-2xl p-3.5 border-2 border-purple-200 text-center">
            <span className="text-3xl block mb-1">📖</span>
            <span className="font-fun font-black text-base text-purple-900 block leading-tight">+15 pts</span>
            <span className="text-[11px] text-slate-600 font-semibold mt-1 block">Lección aprendida</span>
          </div>
        </div>
      </div>

      {/* STREAK MILESTONES (3, 7, 15, 30 DAYS) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            <h3 className="font-fun font-black text-xl text-slate-900">
              Premios por Rachas Diarias
            </h3>
          </div>
          {currentUser && (
            <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              Tu racha actual: 🔥 {userStreak} días
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STREAK_MILESTONES.map((milestone) => {
            const isReached = userStreak >= milestone.days;
            const isClaimed = claimedRewards.includes(`streak_milestone_${milestone.days}`);

            return (
              <div
                key={milestone.days}
                className={`p-4 rounded-3xl border-3 transition-all flex flex-col justify-between ${
                  isReached
                    ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{milestone.icon}</span>
                    <span className="text-xs font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">
                      +{milestone.points} pts
                    </span>
                  </div>
                  <h4 className="font-fun font-bold text-base text-slate-900">
                    {milestone.days} Días Consecutivos
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    {milestone.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  {isReached ? (
                    <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Hito alcanzado!</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Faltan {milestone.days - userStreak} días</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ALL BADGES GALLERY */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <h3 className="font-fun font-black text-xl text-slate-900">
              Galería de Insignias Escolares
            </h3>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            +50 pts por insignia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id) || unlockedBadges.includes(badge.id.replace('badge_', ''));

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
                      <span>¡Desbloqueada!</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
