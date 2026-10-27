import React from 'react';
import { Users, Heart, Sparkles, ShieldCheck, ArrowLeft, School } from 'lucide-react';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';

interface CreatorsViewProps {
  onNavigate: (tab: string) => void;
}

export const CreatorsView: React.FC<CreatorsViewProps> = ({ onNavigate }) => {
  const creators = [
    {
      id: 'bryan',
      name: 'Bryan Conrado',
      icon: '🌱',
      tag: 'Equipo Creador',
      color: 'from-emerald-400 to-teal-500',
      border: 'border-emerald-300',
      bg: 'bg-emerald-50/70',
    },
    {
      id: 'alisson',
      name: 'Alisson Quintero',
      icon: '🌿',
      tag: 'Equipo Creador',
      color: 'from-teal-400 to-cyan-500',
      border: 'border-teal-300',
      bg: 'bg-teal-50/70',
    },
    {
      id: 'juan_david',
      name: 'Juan David Bedoya',
      icon: '🍀',
      tag: 'Equipo Creador',
      color: 'from-amber-400 to-emerald-500',
      border: 'border-amber-300',
      bg: 'bg-amber-50/70',
    },
    {
      id: 'michell',
      name: 'Michell Barrientos',
      icon: '🌸',
      tag: 'Equipo Creador',
      color: 'from-sky-400 to-teal-500',
      border: 'border-sky-300',
      bg: 'bg-sky-50/70',
    },
    {
      id: 'joan',
      name: 'Joan Argumedo',
      icon: '🌻',
      tag: 'Equipo Creador',
      color: 'from-green-400 to-emerald-600',
      border: 'border-green-300',
      bg: 'bg-green-50/70',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              ¿Quiénes crearon ECO-COLEGIO?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Conoce al equipo detrás de este proyecto educativo ambiental para niños.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onNavigate('inicio');
          }}
          className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>
      </div>

      {/* TEAM MANIFESTO CARD */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl p-6 sm:p-10 border-4 border-emerald-300 shadow-xl space-y-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Nuestra Misión y Compromiso Ambiental</span>
        </div>

        {/* Exact text requested in prompt requirement #9 */}
        <div className="max-w-3xl mx-auto bg-white/90 p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-sm">
          <p className="font-fun font-bold text-lg sm:text-2xl text-emerald-950 leading-relaxed">
            “Somos un equipo comprometido con el cuidado del medioambiente. Creamos ECO-COLEGIO para enseñar a los niños que, mediante pequeñas acciones, podemos mantener nuestra institución limpia, reducir los residuos y construir un futuro más sostenible.”
          </p>
        </div>

        <div className="flex justify-center">
          <EcoMascot
            mood="happy"
            message="¡Gracias a nuestros creadores por soñar una escuela donde cada niño es un guardián de la Tierra!"
            size="md"
          />
        </div>
      </div>

      {/* CREATOR MEMBER CARDS */}
      <div>
        <div className="text-center mb-6">
          <h3 className="font-fun font-black text-2xl text-emerald-950">
            Integrantes del Equipo
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Unidos por la educación, la sostenibilidad y el amor a la naturaleza.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className={`${creator.bg} rounded-3xl p-6 border-3 ${creator.border} shadow-md hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-between hover:-translate-y-1`}
            >
              <div className="w-full flex flex-col items-center">
                {/* Visual Icon Avatar */}
                <div
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${creator.color} flex items-center justify-center text-4xl shadow-md shadow-emerald-200 mb-4 transform hover:rotate-6 transition-transform`}
                >
                  {creator.icon}
                </div>

                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-white px-3 py-0.5 rounded-full border border-emerald-200 mb-2">
                  {creator.tag}
                </span>

                <h4 className="font-fun font-black text-xl text-slate-900 mt-1">
                  {creator.name}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200/60 w-full">
                <span className="text-xs font-semibold text-slate-600 block">
                  ECO-COLEGIO 🌱
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Values Footer Banner */}
      <div className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl">
            🏫
          </div>
          <div>
            <h4 className="font-fun font-bold text-base text-emerald-950">
              Educación Ambiental para la Vida
            </h4>
            <p className="text-xs text-slate-600">
              Formando las futuras generaciones que cuidarán nuestros bosques, ríos y colegios.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playFanfare();
            onNavigate('juego_clasificar');
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          ¡Jugar ahora!
        </button>
      </div>
    </div>
  );
};
