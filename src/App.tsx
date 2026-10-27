import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { HowToPlayModal } from './components/HowToPlayModal';
import { AuthModal } from './components/auth/AuthModal';
import { GamesHub } from './components/games/GamesHub';
import { SortingGame } from './components/games/SortingGame';
import { CleanSchoolMission } from './components/games/CleanSchoolMission';
import { TrueFalseGame } from './components/games/TrueFalseGame';
import { BuildSchoolGame } from './components/games/BuildSchoolGame';
import { LessonsView } from './components/learning/LessonsView';
import { DailyChallengeView } from './components/challenges/DailyChallengeView';
import { ProgressView } from './components/profile/ProgressView';
import { CreatorsView } from './components/creators/CreatorsView';
import { RankingView } from './components/ranking/RankingView';
import { RewardsView } from './components/rewards/RewardsView';
import { ImpactComparisonView } from './components/impact/ImpactComparisonView';
import { PlacedSchoolItem } from './types/eco';
import { api, StudentProfile, getStoredToken } from './services/api';
import { triggerCelebrationBurst, triggerConfetti } from './utils/storage';
import { sounds } from './utils/audio';
import { Award, Flame, Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [guestPoints, setGuestPoints] = useState<number>(0);
  const [howToPlayOpen, setHowToPlayOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [bannerToast, setBannerToast] = useState<{ title: string; subtitle?: string; icon?: string } | null>(null);
  const [guestMissions, setGuestMissions] = useState<string[]>([]);
  const [guestChallenges, setGuestChallenges] = useState<string[]>([]);
  const [guestPlacedItems, setGuestPlacedItems] = useState<PlacedSchoolItem[]>([]);

  // Load user profile on mount if token exists
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api.getMe()
        .then((res) => {
          setCurrentUser(res.user);
        })
        .catch(() => {
          // Token expired or invalid
          setCurrentUser(null);
        });
    }
  }, []);

  const showToast = (title: string, subtitle?: string, icon = '🎉') => {
    setBannerToast({ title, subtitle, icon });
    setTimeout(() => {
      setBannerToast(null);
    }, 4000);
  };

  // Central handler to award points with real backend persistence & anti-cheat
  const handleRewardActivity = async (
    activityId: string,
    activityType: 'waste' | 'mission' | 'quiz' | 'daily_challenge' | 'lesson' | 'badge',
    points: number,
    metadata?: Record<string, any>
  ) => {
    if (currentUser) {
      try {
        const res = await api.claimReward(activityId, activityType, points, metadata);
        if (res.alreadyClaimed) {
          showToast('¡Actividad ya completada!', 'Ya habías recibido tus Puntos Verdes por esta misión.', '✨');
          return;
        }

        setCurrentUser(res.user);
        sounds.playSuccess();
        triggerConfetti(0.6);

        if (res.streakInfo?.milestoneBadge) {
          triggerCelebrationBurst();
          showToast(
            `¡HITO DE RACHA! +${res.pointsAwarded} Puntos`,
            `¡Desbloqueaste: ${res.streakInfo.milestoneBadge}!`,
            '🔥'
          );
        } else {
          showToast(`+${res.pointsAwarded} Puntos Verdes`, '¡Gran trabajo protegiendo el colegio!', '🌿');
        }
      } catch (err) {
        console.error('Failed to claim reward:', err);
      }
    } else {
      // Guest mode fallback
      setGuestPoints(prev => prev + points);
      sounds.playSuccess();
      triggerConfetti(0.6);
      showToast(
        `+${points} Puntos Verdes de Invitado`,
        '¡Inicia sesión o crea tu cuenta para guardar tus puntos en el ranking oficial!',
        '🌱'
      );
    }
  };

  // Handling mission solved
  const handleSolveMissionProblem = async (problemId: string, points: number) => {
    if (currentUser) {
      await handleRewardActivity(`mission_${problemId}`, 'mission', points);
    } else {
      setGuestMissions(prev => [...prev, problemId]);
      setGuestPoints(prev => prev + points);
      sounds.playSuccess();
      triggerConfetti(0.6);
      showToast(`+${points} Puntos Verdes`, '¡Inicia sesión para guardar tu progreso!', '🏫');
    }
  };

  // Handling daily challenge
  const handleCompleteDailyChallenge = async (challengeId: string, points: number) => {
    const todayColombia = new Date().toISOString().split('T')[0];
    const uniqueActivityId = `challenge_${todayColombia}_${challengeId}`;

    if (currentUser) {
      await handleRewardActivity(uniqueActivityId, 'daily_challenge', points);
    } else {
      setGuestChallenges(prev => [...prev, challengeId]);
      setGuestPoints(prev => prev + points);
      sounds.playSuccess();
      triggerConfetti(0.6);
      showToast(`+${points} Puntos Verdes`, '¡Crea tu cuenta para registrar tu racha diaria!', '🎯');
    }
  };

  // Handling virtual school placement
  const handleUpdatePlacedItems = async (items: PlacedSchoolItem[], pointsSpent: number) => {
    if (currentUser) {
      try {
        const res = await api.saveSchoolItems(items, pointsSpent);
        setCurrentUser(res.user);
      } catch (err) {
        console.error('Failed to save school items:', err);
      }
    } else {
      setGuestPlacedItems(items);
      setGuestPoints(prev => Math.max(0, prev - pointsSpent));
    }
  };

  // Handling avatar update
  const handleUpdateAvatar = async (avatarId: string) => {
    if (currentUser) {
      try {
        const res = await api.updateAvatar(avatarId);
        setCurrentUser(res.user);
        showToast('¡Avatar actualizado!', undefined, '🎨');
      } catch (err) {
        console.error('Failed to update avatar:', err);
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    sounds.playPop();
    await api.logout();
    setCurrentUser(null);
    showToast('Sesión cerrada', '¡Vuelve pronto para seguir cuidando el planeta!', '👋');
    setCurrentTab('inicio');
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const activePoints = currentUser ? currentUser.greenPoints : guestPoints;
  const activeMissions = currentUser ? (currentUser.completedMissions || []) : guestMissions;
  const activeChallenges = currentUser ? (currentUser.completedChallenges || []) : guestChallenges;
  const activePlacedItems = currentUser ? (currentUser.placedSchoolItems || []) : guestPlacedItems;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50/70 via-sky-50/50 to-emerald-50/70 text-slate-800">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        currentUser={currentUser}
        greenPoints={activePoints}
        onOpenHowToPlay={() => setHowToPlayOpen(true)}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-5 sm:pt-7">
        {currentTab === 'inicio' && (
          <HomeScreen
            currentUser={currentUser}
            onNavigate={setCurrentTab}
            onOpenHowToPlay={() => setHowToPlayOpen(true)}
            onOpenAuth={handleOpenAuth}
            greenPoints={activePoints}
          />
        )}

        {currentTab === 'juegos' && (
          <GamesHub
            onSelectGame={setCurrentTab}
            wasteClassifiedCount={currentUser?.claimedRewards?.filter(r => r.startsWith('waste_')).length || 0}
            completedMissionsCount={activeMissions.length}
            placedItemsCount={activePlacedItems.length}
          />
        )}

        {currentTab === 'juego_clasificar' && (
          <SortingGame
            onAddPoints={(pts) => handleRewardActivity(`waste_${Date.now()}`, 'waste', 10)}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'juego_mision' && (
          <CleanSchoolMission
            completedProblems={activeMissions}
            onSolveProblem={handleSolveMissionProblem}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'juego_quiz' && (
          <TrueFalseGame
            onAddPoints={(pts) => handleRewardActivity(`quiz_${Date.now()}`, 'quiz', 10)}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'construir' && (
          <BuildSchoolGame
            greenPoints={activePoints}
            placedItems={activePlacedItems}
            onUpdatePlacedItems={handleUpdatePlacedItems}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'impacto' && (
          <ImpactComparisonView
            currentUser={currentUser}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'recompensas' && (
          <RewardsView
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'ranking' && (
          <RankingView
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'progreso' && (
          <ProgressView
            currentUser={currentUser}
            onUpdateAvatar={handleUpdateAvatar}
            onOpenAuth={() => handleOpenAuth('login')}
            onLogout={handleLogout}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'aprender' && (
          <LessonsView onNavigate={setCurrentTab} />
        )}

        {currentTab === 'retos' && (
          <DailyChallengeView
            completedChallenges={activeChallenges}
            onCompleteChallenge={handleCompleteDailyChallenge}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'creadores' && (
          <CreatorsView onNavigate={setCurrentTab} />
        )}
      </main>

      {/* Toast Notification Banner */}
      {bannerToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-3 border-emerald-400 text-slate-900 px-5 py-3.5 rounded-3xl shadow-2xl flex items-center gap-3.5 animate-fadeIn max-w-sm">
          <span className="text-3xl flex-shrink-0 animate-bounce-gentle">
            {bannerToast.icon || '🎉'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-fun font-black text-sm text-emerald-950 leading-tight">
              {bannerToast.title}
            </p>
            {bannerToast.subtitle && (
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                {bannerToast.subtitle}
              </p>
            )}
          </div>
          <button
            onClick={() => setBannerToast(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t-2 border-emerald-200 py-6 text-center text-xs text-slate-500 space-y-2 mt-8">
        <div className="flex items-center justify-center gap-2 font-fun font-black text-emerald-800 text-sm">
          <span>🌱 ECO-COLEGIO</span>
          <span>•</span>
          <span className="font-normal text-slate-600">“¡Un colegio limpio es un planeta feliz!”</span>
        </div>
        <p className="text-[11px] text-slate-600">
          Desarrollado con amor por el medio ambiente por <strong className="text-emerald-700">Bryan Conrado</strong>, <strong className="text-emerald-700">Alisson Quintero</strong>, <strong className="text-emerald-700">Juan David Bedoya</strong>, <strong className="text-emerald-700">Michell Barrientos</strong> y <strong className="text-emerald-700">Joan Argumedo</strong>.
        </p>
      </footer>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={howToPlayOpen}
        onClose={() => setHowToPlayOpen(false)}
        onStartPlaying={() => setCurrentTab('juego_clasificar')}
      />

      {/* Auth Modal (Login & Register) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user, welcomeMsg) => {
          setCurrentUser(user);
          showToast('¡Sesión iniciada con éxito!', welcomeMsg, '🌱');
        }}
      />
    </div>
  );
}
