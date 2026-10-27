import React, { useState } from 'react';
import { TrendingDown, ArrowDownRight, Trees, Droplets, Zap, CheckCircle2, Sparkles, Scale, RefreshCw, Award, Heart, HelpCircle } from 'lucide-react';
import { StudentProfile } from '../../services/api';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';

interface ImpactComparisonProps {
  currentUser: StudentProfile | null;
  onNavigate: (tab: string) => void;
}

export const ImpactComparisonView: React.FC<ImpactComparisonProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [viewMode, setViewMode] = useState<'colegio' | 'personal'>('colegio');

  // School aggregate comparative data: "Antes de ECO-COLEGIO" vs "Con ECO-COLEGIO (Mensual)"
  const schoolComparisonData = [
    {
      category: 'Basura al Relleno Sanitario',
      icon: '🗑️',
      description: 'Residuos no aprovechables arrojados al relleno sanitario (Doña Juana / relleno local)',
      beforeKg: 480,
      afterKg: 155,
      unit: 'kg/mes',
      percentChange: -68,
      status: 'good',
      note: '¡68% menos basura enviada a contaminar el relleno sanitario!',
      color: 'rose',
    },
    {
      category: 'Plásticos Aprovechados (Caneca Blanca)',
      icon: '🍾',
      description: 'Botellas PET, vasos y empaques limpios separados y entregados a recicladores',
      beforeKg: 14,
      afterKg: 125,
      unit: 'kg/mes',
      percentChange: 793,
      status: 'good',
      note: 'Equivalente a rescatar más de 3,750 botellas plásticas cada mes.',
      color: 'sky',
    },
    {
      category: 'Papel y Cartón Reciclado (Caneca Blanca)',
      icon: '📦',
      description: 'Hojas de cuaderno, fotocopias y cajas de cartón limpias recicladas',
      beforeKg: 28,
      afterKg: 160,
      unit: 'kg/mes',
      percentChange: 471,
      status: 'good',
      note: 'Salva aproximadamente 2.7 árboles adultos del bosque al mes.',
      color: 'amber',
    },
    {
      category: 'Residuos Orgánicos para Compost (Caneca Verde)',
      icon: '🍌',
      description: 'Cáscaras de banano, manzanas y restos de fruta de la cafetería',
      beforeKg: 5,
      afterKg: 110,
      unit: 'kg/mes',
      percentChange: 2100,
      status: 'good',
      note: 'Convertidos en abono fértil para el huerto escolar y jardines.',
      color: 'emerald',
    },
    {
      category: 'Pilas y Electrónicos Aislados (Punto Rojo)',
      icon: '🔋',
      description: 'Pilas gastadas y bombillos depositados en contenedores especiales',
      beforeKg: 0,
      afterKg: 12,
      unit: 'kg/mes',
      percentChange: 1200,
      status: 'good',
      note: 'Evitó la contaminación química de más de 45,000 litros de agua subterránea.',
      color: 'purple',
    },
  ];

  // Calculate personal estimated impact based on student points
  const points = currentUser ? currentUser.greenPoints : 80;
  const personalWasteSeparatedKg = Math.max(1.2, Math.round((points * 0.08) * 10) / 10);
  const personalBottlesSaved = Math.max(3, Math.round(points * 0.45));
  const personalWaterSavedLiters = Math.max(25, Math.round(points * 2.8));
  const personalCo2AvoidedKg = Math.max(0.8, Math.round((points * 0.05) * 10) / 10);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Cuadro Comparativo de Reducción de Basura
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Descubre cuánta basura mensual se redujo en la escuela gracias al uso de <strong>ECO-COLEGIO</strong>.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex p-1 bg-emerald-50 rounded-2xl border border-emerald-200">
          <button
            onClick={() => {
              sounds.playPop();
              setViewMode('colegio');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'colegio'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            🏫 Impacto del Colegio
          </button>
          <button
            onClick={() => {
              sounds.playPop();
              setViewMode('personal');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              viewMode === 'personal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            🌱 Mi Aporte Personal
          </button>
        </div>
      </div>

      {/* BIG SUMMARY IMPACT BANNER */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-400 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full border border-white/30 inline-block">
              RESULTADO GLOBAL MENSUAL
            </span>
            <h3 className="font-fun font-black text-3xl sm:text-4xl text-amber-300 drop-shadow-sm">
              ¡325 kg menos de basura al mes!
            </h3>
            <p className="text-sm sm:text-base text-emerald-100 max-w-xl leading-relaxed">
              Al separar los residuos en las canecas blanca, verde y negra, el colegio pasó de botar <strong>480 kg</strong> a solo <strong>155 kg</strong> de basura mensual no aprovechable.
            </p>
          </div>

          <div className="flex-shrink-0 bg-white/10 backdrop-blur-xs p-4 rounded-3xl border-2 border-white/30 text-center">
            <span className="text-xs font-bold uppercase text-emerald-200 block">Reducción Total</span>
            <div className="flex items-center justify-center gap-1 font-fun font-black text-5xl sm:text-6xl text-amber-300 leading-tight">
              <TrendingDown className="w-10 h-10 text-amber-300 stroke-[3]" />
              <span>-68%</span>
            </div>
            <span className="text-[11px] text-emerald-100 font-semibold block mt-1">
              de basura enviada a rellenos
            </span>
          </div>
        </div>

        {/* 4 Quick Impact Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20 text-center">
            <Trees className="w-6 h-6 mx-auto text-amber-300 mb-1" />
            <span className="font-fun font-black text-2xl text-white block">~3 Árboles</span>
            <span className="text-[11px] text-emerald-100 font-medium">salvados cada mes</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20 text-center">
            <Droplets className="w-6 h-6 mx-auto text-sky-300 mb-1" />
            <span className="font-fun font-black text-2xl text-white block">~60,000 L</span>
            <span className="text-[11px] text-emerald-100 font-medium">de agua limpia protegida</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20 text-center">
            <Zap className="w-6 h-6 mx-auto text-amber-300 mb-1" />
            <span className="font-fun font-black text-2xl text-white block">340 kWh</span>
            <span className="text-[11px] text-emerald-100 font-medium">de energía ahorrada</span>
          </div>

          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-3.5 border border-white/20 text-center">
            <Sparkles className="w-6 h-6 mx-auto text-teal-300 mb-1" />
            <span className="font-fun font-black text-2xl text-white block">110 kg</span>
            <span className="text-[11px] text-emerald-100 font-medium">de abono natural creado</span>
          </div>
        </div>
      </div>

      {viewMode === 'colegio' ? (
        /* COMPARATIVE TABLE & VISUAL BARS (SCHOOL LEVEL) */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Medición Escolar Mensual
              </span>
              <h3 className="font-fun font-black text-2xl text-slate-900 mt-1">
                Comparativa Antes vs Después de ECO-COLEGIO
              </h3>
            </div>

            <EcoMascot
              mood="happy"
              message="¡Mira cómo los números demuestran que separar residuos en el colegio salva nuestro planeta!"
              size="sm"
              showSpeechBubble={false}
            />
          </div>

          {/* TABLE OF COMPARISON */}
          <div className="space-y-4">
            {schoolComparisonData.map((item, idx) => {
              const maxVal = Math.max(item.beforeKg, item.afterKg);
              const beforePercent = Math.round((item.beforeKg / (maxVal || 1)) * 100);
              const afterPercent = Math.round((item.afterKg / (maxVal || 1)) * 100);
              const isReduction = item.percentChange < 0;

              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-4 sm:p-5 border-2 border-slate-200 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="font-fun font-bold text-base text-slate-900">
                          {item.category}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block line-through">
                          Antes: {item.beforeKg} {item.unit}
                        </span>
                        <span className="font-fun font-black text-lg text-emerald-800">
                          Con ECO-COLEGIO: {item.afterKg} {item.unit}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1.5 rounded-xl font-fun font-black text-xs sm:text-sm flex items-center gap-1 ${
                          isReduction
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-teal-100 text-teal-800 border border-teal-300'
                        }`}
                      >
                        <span>{isReduction ? '📉' : '📈'}</span>
                        <span>{item.percentChange > 0 ? `+${item.percentChange}%` : `${item.percentChange}%`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Dual Bars */}
                  <div className="space-y-1.5 pt-1">
                    {/* Before Bar */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-slate-500 font-bold text-[11px] truncate">
                        Antes (Sin separar):
                      </span>
                      <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-400 h-full rounded-full"
                          style={{ width: `${Math.max(4, beforePercent)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-slate-600 font-bold text-[11px]">
                        {item.beforeKg} kg
                      </span>
                    </div>

                    {/* After Bar */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-emerald-800 font-black text-[11px] truncate">
                        Con ECO-COLEGIO:
                      </span>
                      <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isReduction ? 'bg-emerald-500' : 'bg-teal-500'
                          }`}
                          style={{ width: `${Math.max(4, afterPercent)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-emerald-800 font-black text-[11px]">
                        {item.afterKg} kg
                      </span>
                    </div>
                  </div>

                  {/* Footnote badge */}
                  <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{item.note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* PERSONAL IMPACT CALCULATOR */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Simulador de Aporte Individual
              </span>
              <h3 className="font-fun font-black text-2xl text-slate-900 mt-1">
                Tu Impacto Personal como {currentUser ? currentUser.username : 'Eco-Estudiante'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Calculado en base a tus <strong>{points} Puntos Verdes</strong> y actividades completadas en la app.
              </p>
            </div>

            <EcoMascot
              mood="celebrating"
              message="¡Tus acciones individuales suman a la gran meta escolar! ¡Tú eres parte de este cambio!"
              size="sm"
              showSpeechBubble={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50 rounded-3xl p-5 border-2 border-emerald-300 text-center space-y-2">
              <span className="text-4xl block">🗑️</span>
              <span className="font-fun font-black text-3xl text-emerald-950 block">
                {personalWasteSeparatedKg} kg
              </span>
              <h4 className="font-fun font-bold text-sm text-emerald-900">
                Basura Evitada
              </h4>
              <p className="text-xs text-slate-600">
                Residuos que desviaste de los basureros gracias a separarlos correctamente.
              </p>
            </div>

            <div className="bg-sky-50 rounded-3xl p-5 border-2 border-sky-300 text-center space-y-2">
              <span className="text-4xl block">🍾</span>
              <span className="font-fun font-black text-3xl text-sky-950 block">
                {personalBottlesSaved}
              </span>
              <h4 className="font-fun font-bold text-sm text-sky-900">
                Botellas Rescatadas
              </h4>
              <p className="text-xs text-slate-600">
                Envases plásticos dirigidos a renacer en nuevos productos y juguetes.
              </p>
            </div>

            <div className="bg-teal-50 rounded-3xl p-5 border-2 border-teal-300 text-center space-y-2">
              <span className="text-4xl block">💧</span>
              <span className="font-fun font-black text-3xl text-teal-950 block">
                {personalWaterSavedLiters} L
              </span>
              <h4 className="font-fun font-bold text-sm text-teal-900">
                Agua Limpia Ahorrada
              </h4>
              <p className="text-xs text-slate-600">
                Gotas de agua preservadas al cerrar llaves y lavar recipientes responsablemente.
              </p>
            </div>

            <div className="bg-purple-50 rounded-3xl p-5 border-2 border-purple-300 text-center space-y-2">
              <span className="text-4xl block">🌍</span>
              <span className="font-fun font-black text-3xl text-purple-950 block">
                {personalCo2AvoidedKg} kg
              </span>
              <h4 className="font-fun font-bold text-sm text-purple-900">
                CO₂ Evitado
              </h4>
              <p className="text-xs text-slate-600">
                Gases de efecto invernadero evitados al reciclar y apagar luces del aula.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-amber-950 font-semibold">
                ¡Sigue jugando y completando misiones para ver crecer tu impacto en el planeta!
              </p>
            </div>

            <button
              onClick={() => onNavigate('juegos')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-fun font-bold text-xs shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              ¡Seguir sumando puntos!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
