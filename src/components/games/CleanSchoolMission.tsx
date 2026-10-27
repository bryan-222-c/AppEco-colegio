import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Award, ArrowRight, Lightbulb, RefreshCw, X } from 'lucide-react';
import { MISSION_ZONES } from '../../data/missions';
import { MissionZone, MissionZoneProblem, MissionZoneId, BinCategory } from '../../types/eco';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/storage';

interface CleanSchoolMissionProps {
  completedProblems: string[];
  onSolveProblem: (problemId: string, points: number) => void;
  onNavigate: (tab: string) => void;
}

export const CleanSchoolMission: React.FC<CleanSchoolMissionProps> = ({
  completedProblems,
  onSolveProblem,
  onNavigate,
}) => {
  const [activeZoneId, setActiveZoneId] = useState<MissionZoneId>('salon');
  const [inspectingProblem, setInspectingProblem] = useState<MissionZoneProblem | null>(null);
  const [selectedBinChoice, setSelectedBinChoice] = useState<BinCategory | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const currentZone = MISSION_ZONES.find(z => z.id === activeZoneId) || MISSION_ZONES[0];

  // Calculate zone stats
  const totalZoneProblems = currentZone.problems.length;
  const solvedZoneProblems = currentZone.problems.filter(p => completedProblems.includes(p.id)).length;
  const zonePercent = Math.round((solvedZoneProblems / totalZoneProblems) * 100);
  const isZoneDone = solvedZoneProblems === totalZoneProblems;

  const handleOpenProblem = (p: MissionZoneProblem) => {
    if (completedProblems.includes(p.id)) return;
    sounds.playPop();
    setInspectingProblem(p);
    setSelectedBinChoice(null);
    setActionSuccessMsg(null);
  };

  const handleSolveAction = (problem: MissionZoneProblem, binChosen?: BinCategory) => {
    // If it requires classification
    if (problem.actionType === 'classify' && problem.category) {
      if (binChosen !== problem.category) {
        sounds.playGentleHint();
        return;
      }
    }

    // Success!
    sounds.playSuccess();
    triggerConfetti(0.6);
    onSolveProblem(problem.id, 25);
    setActionSuccessMsg(problem.cleanMessage);

    setTimeout(() => {
      setInspectingProblem(null);
      setActionSuccessMsg(null);
      if (solvedZoneProblems + 1 === totalZoneProblems) {
        // Entire zone finished!
        sounds.playFanfare();
        triggerConfetti(0.4);
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Misión Colegio Limpio
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Explora las 3 zonas escolares, encuentra residuos y soluciona problemas ambientales.
          </p>
        </div>

        {/* Zone Selector Buttons */}
        <div className="flex items-center gap-2 bg-emerald-50 p-1.5 rounded-2xl border border-emerald-200">
          {MISSION_ZONES.map((zone) => {
            const active = activeZoneId === zone.id;
            const solved = zone.problems.filter(p => completedProblems.includes(p.id)).length;
            const done = solved === zone.problems.length;

            return (
              <button
                key={zone.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveZoneId(zone.id);
                  setInspectingProblem(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'text-slate-700 hover:bg-emerald-100'
                }`}
              >
                <span>{zone.icon}</span>
                <span className="hidden xs:inline">{zone.name}</span>
                {done && <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Zone Cleanliness Meter */}
      <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
            {currentZone.icon}
          </div>
          <div>
            <h3 className="font-fun font-bold text-base text-emerald-950">
              {currentZone.name}
            </h3>
            <p className="text-xs text-slate-600">{currentZone.description}</p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
            <span>Limpieza de la zona</span>
            <span className="text-emerald-700">{zonePercent}%</span>
          </div>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${zonePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Scenario Visual Board */}
      <div className="relative overflow-hidden rounded-3xl border-4 border-emerald-400 shadow-xl bg-slate-100 min-h-[380px] sm:min-h-[460px]">
        {/* Background Visual Scene depending on Zone */}
        {activeZoneId === 'salon' && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-50 to-orange-100 flex flex-col justify-between p-6 select-none pointer-events-none">
            {/* Classroom Wall */}
            <div className="flex justify-between items-start">
              {/* Blackboard */}
              <div className="w-64 sm:w-96 h-28 sm:h-36 bg-emerald-800 rounded-xl border-8 border-amber-800 shadow-md p-3 text-emerald-100 flex flex-col justify-center items-center text-center">
                <span className="font-fun font-bold text-xs sm:text-sm text-amber-200">
                  ¡BIENVENIDOS AL AULA VERDE!
                </span>
                <p className="text-[10px] sm:text-xs mt-1 text-emerald-50">
                  Norma #1: Deja tu puesto limpio.<br />
                  Norma #2: Apaga la luz al salir.
                </p>
              </div>

              {/* Window with sun */}
              <div className="w-32 sm:w-44 h-28 sm:h-36 bg-sky-200 rounded-2xl border-4 border-white shadow-inner flex items-center justify-center text-3xl">
                ☀️
              </div>
            </div>

            {/* Classroom floor line */}
            <div className="h-28 bg-amber-200/80 rounded-t-3xl border-t-4 border-amber-300"></div>
          </div>
        )}

        {activeZoneId === 'patio' && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-400 flex flex-col justify-between p-6 select-none pointer-events-none">
            {/* Sky & Trees */}
            <div className="flex justify-between items-start">
              <div className="text-4xl animate-float">☁️</div>
              <div className="text-5xl animate-pulse-subtle">☀️</div>
              <div className="text-3xl animate-float" style={{ animationDelay: '1s' }}>☁️</div>
            </div>

            {/* Grass & Playground Goal */}
            <div className="h-44 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-3xl border-t-4 border-emerald-300 relative">
              <div className="absolute bottom-4 left-6 text-2xl">🌷🌼🌻</div>
              <div className="absolute bottom-6 right-8 text-2xl">🌳</div>
            </div>
          </div>
        )}

        {activeZoneId === 'cafeteria' && (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-orange-50 to-amber-100 flex flex-col justify-between p-6 select-none pointer-events-none">
            {/* Cafeteria Wall & Kitchen counter */}
            <div className="flex justify-between items-start">
              <div className="bg-white/80 p-3 rounded-2xl border-2 border-orange-300 text-xs font-bold text-orange-900">
                🥗 MENÚ DEL DÍA: Frutas y Ensalada Fresca
              </div>
              <div className="text-3xl">🚰</div>
            </div>

            {/* Cafeteria Floor & Wooden tables */}
            <div className="h-40 bg-amber-200 rounded-t-3xl border-t-4 border-amber-400 relative">
              <div className="absolute bottom-4 left-1/4 w-32 h-14 bg-amber-700/60 rounded-xl"></div>
              <div className="absolute bottom-4 right-1/4 w-32 h-14 bg-amber-700/60 rounded-xl"></div>
            </div>
          </div>
        )}

        {/* INTERACTIVE CLICKABLE PROBLEM MARKERS ON SCENARIO */}
        <div className="relative z-10 w-full h-[380px] sm:h-[460px]">
          {currentZone.problems.map((problem) => {
            const isSolved = completedProblems.includes(problem.id);

            return (
              <div
                key={problem.id}
                onClick={() => handleOpenProblem(problem)}
                style={{
                  left: `${problem.xPercent}%`,
                  top: `${problem.yPercent}%`,
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer ${
                  isSolved ? 'opacity-40 scale-75 cursor-default' : 'hover:scale-125'
                }`}
              >
                {/* Visual marker badge */}
                <div
                  className={`relative p-2.5 sm:p-3 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xl transition-all ${
                    isSolved
                      ? 'bg-slate-200 text-slate-400 border-2 border-slate-300'
                      : 'bg-white border-3 border-amber-400 ring-4 ring-amber-300/50 animate-bounce-gentle'
                  }`}
                  title={problem.title}
                >
                  <span>{problem.icon}</span>

                  {isSolved && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}

                  {!isSolved && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black animate-ping">
                      !
                    </div>
                  )}
                </div>

                {/* Short title tag under item */}
                <div className="mt-1 bg-white/95 px-2 py-0.5 rounded-lg shadow-xs border border-slate-200 text-center whitespace-nowrap hidden sm:block">
                  <span className={`text-[10px] font-bold ${isSolved ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {problem.title.split(' ')[0]} {problem.title.split(' ')[1] || ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mascot Hint in Scene */}
        <div className="absolute bottom-3 left-3 z-20">
          <EcoMascot
            mood={isZoneDone ? 'celebrating' : 'guiding'}
            message={
              isZoneDone
                ? `¡Fantástico! Has limpiado todo el ${currentZone.name.toLowerCase()}. ¡Eres un campeón ambiental!`
                : `¡Explora el ${currentZone.name.toLowerCase()}! Haz clic en los objetos que parpadean para resolver cada misión.`
            }
            size="sm"
          />
        </div>
      </div>

      {/* Task Checklist cards below */}
      <div className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-md">
        <h4 className="font-fun font-black text-lg text-emerald-950 mb-3 flex items-center gap-2">
          <span>📋</span>
          <span>Misiones para dejar el {currentZone.name} al 100%</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentZone.problems.map((problem) => {
            const isSolved = completedProblems.includes(problem.id);

            return (
              <div
                key={problem.id}
                onClick={() => handleOpenProblem(problem)}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 cursor-pointer ${
                  isSolved
                    ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                    : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  isSolved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isSolved ? '✅' : problem.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className={`font-fun font-bold text-sm ${isSolved ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                    {problem.title}
                  </h5>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {problem.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE PROBLEM INSPECTION MODAL */}
      {inspectingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-emerald-400 shadow-2xl p-6 relative">
            <button
              onClick={() => setInspectingProblem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-5xl shadow-inner animate-bounce-gentle">
                {inspectingProblem.icon}
              </div>

              <div>
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Misión en {currentZone.name}
                </span>
                <h3 className="font-fun font-black text-2xl text-slate-900 mt-2">
                  {inspectingProblem.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  {inspectingProblem.description}
                </p>
              </div>

              {/* Action Resolution Interface */}
              {actionSuccessMsg ? (
                <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-950 p-4 rounded-2xl animate-fadeIn">
                  <Sparkles className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                  <p className="font-fun font-bold text-base">{actionSuccessMsg}</p>
                  <span className="text-xs font-black text-emerald-800 mt-1 block">+25 Puntos Verdes ganados</span>
                </div>
              ) : inspectingProblem.actionType === 'classify' ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700">
                    ¿En qué caneca o punto debe depositarse este residuo?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSolveAction(inspectingProblem, 'blanco')}
                      className="p-3 rounded-2xl border-2 border-slate-300 bg-white hover:bg-sky-50 font-fun font-bold text-xs text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>🤍 Caneca Blanca</span>
                    </button>
                    <button
                      onClick={() => handleSolveAction(inspectingProblem, 'verde')}
                      className="p-3 rounded-2xl border-2 border-emerald-600 bg-emerald-600 hover:bg-emerald-700 font-fun font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>💚 Caneca Verde</span>
                    </button>
                    <button
                      onClick={() => handleSolveAction(inspectingProblem, 'negro')}
                      className="p-3 rounded-2xl border-2 border-slate-900 bg-slate-900 hover:bg-slate-800 font-fun font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>🖤 Caneca Negra</span>
                    </button>
                    <button
                      onClick={() => handleSolveAction(inspectingProblem, 'especial')}
                      className="p-3 rounded-2xl border-2 border-rose-600 bg-rose-600 hover:bg-rose-700 font-fun font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>🔴 Punto Especial</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => handleSolveAction(inspectingProblem)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fun font-black text-lg shadow-lg shadow-emerald-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <span>{inspectingProblem.actionText}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
