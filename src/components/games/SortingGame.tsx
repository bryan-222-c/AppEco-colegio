import React, { useState } from 'react';
import { Sparkles, RotateCcw, Check, AlertCircle, Info, Award, ArrowRight } from 'lucide-react';
import { WASTE_ITEMS, BINS_INFO } from '../../data/wasteItems';
import { BinCategory, WasteItem } from '../../types/eco';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/storage';

interface SortingGameProps {
  onAddPoints: (pts: number, type: 'waste' | 'mission' | 'quiz') => void;
  onNavigate: (tab: string) => void;
}

export const SortingGame: React.FC<SortingGameProps> = ({
  onAddPoints,
  onNavigate,
}) => {
  // Shuffle or get a round of items
  const [itemsPool, setItemsPool] = useState<WasteItem[]>(() => {
    return [...WASTE_ITEMS].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedBin, setSelectedBin] = useState<BinCategory | null>(null);
  const [feedback, setFeedback] = useState<{
    status: 'success' | 'wrong' | null;
    message: string;
    item?: WasteItem;
  }>({ status: null, message: '' });
  const [streak, setStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isCompletedRound, setIsCompletedRound] = useState<boolean>(false);
  const [draggedOverBin, setDraggedOverBin] = useState<BinCategory | null>(null);

  const currentItem = itemsPool[currentIndex];

  const handleClassify = (targetCategory: BinCategory) => {
    if (!currentItem || feedback.status !== null) return;

    if (currentItem.category === targetCategory) {
      // SUCCESS!
      sounds.playSuccess();
      sounds.playDrop();
      triggerConfetti(0.65);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectCount(prev => prev + 1);
      onAddPoints(currentItem.points, 'waste');

      setFeedback({
        status: 'success',
        message: `¡Excelente! ${currentItem.explanation}`,
        item: currentItem,
      });

      setTimeout(() => {
        advanceNextItem(newStreak);
      }, 1900);
    } else {
      // KIND HINT / WRONG
      sounds.playGentleHint();
      setStreak(0);

      let hint = '';
      if (currentItem.category === 'especial') {
        hint = '¡Cuidado! Las pilas y electrónicos nunca van en las canecas comunes; requieren un punto especial de recolección.';
      } else if (currentItem.category === 'blanco') {
        hint = `¡Casi! Recuerda que ${currentItem.name.toLowerCase()} está limpio y seco, así que va en la Caneca Blanca de aprovechables.`;
      } else if (currentItem.category === 'verde') {
        hint = `¡Atención! Las cáscaras y sobras de alimentos van en la Caneca Verde para convertirse en abono orgánico.`;
      } else {
        hint = `¡Pista! Las servilletas sucias y paquetes de frituras no se pueden reciclar y van a la Caneca Negra.`;
      }

      setFeedback({
        status: 'wrong',
        message: hint,
        item: currentItem,
      });

      // Clear wrong feedback after 3.2 seconds so child can try again
      setTimeout(() => {
        setFeedback({ status: null, message: '' });
      }, 3200);
    }
  };

  const advanceNextItem = (currentStreakVal: number) => {
    setFeedback({ status: null, message: '' });
    setSelectedBin(null);
    if (currentIndex + 1 < itemsPool.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all items in pool!
      setIsCompletedRound(true);
      sounds.playFanfare();
      triggerConfetti(0.5);
    }
  };

  const restartGame = () => {
    sounds.playPop();
    setItemsPool([...WASTE_ITEMS].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setCorrectCount(0);
    setStreak(0);
    setIsCompletedRound(false);
    setFeedback({ status: null, message: '' });
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    sounds.playPop();
    e.dataTransfer.setData('text/plain', currentItem.category);
  };

  const handleDragOver = (e: React.DragEvent, cat: BinCategory) => {
    e.preventDefault();
    setDraggedOverBin(cat);
  };

  const handleDragLeave = () => {
    setDraggedOverBin(null);
  };

  const handleDrop = (e: React.DragEvent, cat: BinCategory) => {
    e.preventDefault();
    setDraggedOverBin(null);
    handleClassify(cat);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗑️</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              ¿Dónde va cada residuo?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Arrastra el residuo o haz clic sobre la caneca correcta según la norma colombiana.
          </p>
        </div>

        {/* Counters & Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border-2 border-amber-300 px-3.5 py-1.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-amber-700 block">Racha</span>
            <span className="font-fun font-black text-lg text-amber-900 leading-tight">
              🔥 {streak}
            </span>
          </div>
          <div className="bg-emerald-50 border-2 border-emerald-300 px-3.5 py-1.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Aciertos</span>
            <span className="font-fun font-black text-lg text-emerald-900 leading-tight">
              ✅ {correctCount} / {itemsPool.length}
            </span>
          </div>
          <button
            onClick={restartGame}
            title="Reiniciar juego"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform hover:rotate-180 duration-300 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Game Stage */}
      {!isCompletedRound ? (
        <div className="space-y-6">
          {/* Active Residue Card Area */}
          <div className="bg-gradient-to-b from-sky-50 via-white to-emerald-50 rounded-3xl p-6 sm:p-8 border-3 border-sky-300 shadow-lg text-center relative overflow-hidden">
            {/* Progress bar */}
            <div className="max-w-md mx-auto mb-4">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Residuo {currentIndex + 1} de {itemsPool.length}</span>
                <span>{Math.round(((currentIndex) / itemsPool.length) * 100)}% completado</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex) / itemsPool.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Draggable Item Card */}
            {currentItem && (
              <div className="max-w-sm mx-auto">
                <div
                  draggable={feedback.status === null}
                  onDragStart={handleDragStart}
                  className={`bg-white rounded-3xl p-6 border-4 shadow-xl select-none transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    feedback.status === 'success'
                      ? 'border-emerald-500 bg-emerald-50 scale-105'
                      : feedback.status === 'wrong'
                      ? 'border-rose-400 bg-rose-50 animate-bounce-gentle'
                      : 'border-sky-400 hover:border-sky-500 hover:scale-102 hover:shadow-2xl'
                  }`}
                >
                  <div className="text-6xl sm:text-7xl mb-2 filter drop-shadow-md animate-bounce-gentle">
                    {currentItem.icon}
                  </div>
                  <h3 className="font-fun font-black text-xl sm:text-2xl text-slate-800">
                    {currentItem.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                    💡 Pista: {currentItem.tip}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    <span>+{currentItem.points} Puntos Verdes</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-2 font-semibold">
                  👆 Arrástralo a una caneca abajo o toca la caneca para clasificarlo
                </p>
              </div>
            )}

            {/* Feedback Toast Banner */}
            {feedback.status && (
              <div
                className={`mt-4 max-w-lg mx-auto p-4 rounded-2xl border-2 shadow-md animate-fadeIn ${
                  feedback.status === 'success'
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-rose-100 border-rose-400 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-fun font-black text-lg">
                  {feedback.status === 'success' ? (
                    <>
                      <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                      <span>¡Excelente! Ayudaste al planeta</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      <span>¡Casi lo logras! Aprendamos juntos</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm mt-1 font-medium">{feedback.message}</p>
              </div>
            )}
          </div>

          {/* THE 4 RECYCLING BINS */}
          <div>
            <div className="text-center mb-3">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                Selecciona la Caneca Adecuada
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {BINS_INFO.map((bin) => {
                const isOver = draggedOverBin === bin.category;
                const isSpecial = bin.category === 'especial';

                return (
                  <div
                    key={bin.category}
                    onDragOver={(e) => handleDragOver(e, bin.category)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, bin.category)}
                    onClick={() => handleClassify(bin.category)}
                    className={`rounded-3xl p-5 border-4 transition-all duration-200 cursor-pointer select-none text-center flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 ${
                      isOver ? 'scale-105 ring-4 ring-emerald-400' : ''
                    } ${
                      bin.category === 'blanco'
                        ? 'bg-slate-50 border-slate-300 hover:border-sky-400 text-slate-800'
                        : bin.category === 'verde'
                        ? 'bg-emerald-600 border-emerald-700 hover:border-emerald-400 text-white'
                        : bin.category === 'negro'
                        ? 'bg-slate-900 border-slate-950 hover:border-slate-500 text-white'
                        : 'bg-rose-600 border-rose-700 hover:border-rose-400 text-white'
                    }`}
                  >
                    <div>
                      {/* Bin Visual Icon */}
                      <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-inner bg-black/10">
                        {bin.icon}
                      </div>

                      <h4 className="font-fun font-black text-xl mb-0.5">
                        {bin.name}
                      </h4>
                      <p className={`text-xs font-bold opacity-90 ${isSpecial ? 'text-amber-200' : ''}`}>
                        {bin.title}
                      </p>

                      <p className="text-[11px] mt-2 opacity-85 leading-snug">
                        {bin.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/20">
                      <span className="text-[10px] font-black uppercase tracking-wider block opacity-95">
                        Ejemplo: {bin.examples}
                      </span>
                      <button
                        type="button"
                        className={`mt-2 w-full py-2 rounded-xl font-fun font-black text-xs transition-colors shadow-xs ${
                          bin.category === 'blanco'
                            ? 'bg-sky-500 hover:bg-sky-600 text-white'
                            : 'bg-white/20 hover:bg-white/30 text-white'
                        }`}
                      >
                        Depositar aquí
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* VICTORY SCREEN AFTER ROUND */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-emerald-400 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center text-5xl shadow-md animate-bounce-gentle">
            🏆
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
              ¡MISIÓN DE SEPARACIÓN CUMPLIDA!
            </span>
            <h2 className="font-fun font-black text-3xl sm:text-4xl text-emerald-950">
              ¡Eres un auténtico Héroe del Reciclaje!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-md mx-auto">
              Separaste correctamente {correctCount} de {itemsPool.length} residuos. ¡Tu colegio y el planeta te lo agradecen con el corazón!
            </p>
          </div>

          <div className="flex justify-center">
            <EcoMascot
              mood="celebrating"
              message="¡Increíble trabajo! Cada residuo bien clasificado evita contaminación en nuestros ríos y montañas. ¡Sigue así!"
              size="md"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={restartGame}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-fun font-black text-base transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Jugar otra vez</span>
            </button>
            <button
              onClick={() => onNavigate('juego_mision')}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fun font-black text-base shadow-lg shadow-emerald-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Ir a Misión Colegio Limpio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Educational Note about Special Waste */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-2xl flex-shrink-0">
          ⚠️
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-fun font-bold text-rose-950 text-base">
            ¡Importante sobre Pilas y Aparatos Electrónicos!
          </h4>
          <p className="text-xs sm:text-sm text-rose-800 mt-0.5 leading-relaxed">
            Las pilas, celulares y bombillos dañados contienen sustancias químicas tóxicas (mercurio, plomo y litio). <strong>Nunca deben depositarse en las canecas comunes</strong>. Tu colegio tiene puntos especiales de recolección (E-Waste o Caneca Roja) para cuidarnos a todos.
          </p>
        </div>
      </div>
    </div>
  );
};
