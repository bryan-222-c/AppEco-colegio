import React from 'react';
import { X, CheckCircle, Sparkles, Trophy, Lightbulb } from 'lucide-react';
import { EcoMascot } from './EcoMascot';
import { sounds } from '../utils/audio';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlaying: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onStartPlaying,
}) => {
  if (!isOpen) return null;

  const handleStart = () => {
    sounds.playFanfare();
    onClose();
    onStartPlaying();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-emerald-400 shadow-2xl relative p-5 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b-2 border-emerald-100 pb-4 mb-5">
          <EcoMascot
            mood="happy"
            size="md"
            showSpeechBubble={false}
          />
          <div className="text-center sm:text-left">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-0.5 rounded-full mb-1">
              GUÍA PARA NIÑOS
            </span>
            <h2 className="font-fun text-2xl sm:text-3xl font-black text-emerald-800">
              ¿Cómo jugar en ECO-COLEGIO?
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              ¡Hola! Soy <strong className="text-emerald-700">Eco</strong>, tu amigo ambiental. ¡Aquí te enseño cómo ganar puntos y salvar el planeta!
            </p>
          </div>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3.5 flex gap-3 items-start">
            <span className="text-2xl bg-white p-2 rounded-xl shadow-xs border border-emerald-200">1️⃣</span>
            <div>
              <h3 className="font-fun font-bold text-emerald-900 text-base">Separa los Residuos</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                Arrastra o toca cada residuo para llevarlo a su caneca: <strong>Blanca</strong> (aprovechables), <strong>Verde</strong> (orgánicos) o <strong>Negra</strong> (no aprovechables).
              </p>
            </div>
          </div>

          <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-3.5 flex gap-3 items-start">
            <span className="text-2xl bg-white p-2 rounded-xl shadow-xs border border-teal-200">2️⃣</span>
            <div>
              <h3 className="font-fun font-bold text-teal-900 text-base">Misión Colegio Limpio</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                Entra al salón, patio y cafetería. Encuentra los problemas ecológicos, recoge papeles y cierra grifos abiertos.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 flex gap-3 items-start">
            <span className="text-2xl bg-white p-2 rounded-xl shadow-xs border border-amber-200">3️⃣</span>
            <div>
              <h3 className="font-fun font-bold text-amber-900 text-base">Verdadero o Falso</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                Responde preguntas divertidas sobre reciclaje y agua. ¡Aprenderás secretos geniales con cada respuesta!
              </p>
            </div>
          </div>

          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3.5 flex gap-3 items-start">
            <span className="text-2xl bg-white p-2 rounded-xl shadow-xs border border-sky-200">4️⃣</span>
            <div>
              <h3 className="font-fun font-bold text-sky-900 text-base">Construye tu Colegio</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                Usa tus <strong>Puntos Verdes</strong> para plantar guayacanes, huertos, paneles solares y colibríes en tu colegio virtual.
              </p>
            </div>
          </div>
        </div>

        {/* Tip Banner */}
        <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-3 mb-6 flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-amber-900 font-semibold">
            ¡Tranquilo si te equivocas! Aquí no hay castigos: cada error es una oportunidad para aprender a cuidar mejor la naturaleza.
          </p>
        </div>

        {/* Big Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Entendido
          </button>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-fun font-black text-lg shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>¡Empezar a Jugar!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
