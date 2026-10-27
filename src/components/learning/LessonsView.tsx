import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, BookOpen, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { LESSONS } from '../../data/lessons';
import { Lesson } from '../../types/eco';
import { EcoMascot } from '../EcoMascot';
import { speakText, stopSpeaking, sounds } from '../../utils/audio';

interface LessonsViewProps {
  onNavigate: (tab: string) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ onNavigate }) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LESSONS[0].id);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  const currentLesson = LESSONS.find(l => l.id === selectedLessonId) || LESSONS[0];

  const handleSelectLesson = (lesson: Lesson) => {
    sounds.playPop();
    stopSpeaking();
    setIsNarrating(false);
    setSelectedLessonId(lesson.id);
  };

  const handleToggleNarration = () => {
    if (isNarrating) {
      stopSpeaking();
      setIsNarrating(false);
    } else {
      const fullText = `${currentLesson.title}. ${currentLesson.shortDesc}. ${currentLesson.sections.map(s => `${s.subtitle}. ${s.text}`).join('. ')}`;
      speakText(fullText);
      setIsNarrating(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 border-3 border-emerald-300 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="font-fun font-black text-2xl sm:text-3xl text-emerald-950">
              Aprendamos con Eco
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Lecciones cortas, divertidas e ilustradas para aprender a cuidar tu escuela y el planeta.
          </p>
        </div>

        {/* Read aloud narrator button for kids */}
        <button
          onClick={handleToggleNarration}
          className={`px-4 py-2 rounded-2xl font-fun font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
            isNarrating
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
          }`}
        >
          {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          <span>{isNarrating ? 'Detener lectura' : 'Escuchar lección con Eco'}</span>
        </button>
      </div>

      {/* LESSON NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {LESSONS.map((lesson) => {
          const active = lesson.id === selectedLessonId;

          return (
            <button
              key={lesson.id}
              onClick={() => handleSelectLesson(lesson)}
              className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                active
                  ? 'bg-emerald-600 border-emerald-700 text-white shadow-md scale-102'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700'
              }`}
            >
              <span className="text-2xl mb-1">{lesson.icon}</span>
              <span className="font-fun font-bold text-xs leading-tight line-clamp-2">
                {lesson.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE LESSON CONTENT CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-emerald-200 shadow-xl space-y-6">
        {/* Title & Badge highlight */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-emerald-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-1">
              <span>{currentLesson.icon}</span>
              <span>Insignia relacionada: {currentLesson.badgeName}</span>
            </div>
            <h3 className="font-fun font-black text-2xl sm:text-3xl text-slate-900">
              {currentLesson.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              {currentLesson.shortDesc}
            </p>
          </div>

          <EcoMascot
            mood="explaining"
            size="sm"
            showSpeechBubble={false}
          />
        </div>

        {/* Lesson Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentLesson.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-emerald-50/50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-100 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{section.emoji}</span>
                <h4 className="font-fun font-bold text-base text-emerald-950">
                  {section.subtitle}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {section.text}
              </p>

              {section.bullets && (
                <ul className="mt-3 space-y-1.5 border-t border-emerald-100/80 pt-2.5">
                  {section.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Fun Fact Callout */}
        <div className="bg-amber-100/70 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3">
          <Lightbulb className="w-7 h-7 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-fun font-bold text-xs text-amber-900 uppercase tracking-wide block">
              ¿Sabías que...?
            </span>
            <p className="text-xs sm:text-sm text-amber-950 font-semibold mt-0.5">
              {currentLesson.funFact}
            </p>
          </div>
        </div>

        {/* Action Button: Put it into practice in games */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
          <div className="text-center sm:text-left">
            <h5 className="font-fun font-bold text-sm text-emerald-900">
              ¿Quieres poner a prueba lo aprendido?
            </h5>
            <p className="text-xs text-slate-600">
              Juega a clasificar residuos y gana puntos verdes para tu colegio virtual.
            </p>
          </div>
          <button
            onClick={() => onNavigate('juego_clasificar')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs sm:text-sm shadow-md transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Ir a Clasificar Residuos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
