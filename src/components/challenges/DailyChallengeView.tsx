import React, { useState } from 'react';
import { Calendar, CheckCircle2, Sparkles, Award, Star, Flame, Trophy, ArrowRight } from 'lucide-react';
import { DAILY_CHALLENGES } from '../../data/dailyChallenges';
import { DailyChallenge } from '../../types/eco';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/storage';

interface DailyChallengeViewProps {
  completedChallenges: string[];
  onCompleteChallenge: (challengeId: string, points: number) => void;
  onNavigate: (tab: string) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  completedChallenges,
  onCompleteChallenge,
  onNavigate,
}) => {
  // Determine today's challenge by day of week
  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 Monday, etc.
  // Map index: Monday = 0, Sunday = 6
  const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    DAILY_CHALLENGES[adjustedIndex]?.id || DAILY_CHALLENGES[0].id
  );

  const activeChallenge = DAILY_CHALLENGES.find(c => c.id === selectedChallengeId) || DAILY_CHALLENGES[0];
  const isCompleted = completedChallenges.includes(activeChallenge.id);

  const handleClaimChallenge = (challenge: DailyChallenge) => {
    if (completedChallenges.includes(challenge.id)) return;
    sounds.playSuccess();
    triggerConfetti(0.5);
    onCompleteChallenge(challenge.id, challenge.points);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Reto Ecológico del Día
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            ¡Lleva la ecología a la práctica en tu colegio real! Cumple la misión de hoy y gana puntos verdes.
          </p>
        </div>

        {/* Total completed count */}
        <div className="bg-amber-50 border-2 border-amber-300 px-4 py-1.5 rounded-2xl text-center">
          <span className="text-[11px] font-bold text-amber-700 block">Retos Realizados</span>
          <span className="font-fun font-black text-lg text-amber-900 leading-tight">
            ⭐ {completedChallenges.length} / {DAILY_CHALLENGES.length}
          </span>
        </div>
      </div>

      {/* TODAY'S FEATURED CHALLENGE CARD */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-3xl p-6 sm:p-10 border-4 border-amber-300 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-amber-200 text-amber-950 text-xs font-black px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeChallenge.dayLabel}</span>
            </div>
            <h3 className="font-fun font-black text-2xl sm:text-3xl text-slate-900">
              {activeChallenge.title}
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
              {activeChallenge.tag}
            </span>
          </div>

          <div className="w-20 h-20 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-inner animate-bounce-gentle flex-shrink-0">
            {activeChallenge.icon}
          </div>
        </div>

        {/* Task description */}
        <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border-2 border-emerald-100 shadow-xs">
          <h4 className="font-fun font-bold text-sm text-emerald-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Tu misión escolar de hoy:</span>
          </h4>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {activeChallenge.description}
          </p>
        </div>

        {/* Completion status & button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-600">Recompensa:</span>
            <span className="font-fun font-black text-emerald-800 text-lg bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              +{activeChallenge.points} Puntos Verdes
            </span>
          </div>

          {isCompleted ? (
            <div className="flex items-center gap-2 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 px-6 py-3 rounded-2xl font-fun font-black text-base shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
              <span>¡Completado con éxito hoy! 🎉</span>
            </div>
          ) : (
            <button
              onClick={() => handleClaimChallenge(activeChallenge)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fun font-black text-lg shadow-lg shadow-emerald-200 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>¡Lo logré hoy! 🎉</span>
            </button>
          )}
        </div>

        {/* Eco Mascot encouraging remark */}
        <div className="pt-2">
          <EcoMascot
            mood={isCompleted ? 'celebrating' : 'guiding'}
            message={
              isCompleted
                ? "¡Excelente compromiso! Cada acción que realizas en tu colegio suma para proteger la naturaleza. ¡Eres un orgullo!"
                : "Recuerda: las pequeñas acciones diarias en tu puesto y salón hacen que nuestro colegio sea un lugar mágico y limpio."
            }
            size="sm"
          />
        </div>
      </div>

      {/* WEEKLY CHALLENGE CALENDAR */}
      <div className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-md space-y-4">
        <h4 className="font-fun font-black text-xl text-emerald-950 flex items-center gap-2">
          <span>📅</span>
          <span>Todos los Retos de la Semana</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAILY_CHALLENGES.map((challenge) => {
            const isDone = completedChallenges.includes(challenge.id);
            const isSelected = selectedChallengeId === challenge.id;

            return (
              <div
                key={challenge.id}
                onClick={() => {
                  sounds.playPop();
                  setSelectedChallengeId(challenge.id);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/60 shadow-md ring-2 ring-amber-300'
                    : isDone
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-90'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-2xl flex-shrink-0">
                  {isDone ? '✅' : challenge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black text-amber-800 uppercase">
                      {challenge.dayLabel}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">
                      +{challenge.points} pts
                    </span>
                  </div>
                  <h5 className="font-fun font-bold text-sm text-slate-800 truncate">
                    {challenge.title}
                  </h5>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {challenge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
