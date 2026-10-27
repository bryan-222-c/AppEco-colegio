import React, { useState } from 'react';
import { Hammer, Sparkles, Plus, Trash2, ArrowRight, RotateCcw, Check, ShoppingBag, Eye, TreePine, Sun, Wind } from 'lucide-react';
import { SCHOOL_DECORATIONS } from '../../data/schoolDecorations';
import { SchoolItemCatalog, PlacedSchoolItem } from '../../types/eco';
import { EcoMascot } from '../EcoMascot';
import { sounds } from '../../utils/audio';
import { triggerConfetti } from '../../utils/storage';

interface BuildSchoolGameProps {
  greenPoints: number;
  placedItems: PlacedSchoolItem[];
  onUpdatePlacedItems: (items: PlacedSchoolItem[], pointsSpent: number) => void;
  onNavigate: (tab: string) => void;
}

export const BuildSchoolGame: React.FC<BuildSchoolGameProps> = ({
  greenPoints,
  placedItems,
  onUpdatePlacedItems,
  onNavigate,
}) => {
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<SchoolItemCatalog | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedPlacedId, setSelectedPlacedId] = useState<string | null>(null);

  // Filter items in store
  const filteredCatalog = activeCategory === 'todos'
    ? SCHOOL_DECORATIONS
    : SCHOOL_DECORATIONS.filter(item => item.category === activeCategory);

  // Calculate Campus Eco Score
  const campusEcoScore = Math.min(100, placedItems.length * 15);

  const handleBuyAndPlace = (item: SchoolItemCatalog) => {
    if (greenPoints < item.cost) {
      sounds.playGentleHint();
      return;
    }

    sounds.playSuccess();
    triggerConfetti(0.6);

    // Place at a random comfortable coordinate in the campus yard
    const randomX = Math.floor(Math.random() * 70) + 15;
    const randomY = Math.floor(Math.random() * 55) + 30;

    const newItem: PlacedSchoolItem = {
      instanceId: `inst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      catalogId: item.id,
      x: randomX,
      y: randomY,
    };

    const nextPlaced = [...placedItems, newItem];
    onUpdatePlacedItems(nextPlaced, item.cost);
  };

  const handleRemovePlacedItem = (instanceId: string) => {
    sounds.playPop();
    const nextPlaced = placedItems.filter(p => p.instanceId !== instanceId);
    onUpdatePlacedItems(nextPlaced, 0);
    setSelectedPlacedId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If user clicked empty space, deselect
    if (e.target === e.currentTarget) {
      setSelectedPlacedId(null);
    }
  };

  const handleReposition = (instanceId: string, deltaX: number, deltaY: number) => {
    sounds.playPop();
    const nextPlaced = placedItems.map(p => {
      if (p.instanceId === instanceId) {
        return {
          ...p,
          x: Math.max(5, Math.min(90, p.x + deltaX)),
          y: Math.max(25, Math.min(85, p.y + deltaY)),
        };
      }
      return p;
    });
    onUpdatePlacedItems(nextPlaced, 0);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Construye tu Colegio Ecológico
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Canjea tus Puntos Verdes por árboles, paneles solares y jardines para transformar tu campus virtual.
          </p>
        </div>

        {/* Eco Score & Points badge */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 border-2 border-emerald-300 px-3.5 py-1.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-emerald-700 block">Puntos Disponibles</span>
            <span className="font-fun font-black text-lg text-emerald-900 leading-tight">
              🌿 {greenPoints}
            </span>
          </div>
          <div className="bg-teal-50 border-2 border-teal-300 px-3.5 py-1.5 rounded-2xl text-center">
            <span className="text-[11px] font-bold text-teal-700 block">Salud Escolar</span>
            <span className="font-fun font-black text-lg text-teal-900 leading-tight">
              💚 {campusEcoScore}% Verde
            </span>
          </div>
        </div>
      </div>

      {/* VIRTUAL CAMPUS YARD CANVAS */}
      <div className="bg-white rounded-3xl border-4 border-emerald-400 shadow-xl overflow-hidden relative">
        <div className="bg-emerald-600 px-4 py-2.5 flex items-center justify-between text-white text-xs font-bold">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Campus Virtual: {placedItems.length} Elementos Ecológicos instalados</span>
          </div>
          <span className="text-[11px] opacity-80 hidden sm:inline">
            Toca cualquier objeto para moverlo o removerlo
          </span>
        </div>

        {/* The Graphic Yard */}
        <div
          onClick={handleCanvasClick}
          className="relative w-full h-[360px] sm:h-[440px] bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-300 select-none overflow-hidden cursor-crosshair"
        >
          {/* Background School Building Graphic */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-28 bg-amber-100/90 rounded-2xl border-4 border-amber-800/40 shadow-md p-3 flex flex-col items-center justify-between pointer-events-none">
            <div className="bg-red-500 text-white font-fun font-bold text-[10px] px-3 py-0.5 rounded-full">
              COLEGIO ECOLÓGICO PRIMARIA
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-10 bg-sky-200 border-2 border-sky-400 rounded-md"></div>
              <div className="w-12 h-10 bg-sky-200 border-2 border-sky-400 rounded-md"></div>
              <div className="w-12 h-10 bg-sky-200 border-2 border-sky-400 rounded-md"></div>
            </div>
            <div className="w-16 h-8 bg-amber-800 rounded-t-lg"></div>
          </div>

          {/* Grass Landscape */}
          <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-[50px] border-t-4 border-emerald-300 pointer-events-none">
            {/* Stone Path */}
            <div className="w-24 h-full mx-auto bg-amber-200/40 border-x-2 border-dashed border-amber-400/40"></div>
          </div>

          {/* PLACED ITEMS ON YARD */}
          {placedItems.map((placed) => {
            const catalogItem = SCHOOL_DECORATIONS.find(d => d.id === placed.catalogId);
            if (!catalogItem) return null;
            const isSelected = selectedPlacedId === placed.instanceId;

            return (
              <div
                key={placed.instanceId}
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playPop();
                  setSelectedPlacedId(placed.instanceId);
                }}
                style={{
                  left: `${placed.x}%`,
                  top: `${placed.y}%`,
                }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-20'
                }`}
              >
                <div
                  className={`p-2 rounded-2xl text-3xl sm:text-4xl filter drop-shadow-lg transition-all ${
                    isSelected
                      ? 'bg-white/90 ring-4 ring-amber-400 shadow-2xl animate-bounce-gentle'
                      : 'hover:bg-white/40'
                  }`}
                  title={`${catalogItem.name} (${catalogItem.ecoBonus})`}
                >
                  {catalogItem.icon}
                </div>

                {/* Reposition Controls when selected */}
                {isSelected && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border-2 border-emerald-400 p-1 flex items-center gap-1 z-40 whitespace-nowrap animate-fadeIn"
                  >
                    <button
                      onClick={() => handleReposition(placed.instanceId, -5, 0)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                      title="Mover a la izquierda"
                    >
                      ⬅️
                    </button>
                    <button
                      onClick={() => handleReposition(placed.instanceId, 5, 0)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                      title="Mover a la derecha"
                    >
                      ➡️
                    </button>
                    <button
                      onClick={() => handleReposition(placed.instanceId, 0, -5)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                      title="Mover arriba"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => handleReposition(placed.instanceId, 0, 5)}
                      className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold"
                      title="Mover abajo"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => handleRemovePlacedItem(placed.instanceId)}
                      className="w-6 h-6 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center text-xs"
                      title="Eliminar del patio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Eco Guide in Yard */}
          <div className="absolute bottom-3 left-3 z-20">
            <EcoMascot
              mood="happy"
              message={
                placedItems.length > 5
                  ? "¡Qué colegio tan verde y hermoso estás creando! Los pajaritos y mariposas están felices aquí."
                  : "¡Canjea elementos ecológicos abajo para llenar nuestro patio de árboles, flores y reciclaje!"
              }
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* ECO CATALOG / SHOPPING AREA */}
      <div className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-emerald-100 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-fun font-black text-xl text-emerald-950">
              Tienda Ecológica de Elementos
            </h3>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'naturaleza', label: '🌳 Naturaleza' },
              { id: 'reciclaje', label: '♻️ Reciclaje' },
              { id: 'energia', label: '☀️ Energía' },
              { id: 'recreo', label: '🪑 Recreo' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveCategory(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Item Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCatalog.map((item) => {
            const canAfford = greenPoints >= item.cost;

            return (
              <div
                key={item.id}
                className="bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-4 border-2 border-emerald-200 hover:border-emerald-400 shadow-xs flex flex-col justify-between transition-all hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-4xl bg-white p-2 rounded-2xl border border-emerald-200 shadow-xs">
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.ecoBonus}
                    </span>
                  </div>

                  <h4 className="font-fun font-bold text-sm text-slate-800">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="font-fun font-black text-xs text-emerald-900">
                    🌿 {item.cost} pts
                  </span>

                  <button
                    onClick={() => handleBuyAndPlace(item)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl font-fun font-bold text-xs flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Colocar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
