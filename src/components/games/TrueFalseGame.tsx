import React, { useState } from 'react';
import { Check, X, Sparkles, RotateCcw, ArrowRight, Lightbulb, Trophy } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions';
import { QuizQuestion } from '../../types/eco';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/storage';

interface TrueFalseGameProps {
  onAddPoints: (pts: number, type: 'waste' | 'mission' | 'quiz') => void;
  onNavigate: (tab: string) => void;
}

export const TrueFalseGame: React.FC<TrueFalseGameProps> = ({
  onAddPoints,
  onNavigate,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    return [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === currentQ.isTrue;

  const handleSelectAnswer = (userChoice: boolean) => {
    if (isAnswered) return;
    setSelectedAnswer(userChoice);

    if (userChoice === currentQ.isTrue) {
      sounds.playSuccess();
      triggerConfetti(0.7);
      setScore(prev => prev + 1);
      onAddPoints(20, 'quiz');
    } else {
      sounds.playGentleHint();
    }
  };

  const handleNextQuestion = () => {
    sounds.playPop();
    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      sounds.playFanfare();
      triggerConfetti(0.5);
    }
  };

  const restartQuiz = () => {
    sounds.playPop();
    setQuestions([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">❓</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Verdadero o Falso Ecológico
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            ¡Descubre secretos del agua, las canecas y la energía respondiendo con sinceridad!
          </p>
        </div>

        {/* Score indicator */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border-2 border-emerald-300 px-4 py-1.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Puntaje</span>
            <span className="font-fun font-black text-lg text-emerald-900 leading-tight">
              ⭐ {score} / {questions.length}
            </span>
          </div>
          <button
            onClick={restartQuiz}
            title="Reiniciar cuestionario"
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform hover:rotate-180 duration-300 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-amber-200 shadow-xl space-y-6 relative overflow-hidden">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Pregunta {currentIndex + 1} de {questions.length}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {currentQ.category}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 text-center min-h-[140px] flex items-center justify-center">
            <h3 className="font-fun font-black text-xl sm:text-2xl md:text-3xl text-slate-800 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* True / False Giant Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleSelectAnswer(true)}
              disabled={isAnswered}
              className={`p-5 sm:p-6 rounded-3xl border-4 font-fun font-black text-xl sm:text-2xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
                isAnswered
                  ? currentQ.isTrue
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-102 ring-4 ring-emerald-300'
                    : selectedAnswer === true
                    ? 'bg-rose-400 border-rose-500 text-white opacity-60'
                    : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40'
                  : 'bg-emerald-50 hover:bg-emerald-500 text-emerald-800 hover:text-white border-emerald-400 hover:border-emerald-600 hover:scale-102 shadow-md active:scale-95'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <span>VERDADERO</span>
            </button>

            <button
              onClick={() => handleSelectAnswer(false)}
              disabled={isAnswered}
              className={`p-5 sm:p-6 rounded-3xl border-4 font-fun font-black text-xl sm:text-2xl flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer ${
                isAnswered
                  ? !currentQ.isTrue
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg scale-102 ring-4 ring-emerald-300'
                    : selectedAnswer === false
                    ? 'bg-rose-400 border-rose-500 text-white opacity-60'
                    : 'bg-slate-100 border-slate-200 text-slate-400 opacity-40'
                  : 'bg-rose-50 hover:bg-rose-500 text-rose-800 hover:text-white border-rose-400 hover:border-rose-600 hover:scale-102 shadow-md active:scale-95'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                <X className="w-6 h-6 stroke-[3]" />
              </div>
              <span>FALSO</span>
            </button>
          </div>

          {/* Explanation Banner with Eco */}
          {isAnswered && (
            <div
              className={`rounded-3xl p-5 border-3 animate-fadeIn flex flex-col sm:flex-row items-center gap-4 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex-shrink-0">
                <EcoMascot
                  mood={isCorrect ? 'happy' : 'guiding'}
                  size="sm"
                  showSpeechBubble={false}
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 font-fun font-black text-lg">
                  {isCorrect ? (
                    <span className="text-emerald-700">¡Correcto! +20 Puntos Verdes</span>
                  ) : (
                    <span className="text-amber-800">¡Aprendamos con esta pregunta!</span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {currentQ.explanation}
                </p>
                <p className="text-xs font-bold text-emerald-800 flex items-center justify-center sm:justify-start gap-1 pt-1">
                  <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Eco-Consejo: {currentQ.ecoTip}</span>
                </p>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-black text-sm shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* QUIZ COMPLETE SCREEN */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-amber-300 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-5xl shadow-md animate-bounce-gentle">
            🎓
          </div>

          <div className="space-y-2">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full">
              ¡CUESTIONARIO COMPLETADO!
            </span>
            <h2 className="font-fun font-black text-3xl sm:text-4xl text-emerald-950">
              ¡Gran Sabiduría Ecológica!
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-md mx-auto">
              Acertaste <strong className="text-emerald-700 font-bold">{score} de {questions.length}</strong> preguntas. Ahora conoces muy bien las normas para cuidar tu escuela y el medioambiente.
            </p>
          </div>

          <div className="flex justify-center">
            <EcoMascot
              mood="celebrating"
              message="¡Felicitaciones! El conocimiento es la mejor herramienta para proteger la Tierra. ¡Compártelo con tus profesores y amigos!"
              size="md"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={restartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-fun font-black text-base transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Jugar otra vez</span>
            </button>
            <button
              onClick={() => onNavigate('construir')}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fun font-black text-base shadow-lg shadow-emerald-200 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Ir a Mi Colegio Verde</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
