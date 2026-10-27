import React from 'react';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';

interface GamesHubProps {
  onSelectGame: (gameId: string) => void;
  wasteClassifiedCount: number;
  completedMissionsCount: number;
  placedItemsCount: number;
}

export const GamesHub: React.FC<GamesHubProps> = ({
  onSelectGame,
  wasteClassifiedCount,
  completedMissionsCount,
  placedItemsCount,
}) => {
  const games = [
    {
      id: 'juego_clasificar',
      title: 'Juego 1: ¿Dónde va cada residuo?',
      icon: '🗑️',
      color: 'border-sky-300 bg-sky-50/40 hover:border-sky-500',
      tag: 'Separación y Reciclaje',
      desc: 'Clasifica botellas, latas, cáscaras de fruta, servilletas y pilas en las canecas blanca, verde, negra y puntos especiales.',
      reward: '+15 Puntos por acierto',
      badge: 'Insignia Héroe del Reciclaje',
    },
    {
      id: 'juego_mision',
      title: 'Juego 2: Misión Colegio Limpio',
      icon: '🏫',
      color: 'border-teal-300 bg-teal-50/40 hover:border-teal-500',
      tag: 'Exploración Escolar',
      desc: 'Entra al salón de clases, patio de recreo y cafetería. Recoge basuras del suelo, apaga luces y cierra llaves que gotean.',
      reward: '+25 Puntos por misión',
      badge: 'Insignia Guardián del Agua',
    },
    {
      id: 'juego_quiz',
      title: 'Juego 3: Verdadero o Falso Ecológico',
      icon: '❓',
      color: 'border-amber-300 bg-amber-50/40 hover:border-amber-500',
      tag: 'Trivia Rápida',
      desc: 'Pon a prueba tus conocimientos con preguntas divertidas y explicaciones pedagógicas de Eco.',
      reward: '+20 Puntos por acierto',
      badge: 'Insignia Experto en Residuos',
    },
    {
      id: 'construir',
      title: 'Juego 4: Construye tu Colegio Ecológico',
      icon: '🏗️',
      color: 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-500',
      tag: 'Construcción y Creatividad',
      desc: 'Canjea tus Puntos Verdes por árboles guayacanes, huertos escolares, paneles solares y decora tu propio campus.',
      reward: '¡Tu colegio 100% verde!',
      badge: 'Insignia Arquitecto del Planeta',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Zona de Juegos Ecológicos
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Elige un juego interactivo para aprender divirtiéndote y ganar Puntos Verdes.
          </p>
        </div>

        <EcoMascot
          mood="happy"
          message="¡Cada juego que superes te convertirá en un maestro del reciclaje y desbloqueará decoraciones mágicas!"
          size="sm"
        />
      </div>

      {/* Grid of the 4 games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              sounds.playPop();
              onSelectGame(game.id);
            }}
            className={`rounded-3xl p-6 border-4 ${game.color} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 bg-white`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-center text-4xl">
                  {game.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {game.tag}
                </span>
              </div>

              <h3 className="font-fun font-black text-xl text-slate-900 mb-2">
                {game.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {game.desc}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 block">
                  {game.reward}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {game.badge}
                </span>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
