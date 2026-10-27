import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Flame, Award, Sparkles, RefreshCw, ArrowUp, Heart, CheckCircle2 } from 'lucide-react';
import { api, RankedUser, StudentProfile } from '../../services/api';
import { AVATAR_OPTIONS } from '../auth/AuthModal';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';

interface RankingViewProps {
  currentUser: StudentProfile | null;
  onOpenAuth: () => void;
  onNavigate: (tab: string) => void;
}

export const RankingView: React.FC<RankingViewProps> = ({
  currentUser,
  onOpenAuth,
  onNavigate,
}) => {
  const [rankingMode, setRankingMode] = useState<'general' | 'weekly'>('general');
  const [rankedList, setRankedList] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = rankingMode === 'general'
        ? await api.getGeneralRanking()
        : await api.getWeeklyRanking();
      setRankedList(res.ranking);
    } catch (err: unknown) {
      setErrorMsg('No se pudo cargar la tabla de clasificación en este momento.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [rankingMode]);

  const getAvatarEmoji = (avatarId: string) => {
    const found = AVATAR_OPTIONS.find(a => a.id === avatarId);
    return found ? found.emoji : '🌱';
  };

  // Top 3 Podium
  const top1 = rankedList[0];
  const top2 = rankedList[1];
  const top3 = rankedList[2];

  // Current user position in this list
  const userRankEntry = currentUser
    ? rankedList.find(u => u.id === currentUser.id)
    : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Ranking Ecológico
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            ¡Descubre a los grandes guardianes del planeta de nuestra escuela!
          </p>
        </div>

        {/* Tab switch: General / Semanal */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-amber-50 rounded-2xl border border-amber-200">
            <button
              onClick={() => {
                sounds.playPop();
                setRankingMode('general');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                rankingMode === 'general'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              Ranking General
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setRankingMode('weekly');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                rankingMode === 'weekly'
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              Esta Semana 📅
            </button>
          </div>

          <button
            onClick={fetchRanking}
            title="Actualizar tabla"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-transform hover:rotate-180 duration-300"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* POSITIVE MOTIVATIONAL MESSAGES BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-bold">
          <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>¡Sigue cuidando tu colegio para subir de posición!</span>
        </div>
        <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-sky-900 font-bold">
          <Heart className="w-4 h-4 text-sky-600 flex-shrink-0" />
          <span>¡Cada acción cuenta para salvar ríos y árboles!</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-amber-900 font-bold">
          <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>¡Puedes convertirte en un campeón ambiental!</span>
        </div>
        <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-2xl flex items-center gap-2 text-xs text-teal-900 font-bold">
          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>¡Tu esfuerzo diario ayuda al planeta!</span>
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {rankedList.length >= 1 && (
        <div className="bg-gradient-to-b from-amber-100/60 via-emerald-50 to-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-xl">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full">
              Podio de Honor
            </span>
            <h3 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950 mt-1">
              Los Guardianes Más Activos
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-end justify-center gap-4 max-w-2xl mx-auto pt-6">
            {/* 2nd Place (Silver) */}
            {top2 ? (
              <div className="w-full sm:w-1/3 flex flex-col items-center order-2 sm:order-1">
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 border-4 border-slate-300 flex items-center justify-center text-3xl shadow-md">
                    {getAvatarEmoji(top2.avatarId)}
                  </div>
                  <span className="absolute -top-3 -right-2 text-2xl drop-shadow-sm">🥈</span>
                </div>
                <h4 className="font-fun font-bold text-base text-slate-800 text-center truncate max-w-full">
                  {top2.username}
                </h4>
                <span className="text-xs font-black text-emerald-700">
                  🌿 {rankingMode === 'weekly' ? top2.weeklyPoints : top2.greenPoints} pts
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                  {top2.levelName}
                </span>
                <div className="w-full h-20 bg-slate-200/80 rounded-t-2xl mt-3 flex items-center justify-center font-fun font-black text-2xl text-slate-600 shadow-inner">
                  2°
                </div>
              </div>
            ) : null}

            {/* 1st Place (Gold) */}
            {top1 && (
              <div className="w-full sm:w-1/3 flex flex-col items-center order-1 sm:order-2">
                <div className="relative mb-2">
                  <div className="w-20 h-20 rounded-3xl bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl shadow-xl ring-4 ring-amber-300/50 animate-bounce-gentle">
                    {getAvatarEmoji(top1.avatarId)}
                  </div>
                  <span className="absolute -top-4 -right-2 text-3xl drop-shadow-md">🥇</span>
                </div>
                <h4 className="font-fun font-black text-lg text-emerald-950 text-center truncate max-w-full">
                  {top1.username}
                </h4>
                <span className="text-sm font-black text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full mt-0.5">
                  🌿 {rankingMode === 'weekly' ? top1.weeklyPoints : top1.greenPoints} pts
                </span>
                <span className="text-xs text-emerald-800 font-bold mt-0.5">
                  👑 {top1.levelName}
                </span>
                <div className="w-full h-28 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-2xl mt-3 flex items-center justify-center font-fun font-black text-3xl text-amber-950 shadow-md">
                  1°
                </div>
              </div>
            )}

            {/* 3rd Place (Bronze) */}
            {top3 ? (
              <div className="w-full sm:w-1/3 flex flex-col items-center order-3">
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 border-4 border-amber-600/40 flex items-center justify-center text-3xl shadow-md">
                    {getAvatarEmoji(top3.avatarId)}
                  </div>
                  <span className="absolute -top-3 -right-2 text-2xl drop-shadow-sm">🥉</span>
                </div>
                <h4 className="font-fun font-bold text-base text-slate-800 text-center truncate max-w-full">
                  {top3.username}
                </h4>
                <span className="text-xs font-black text-emerald-700">
                  🌿 {rankingMode === 'weekly' ? top3.weeklyPoints : top3.greenPoints} pts
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                  {top3.levelName}
                </span>
                <div className="w-full h-14 bg-amber-700/20 rounded-t-2xl mt-3 flex items-center justify-center font-fun font-black text-2xl text-amber-900 shadow-inner">
                  3°
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* USER PERSONAL RANKING CARD (IF LOGGED IN) */}
      {currentUser ? (
        <div className="bg-emerald-600 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl border-2 border-white/40">
              {getAvatarEmoji(currentUser.avatarId)}
            </div>
            <div>
              <span className="text-xs font-black uppercase text-emerald-200">
                Tu Posición Actual
              </span>
              <h4 className="font-fun font-black text-xl leading-tight">
                {currentUser.username}
              </h4>
              <p className="text-xs text-emerald-100">
                {currentUser.levelName} • 🔥 Racha de {currentUser.streak} días
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                Puntos Acumulados
              </span>
              <span className="font-fun font-black text-2xl leading-none">
                🌿 {currentUser.greenPoints}
              </span>
            </div>
            <div className="bg-amber-400 text-amber-950 font-fun font-black text-2xl px-4 py-2 rounded-2xl shadow-md border-2 border-amber-500">
              #{userRankEntry ? userRankEntry.rank : currentUser.rank || 1}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EcoMascot mood="guiding" size="sm" showSpeechBubble={false} />
            <div>
              <h4 className="font-fun font-bold text-base text-emerald-950">
                ¿Quieres aparecer en el ranking ecológico?
              </h4>
              <p className="text-xs text-slate-600">
                Inicia sesión o crea tu cuenta gratuita para registrar tus puntos y rachas diarias.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-sm shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Iniciar sesión / Crear cuenta
          </button>
        </div>
      )}

      {/* FULL RANKING TABLE */}
      <div className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-md space-y-4">
        <h4 className="font-fun font-black text-xl text-emerald-950 flex items-center gap-2">
          <span>📜</span>
          <span>Tabla Completa de Estudiantes</span>
        </h4>

        {loading ? (
          <div className="text-center py-8 text-slate-500 font-medium text-sm">
            Cargando clasificación...
          </div>
        ) : rankedList.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-medium text-sm">
            Aún no hay estudiantes registrados en este ranking. ¡Sé el primero en participar!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            {rankedList.map((user) => {
              const isMe = currentUser?.id === user.id;

              return (
                <div
                  key={user.id}
                  className={`py-3.5 px-3 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                    isMe
                      ? 'bg-emerald-50 border-2 border-emerald-300 shadow-xs'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Rank position */}
                  <div className="flex items-center gap-3 min-w-[60px]">
                    <span
                      className={`font-fun font-black text-base w-8 h-8 rounded-full flex items-center justify-center ${
                        user.rank === 1
                          ? 'bg-amber-400 text-amber-950'
                          : user.rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : user.rank === 3
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-600 text-sm'
                      }`}
                    >
                      {user.rank}
                    </span>
                    <span className="text-2xl">{getAvatarEmoji(user.avatarId)}</span>
                  </div>

                  {/* Username & Level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-fun font-bold text-sm text-slate-900 truncate">
                        {user.username}
                      </span>
                      {isMe && (
                        <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">
                          Tú
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block truncate">
                      {user.levelName}
                    </span>
                  </div>

                  {/* Points & Streak */}
                  <div className="flex items-center gap-3 text-right">
                    <div className="hidden xs:block text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      🔥 {user.streak}d
                    </div>
                    <div>
                      <span className="font-fun font-black text-base text-emerald-900 block leading-tight">
                        🌿 {rankingMode === 'weekly' ? user.weeklyPoints : user.greenPoints}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        Puntos
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
