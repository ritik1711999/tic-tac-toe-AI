import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useQueryClient } from "@tanstack/react-query";
import Header from "../../components/ui/Header";
import QuickActionsMenu from "../../components/ui/QuickActionsMenu";
import NewGameCard from "./components/NewGameCard";
import StatisticsPanel from "./components/StatisticsPanel";
import RecentGamesList from "./components/RecentGamesList";
import AchievementsBadges from "./components/AchievementsBadges";
import AIRecommendations from "./components/AIRecommendations";
import LevelUpModal from "./components/LevelUpModal";
import AchievementModal from "./components/AchievementModal";
import { useCreateGame } from "../../hooks/useGames";
import {
  useProgression,
  useProgressionRefetchOnGameEnd,
} from "../../hooks/useProgression";
import {
  useAchievements,
  useAchievementsRefetchOnGameEnd,
} from "../../hooks/useAchievements";
import { useSocket } from "../../lib/socket/SocketContext";
import "./gameDashboard.css";

type ModalQueueItem =
  | { type: "level-up"; data: LevelUpData }
  | { type: "achievement"; data: AchievementData };

interface LevelUpData {
  previousSkill: string | null;
  newSkill: string;
  skillPoints: number;
}

interface AchievementData {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

const GameDashboard = () => {
  const navigate = useNavigate();
  const createGameMutation = useCreateGame();
  const queryClient = useQueryClient();
  const { data: progression, refetch: refetchProgression } = useProgression();
  const { data: achievements } = useAchievements();
  const { consumeLevelUp, consumeNewAchievements } = useSocket();

  // Modal orchestration state
  const [modalQueue, setModalQueue] = useState<ModalQueueItem[]>([]);
  const [currentModal, setCurrentModal] = useState<ModalQueueItem | null>(null);
  const [isShowingModal, setIsShowingModal] = useState(false);

  const previousSkillRef = useRef<string | null>(null);
  const hasMountedRef = useRef(false);

  // Set up automatic refetch on game-end
  useProgressionRefetchOnGameEnd();
  useAchievementsRefetchOnGameEnd();

  // Refetch progression data when dashboard mounts (user returning from game)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      // Invalidate all dashboard-related queries
      queryClient.invalidateQueries({ queryKey: ["progression"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["games"] });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      refetchProgression();
    }
  }, [refetchProgression, queryClient]);

  // Consume buffered events and build modal queue on mount
  useEffect(() => {
    const queue: ModalQueueItem[] = [];

    // Priority 1: Level-up modal
    const bufferedLevelUp = consumeLevelUp?.();
    if (bufferedLevelUp?.leveledUp && bufferedLevelUp.newSkill) {
      queue.push({
        type: "level-up",
        data: {
          previousSkill:
            bufferedLevelUp.previousSkill ?? previousSkillRef.current,
          newSkill: bufferedLevelUp.newSkill,
          skillPoints:
            bufferedLevelUp.skillPoints ?? progression?.skillPoints ?? 0,
        },
      });
    }

    // Priority 2: Achievement modals
    const bufferedAchievements = consumeNewAchievements?.() || [];
    if (bufferedAchievements.length > 0 && achievements) {
      bufferedAchievements.forEach((bufferedAch) => {
        const achievement = achievements.find(
          (a: any) => a.id === bufferedAch.achievementId,
        );
        if (achievement && !achievement.seenByUser) {
          queue.push({
            type: "achievement",
            data: {
              id: achievement.id,
              title: achievement.title,
              description: achievement.description,
              icon: achievement.icon,
              unlockedAt: bufferedAch.unlockedAt,
            },
          });
        }
      });
    }

    if (queue.length > 0) {
      setModalQueue(queue);
    }
  }, [
    consumeLevelUp,
    consumeNewAchievements,
    progression?.skillPoints,
    achievements,
  ]);

  // Process modal queue - show next modal after delay
  useEffect(() => {
    if (modalQueue.length > 0 && !isShowingModal && !currentModal) {
      const nextModal = modalQueue[0];
      setCurrentModal(nextModal);
      setIsShowingModal(true);
    }
  }, [modalQueue, isShowingModal, currentModal]);

  const processNextModal = () => {
    // Remove current modal from queue
    setModalQueue((prev) => prev.slice(1));
    setCurrentModal(null);
    setIsShowingModal(false);

    // Show next modal after 1.5s delay if queue has more items
    setTimeout(() => {
      if (modalQueue.length > 1) {
        const nextModal = modalQueue[1];
        setCurrentModal(nextModal);
        setIsShowingModal(true);
      }
    }, 1500);
  };

  const handleLevelUpModalClose = () => {
    refetchProgression();
    processNextModal();
  };

  const handleAchievementModalClose = () => {
    processNextModal();
  };

  const handleNewGame = async () => {
    try {
      const gamePayload = {
        vs: "Human" as const,
      };

      const createdGame = await createGameMutation.mutateAsync(gamePayload);

      navigate(`/play-game/${createdGame._id}`, {
        state: {
          gameMode: "local",
        },
      });
    } catch (err: any) {
      console.error("Error creating game from quick actions:", err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Game Dashboard - TicTacToe Master</title>
        <meta
          name="description"
          content="Access your TicTacToe gaming hub with statistics, recent games, achievements, and AI-powered recommendations for strategic improvement."
        />
      </Helmet>

      <div className="page-dashboard-layout">
        <Header />

        <main className="page-dashboard-main">
          <div className="page-dashboard-container">
            <div className="page-dashboard-header">
              <div className="page-dashboard-header-content">
                <h1 className="page-dashboard-title">Game Dashboard</h1>
                <p className="page-dashboard-description">
                  Welcome back! Track your progress and start new games
                </p>
              </div>
              <QuickActionsMenu onNewGame={handleNewGame} />
            </div>

            <div className="page-dashboard-grid">
              <div className="page-dashboard-grid-section page-dashboard-primary-section">
                <NewGameCard />
                <StatisticsPanel />
                <AIRecommendations />
              </div>

              <div className="page-dashboard-grid-section page-dashboard-secondary-section">
                <RecentGamesList />
                <AchievementsBadges />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Orchestration */}
      {currentModal?.type === "level-up" && (
        <LevelUpModal
          isOpen={isShowingModal}
          onClose={handleLevelUpModalClose}
          previousSkill={currentModal.data.previousSkill}
          newSkill={currentModal.data.newSkill}
          skillPoints={currentModal.data.skillPoints}
        />
      )}

      {currentModal?.type === "achievement" && (
        <AchievementModal
          isOpen={isShowingModal}
          onClose={handleAchievementModalClose}
          achievement={currentModal.data}
        />
      )}
    </>
  );
};

export default GameDashboard;
