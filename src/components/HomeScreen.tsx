import React from 'react';
import { Play, HelpCircle, Users, Sparkles, BookOpen, Calendar, Award, Hammer, ArrowRight, ShieldCheck, Heart, LogIn, UserPlus, Flame, Trophy, Gift, TrendingDown, BarChart3, Trees, Droplets } from 'lucide-react';
import { EcoMascot } from './EcoMascot';
import { sounds } from '../utils/audio';
import { StudentProfile } from '../services/api';
import { AVATAR_OPTIONS } from './auth/AuthModal';

interface HomeScreenProps {
  currentUser: StudentProfile | null;
  onNavigate: (tab: string) => void;
  onOpenHowToPlay: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  greenPoints: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  onNavigate,
  onOpenHowToPlay,
  onOpenAuth,
  greenPoints,
}) => {
  const handleStartAdventure = () => {
    sounds.playFanfare();
    onNavigate('juegos');
  };

  const getAvatarEmoji = (avatarId: string) => {
    const found = AVATAR_OPTIONS.find(a => a.id === avatarId);
    return found ? found.emoji : '🌱';
  };

  return (
    <div className="space-y-10 pb-16">
      {/* PERSONALIZED BANNER FOR LOGGED-IN USERS */}
      {currentUser && (
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-emerald-400 animate-fadeIn">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-4xl shadow-md">
              {getAvatarEmoji(currentUser.avatarId)}
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                ¡Bienvenido a tu estación ecológica!
              </span>
              <h2 className="font-fun font-black text-2xl sm:text-3xl">
                ¡Hola, {currentUser.username}! 👋
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                Nivel actual: <strong>{currentUser.levelName}</strong> • Racha de {currentUser.streak} días consecutivos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Puntos</span>
              <span className="font-fun font-black text-xl leading-none">🌿 {currentUser.greenPoints}</span>
            </div>

            <div className="bg-amber-400 text-amber-950 px-3.5 py-2 rounded-2xl font-fun font-black text-center shadow-md">
              <span className="text-[10px] uppercase font-bold text-amber-900 block">Racha</span>
              <span className="text-xl leading-none flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-amber-950" />
                <span>{currentUser.streak}d</span>
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Ranking</span>
              <span className="font-fun font-black text-xl leading-none">#{currentUser.rank || 1}</span>
            </div>

            <button
              onClick={() => onNavigate('juegos')}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-fun font-black text-sm shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer ml-1"
            >
              ¡Jugar!
            </button>
          </div>
        </section>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200 border-4 border-emerald-400 shadow-xl p-5 sm:p-8 md:p-12 text-slate-800">
        {/* Floating Clouds & Sun Background elements */}
        <div className="absolute top-4 left-6 text-4xl opacity-80 animate-float select-none">
          ☁️
        </div>
        <div className="absolute top-8 right-16 text-5xl opacity-85 select-none animate-pulse-subtle">
          ☀️
        </div>
        <div className="absolute top-20 right-1/4 text-3xl opacity-75 select-none animate-float" style={{ animationDelay: '1.5s' }}>
          ☁️
        </div>
        <div className="absolute bottom-4 left-10 text-2xl select-none animate-bounce-gentle">
          🦋
        </div>
        <div className="absolute bottom-6 right-8 text-2xl select-none animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          🐝
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full border-2 border-emerald-500 shadow-sm">
            <span className="text-xl">🌱</span>
            <span className="font-fun font-bold text-xs sm:text-sm text-emerald-900 tracking-wide uppercase">
              Aventura Ecológica Infantil
            </span>
          </div>

          {/* Main Title & Slogan */}
          <div className="space-y-2">
            <h1 className="font-fun font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white drop-shadow-[0_4px_8px_rgba(6,78,59,0.5)]">
              ECO-COLEGIO
            </h1>
            <p className="font-fun font-bold text-xl sm:text-2xl md:text-3xl text-emerald-950 bg-amber-300/90 inline-block px-5 py-2 rounded-2xl shadow-sm rotate-[-1deg]">
              “¡Un colegio limpio es un planeta feliz!”
            </p>
          </div>

          {/* School Vector Cartoon Illustration */}
          <div className="my-6 max-w-2xl mx-auto bg-white/40 backdrop-blur-xs rounded-3xl p-4 sm:p-6 border-2 border-white/60 shadow-inner">
            <svg
              viewBox="0 0 600 240"
              className="w-full h-auto drop-shadow-md select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sky Ground divider */}
              <ellipse cx="300" cy="270" rx="350" ry="80" fill="#22c55e" />
              <ellipse cx="300" cy="275" rx="350" ry="75" fill="#16a34a" />

              {/* School Building */}
              <g id="school-building">
                <rect x="180" y="70" width="240" height="130" rx="10" fill="#fed7aa" stroke="#c2410c" strokeWidth="4" />
                <polygon points="160,70 300,15 440,70" fill="#ea580c" stroke="#9a3412" strokeWidth="4" />
                <rect x="275" y="0" width="50" height="30" rx="4" fill="#f97316" stroke="#9a3412" strokeWidth="3" />
                <circle cx="300" cy="15" r="10" fill="#ffffff" stroke="#9a3412" strokeWidth="2.5" />
                <line x1="300" y1="15" x2="300" y2="9" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
                <line x1="300" y1="15" x2="305" y2="15" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" />
                
                {/* Solar panels */}
                <rect x="195" y="45" width="60" height="18" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="2" transform="rotate(-21 195 45)" />
                <rect x="350" y="23" width="60" height="18" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="2" transform="rotate(21 350 23)" />

                {/* Windows */}
                <rect x="205" y="90" width="45" height="35" rx="5" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
                <line x1="227" y1="90" x2="227" y2="125" stroke="#0284c7" strokeWidth="2" />
                <line x1="205" y1="107" x2="250" y2="107" stroke="#0284c7" strokeWidth="2" />

                <rect x="350" y="90" width="45" height="35" rx="5" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
                <line x1="372" y1="90" x2="372" y2="125" stroke="#0284c7" strokeWidth="2" />
                <line x1="350" y1="107" x2="395" y2="107" stroke="#0284c7" strokeWidth="2" />

                {/* Door */}
                <rect x="270" y="140" width="60" height="60" rx="6" fill="#78350f" stroke="#451a03" strokeWidth="3" />
                <circle cx="282" cy="172" r="3" fill="#fef08a" />
                <rect x="250" y="125" width="100" height="18" rx="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
                <text x="300" y="138" textAnchor="middle" fill="#15803d" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  BIENVENIDOS
                </text>
              </g>

              {/* Trees */}
              <g id="left-tree">
                <rect x="75" y="120" width="22" height="80" rx="4" fill="#92400e" stroke="#713f12" strokeWidth="3" />
                <circle cx="86" cy="100" r="48" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
                <circle cx="70" cy="85" r="32" fill="#22c55e" />
                <circle cx="105" cy="88" r="30" fill="#4ade80" />
                <circle cx="72" cy="98" r="5" fill="#ef4444" />
                <circle cx="95" cy="85" r="5" fill="#ef4444" />
                <circle cx="86" cy="115" r="5" fill="#ef4444" />
              </g>

              <g id="right-tree">
                <rect x="500" y="120" width="20" height="80" rx="4" fill="#92400e" stroke="#713f12" strokeWidth="3" />
                <circle cx="510" cy="95" r="45" fill="#16a34a" stroke="#14532d" strokeWidth="3" />
                <circle cx="495" cy="80" r="30" fill="#4ade80" />
                <circle cx="525" cy="85" r="28" fill="#22c55e" />
                <circle cx="505" cy="75" r="4" fill="#facc15" />
                <circle cx="520" cy="105" r="4" fill="#facc15" />
              </g>

              {/* 3 Recycling Bins */}
              <g id="bin-white" transform="translate(130, 160)">
                <rect x="0" y="8" width="28" height="34" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2.5" />
                <polygon points="-2,8 30,8 26,0 2,0" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="10" cy="20" r="2" fill="#0f172a" />
                <circle cx="18" cy="20" r="2" fill="#0f172a" />
                <path d="M11 25 Q14 29 17 25" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <text x="14" y="38" textAnchor="middle" fill="#0284c7" fontSize="7" fontWeight="bold">BLANCA</text>
              </g>

              <g id="bin-green" transform="translate(165, 160)">
                <rect x="0" y="8" width="28" height="34" rx="4" fill="#16a34a" stroke="#14532d" strokeWidth="2.5" />
                <polygon points="-2,8 30,8 26,0 2,0" fill="#15803d" stroke="#14532d" strokeWidth="2" />
                <circle cx="10" cy="20" r="2" fill="#ffffff" />
                <circle cx="18" cy="20" r="2" fill="#ffffff" />
                <path d="M11 25 Q14 29 17 25" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <text x="14" y="38" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">VERDE</text>
              </g>

              <g id="bin-black" transform="translate(200, 160)">
                <rect x="0" y="8" width="28" height="34" rx="4" fill="#0f172a" stroke="#020617" strokeWidth="2.5" />
                <polygon points="-2,8 30,8 26,0 2,0" fill="#1e293b" stroke="#020617" strokeWidth="2" />
                <circle cx="10" cy="20" r="2" fill="#ffffff" />
                <circle cx="18" cy="20" r="2" fill="#ffffff" />
                <path d="M11 25 Q14 29 17 25" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <text x="14" y="38" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="bold">NEGRA</text>
              </g>

              {/* Students */}
              <g id="student-boy" transform="translate(420, 150)">
                <circle cx="20" cy="18" r="12" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
                <path d="M9 16 C9 8 31 8 31 16 Z" fill="#78350f" />
                <circle cx="16" cy="18" r="1.5" fill="#451a03" />
                <circle cx="24" cy="18" r="1.5" fill="#451a03" />
                <path d="M17 23 Q20 27 23 23" stroke="#451a03" strokeWidth="1.5" fill="none" />
                <path d="M10 30 L30 30 L34 50 L6 50 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                <rect x="11" y="50" width="8" height="20" fill="#1e3a8a" />
                <rect x="21" y="50" width="8" height="20" fill="#1e3a8a" />
                <rect x="32" y="34" width="7" height="14" rx="2" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
              </g>

              <g id="student-girl" transform="translate(455, 152)">
                <circle cx="18" cy="18" r="12" fill="#fed7aa" stroke="#7c2d12" strokeWidth="2" />
                <circle cx="6" cy="12" r="6" fill="#451a03" />
                <circle cx="30" cy="12" r="6" fill="#451a03" />
                <path d="M8 15 C8 7 28 7 28 15 Z" fill="#451a03" />
                <circle cx="14" cy="18" r="1.5" fill="#451a03" />
                <circle cx="22" cy="18" r="1.5" fill="#451a03" />
                <path d="M15 23 Q18 27 21 23" stroke="#451a03" strokeWidth="1.5" fill="none" />
                <polygon points="18,30 6,55 30,55" fill="#10b981" stroke="#047857" strokeWidth="2" />
                <rect x="11" y="55" width="4" height="15" fill="#fed7aa" />
                <rect x="21" y="55" width="4" height="15" fill="#fed7aa" />
              </g>
            </svg>
          </div>

          {/* Eco Greeting Banner */}
          <div className="flex justify-center">
            <EcoMascot
              mood="happy"
              message={
                currentUser
                  ? `¡Hola de nuevo, ${currentUser.username}! Hoy es un día maravilloso para cuidar la institución. ¿Qué misión cumpliremos primero?`
                  : "¡Hola, amiguito! Te doy la bienvenida a ECO-COLEGIO. Juntos aprenderemos a separar los residuos y hacer florecer nuestra escuela. ¡Crea tu cuenta para guardar tu progreso!"
              }
              size="md"
            />
          </div>

          {/* CTA Action Buttons (including Auth buttons requested in requirement #1) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {!currentUser ? (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 font-fun font-black text-lg border-3 border-emerald-400 shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-5 h-5 text-emerald-600" />
                  <span>Iniciar sesión</span>
                </button>

                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fun font-black text-lg shadow-xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-5 h-5 text-amber-200" />
                  <span>Crear cuenta</span>
                </button>
              </>
            ) : null}

            <button
              onClick={handleStartAdventure}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-fun font-black text-lg shadow-lg shadow-amber-300 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-amber-950" />
              <span>¡Empezar aventura!</span>
            </button>

            <button
              onClick={onOpenHowToPlay}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-slate-800 font-fun font-bold text-base border-2 border-slate-300 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-slate-600" />
              <span>¿Cómo jugar?</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 INTERACTIVE GAMES SECTION */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Juegos y Misiones Escolares
            </div>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              ¡Aprende y diviértete cuidando el colegio!
            </h2>
          </div>
          <button
            onClick={() => onNavigate('juegos')}
            className="text-emerald-700 font-bold hover:text-emerald-800 text-sm flex items-center gap-1 cursor-pointer"
          >
            Ver todos los juegos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Game 1 */}
          <div
            onClick={() => {
              sounds.playPop();
              onNavigate('juego_clasificar');
            }}
            className="group bg-white rounded-3xl p-5 border-3 border-emerald-200 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🗑️
              </div>
              <span className="text-[11px] font-black uppercase text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                Juego 1
              </span>
              <h3 className="font-fun font-bold text-lg text-slate-800 mt-2 group-hover:text-emerald-700 transition-colors">
                ¿Dónde va cada residuo?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Arrastra botellas, cáscaras y paquetes a las canecas blanca, verde, negra y puntos especiales.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600">+10 Puntos</span>
              <span className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-emerald-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Game 2 */}
          <div
            onClick={() => {
              sounds.playPop();
              onNavigate('juego_mision');
            }}
            className="group bg-white rounded-3xl p-5 border-3 border-teal-200 hover:border-teal-500 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-100 border-2 border-teal-300 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🏫
              </div>
              <span className="text-[11px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                Misiones
              </span>
              <h3 className="font-fun font-bold text-lg text-slate-800 mt-2 group-hover:text-teal-700 transition-colors">
                Misión Colegio Limpio
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Explora el aula, el patio y la cafetería. Recoge basuras del suelo y repara problemas ecológicos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-teal-600">+25 Puntos</span>
              <span className="w-8 h-8 rounded-full bg-teal-100 group-hover:bg-teal-500 group-hover:text-white flex items-center justify-center text-teal-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Game 3 */}
          <div
            onClick={() => {
              sounds.playPop();
              onNavigate('juego_quiz');
            }}
            className="group bg-white rounded-3xl p-5 border-3 border-amber-200 hover:border-amber-500 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                ❓
              </div>
              <span className="text-[11px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                Juego 3
              </span>
              <h3 className="font-fun font-bold text-lg text-slate-800 mt-2 group-hover:text-amber-700 transition-colors">
                Verdadero o Falso
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Pon a prueba lo que sabes sobre el agua, las pilas y el reciclaje con preguntas veloces.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-600">+10 Puntos</span>
              <span className="w-8 h-8 rounded-full bg-amber-100 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center text-amber-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Game 4 */}
          <div
            onClick={() => {
              sounds.playPop();
              onNavigate('construir');
            }}
            className="group bg-white rounded-3xl p-5 border-3 border-emerald-300 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🌳
              </div>
              <span className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Juego 4
              </span>
              <h3 className="font-fun font-bold text-lg text-slate-800 mt-2 group-hover:text-emerald-700 transition-colors">
                Construye tu Colegio Verde
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Desbloquea guayacanes, huertos escolares, paneles solares y decora tu colegio virtual.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600">Personalizable</span>
              <span className="w-8 h-8 rounded-full bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-emerald-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CUADRO COMPARATIVO DE REDUCCIÓN MENSUAL DE BASURA */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-green-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-400 space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full border border-white/30">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Impacto Medido en la Institución</span>
            </div>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-amber-300">
              ¿Cuánta basura redujo el colegio con la App?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Comparación mensual del colegio antes de separar residuos vs. después de implementar ECO-COLEGIO:
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('impacto');
            }}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-fun font-black text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <span>Ver Cuadro Comparativo Detallado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Comparative Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Item 1: Basura general al relleno */}
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-200 mb-1">
                <span>🗑️ Basura al Relleno</span>
                <span className="bg-rose-500/80 text-white px-2 py-0.5 rounded-full font-black text-[10px]">
                  -68% REDUCCIÓN
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm text-slate-300 line-through">480 kg</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-fun font-black text-3xl text-amber-300">155 kg</span>
                <span className="text-xs text-emerald-200">/mes</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-100 mt-2">
              ¡325 kg menos de basura acumulándose en el relleno sanitario cada mes!
            </p>
          </div>

          {/* Item 2: Plástico reciclado */}
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-200 mb-1">
                <span>🍾 Plásticos Caneca Blanca</span>
                <span className="bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full font-black text-[10px]">
                  +793% APROVECHADO
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm text-slate-300 line-through">14 kg</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-fun font-black text-3xl text-emerald-300">125 kg</span>
                <span className="text-xs text-emerald-200">/mes</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-100 mt-2">
              Más de 3,750 botellas plásticas recuperadas limpias para nuevos productos.
            </p>
          </div>

          {/* Item 3: Orgánicos para compost */}
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-200 mb-1">
                <span>🍌 Orgánicos Caneca Verde</span>
                <span className="bg-teal-400 text-teal-950 px-2 py-0.5 rounded-full font-black text-[10px]">
                  +2100% ABONO
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-sm text-slate-300 line-through">5 kg</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-fun font-black text-3xl text-teal-300">110 kg</span>
                <span className="text-xs text-emerald-200">/mes</span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-100 mt-2">
              Cáscaras de frutas convertidas en abono natural para las plantas de la escuela.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK HIGHLIGHTS: RECOMPENSAS, RANKING & APRENDE */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1: Ranking ecológico */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigate('ranking');
          }}
          className="bg-gradient-to-br from-amber-50 to-orange-100/60 rounded-3xl p-6 border-2 border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Clasificación</span>
                <h3 className="font-fun font-bold text-xl text-amber-950">Ranking Ecológico</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Compite amistosamente con tus compañeros de escuela y escala posiciones acumulando Puntos Verdes.
            </p>
          </div>
          <div className="mt-4 flex items-center text-amber-900 font-bold text-sm">
            <span>Ver tabla de líderes</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Module 2: Mis Recompensas */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigate('recompensas');
          }}
          className="bg-gradient-to-br from-emerald-50 to-teal-100/60 rounded-3xl p-6 border-2 border-emerald-300 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Premios</span>
                <h3 className="font-fun font-bold text-xl text-emerald-950">Mis Recompensas</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Descubre las bonificaciones por racha de 3, 7, 15 y 30 días, y desbloquea insignias especiales.
            </p>
          </div>
          <div className="mt-4 flex items-center text-emerald-800 font-bold text-sm">
            <span>Ver recompensas</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        {/* Module 3: Aprendamos con Eco */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigate('aprender');
          }}
          className="bg-gradient-to-br from-sky-50 to-indigo-100/60 rounded-3xl p-6 border-2 border-sky-200 hover:border-sky-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider">Educación</span>
                <h3 className="font-fun font-bold text-xl text-sky-950">Aprendamos con Eco</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Lecciones ilustradas sobre las 3R, las canecas mágica y el ahorro de agua (+15 pts por lección).
            </p>
          </div>
          <div className="mt-4 flex items-center text-sky-800 font-bold text-sm">
            <span>Explorar lecciones</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </section>

      {/* CREATORS PRESENTATION */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-emerald-200 shadow-md">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Creadores de ECO-COLEGIO</span>
          </div>

          <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
            ¿Quiénes crearon ECO-COLEGIO?
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
            “Somos un equipo comprometido con el cuidado del medioambiente. Creamos ECO-COLEGIO para enseñar a los niños que, mediante pequeñas acciones, podemos mantener nuestra institución limpia, reducir los residuos y construir un futuro más sostenible.”
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            <div className="bg-emerald-50 rounded-2xl p-3 border-2 border-emerald-200 text-center">
              <span className="text-2xl mb-1 block">🌱</span>
              <p className="font-fun font-bold text-emerald-900 text-sm sm:text-base">Bryan Conrado</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Equipo Creador</span>
            </div>

            <div className="bg-teal-50 rounded-2xl p-3 border-2 border-teal-200 text-center">
              <span className="text-2xl mb-1 block">🌿</span>
              <p className="font-fun font-bold text-teal-900 text-sm sm:text-base">Alisson Quintero</p>
              <span className="text-[10px] text-teal-700 font-semibold">Equipo Creador</span>
            </div>

            <div className="bg-amber-50 rounded-2xl p-3 border-2 border-amber-200 text-center">
              <span className="text-2xl mb-1 block">🍀</span>
              <p className="font-fun font-bold text-amber-900 text-sm sm:text-base">Juan David Bedoya</p>
              <span className="text-[10px] text-amber-700 font-semibold">Equipo Creador</span>
            </div>

            <div className="bg-sky-50 rounded-2xl p-3 border-2 border-sky-200 text-center">
              <span className="text-2xl mb-1 block">🌸</span>
              <p className="font-fun font-bold text-sky-900 text-sm sm:text-base">Michell Barrientos</p>
              <span className="text-[10px] text-sky-700 font-semibold">Equipo Creador</span>
            </div>

            <div className="bg-green-50 rounded-2xl p-3 border-2 border-green-200 text-center col-span-2 sm:col-span-1">
              <span className="text-2xl mb-1 block">🌻</span>
              <p className="font-fun font-bold text-green-900 text-sm sm:text-base">Joan Argumedo</p>
              <span className="text-[10px] text-green-700 font-semibold">Equipo Creador</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
