import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Award,
  ChevronRight,
  Play,
  Lock,
  CheckCircle,
  BarChart3,
  Users,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LevelChallenge } from "@/components/quantum/level-challenges";

// Types for the learning system
interface Level {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'research';
  points: number;
  completed: boolean;
  locked: boolean;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserProgress {
  totalPoints: number;
  level: number;
  streak: number;
  completedLevels: number;
  rank: number;
  achievements: Achievement[];
}

// Mock data for the learning system
const mockLevels: Level[] = [
  {
    id: "qb-101",
    title: "First Qubit",
    description: "Learn what a qubit is and how it differs from classical bits",
    difficulty: "beginner",
    points: 100,
    completed: true,
    locked: false,
    category: "Quantum Basics"
  },
  {
    id: "qb-102", 
    title: "Superposition States",
    description: "Master the concept of quantum superposition with interactive examples",
    difficulty: "beginner",
    points: 150,
    completed: true,
    locked: false,
    category: "Quantum Basics"
  },
  {
    id: "qg-201",
    title: "Hadamard Gates",
    description: "Build circuits using Hadamard gates to create superposition",
    difficulty: "intermediate",
    points: 200,
    completed: false,
    locked: false,
    category: "Quantum Gates"
  },
  {
    id: "qg-202",
    title: "Entanglement Circuits", 
    description: "Create entangled states using CNOT gates and measure correlations",
    difficulty: "intermediate",
    points: 250,
    completed: false,
    locked: false,
    category: "Quantum Gates"
  },
  {
    id: "qa-301",
    title: "Bell State Analysis",
    description: "Run real Bell state circuits on IBM Quantum hardware",
    difficulty: "advanced",
    points: 400,
    completed: false,
    locked: true,
    category: "Quantum Algorithms"
  },
  {
    id: "qr-401",
    title: "Quantum Optimization Challenge",
    description: "Solve a real-world optimization problem using quantum algorithms",
    difficulty: "research",
    points: 600,
    completed: false,
    locked: true,
    category: "Research Challenges"
  }
];

const mockAchievements: Achievement[] = [
  {
    id: "first-steps",
    title: "Quantum Beginner",
    description: "Complete your first quantum challenge",
    icon: "🎯",
    unlocked: true,
    rarity: "common"
  },
  {
    id: "superposition-master",
    title: "Superposition Master",
    description: "Master the art of quantum superposition",
    icon: "⚡",
    unlocked: true,
    rarity: "rare"
  },
  {
    id: "entanglement-explorer",
    title: "Entanglement Explorer",
    description: "Create your first entangled quantum state",
    icon: "🔗",
    unlocked: false,
    rarity: "epic"
  },
  {
    id: "quantum-pioneer",
    title: "Research Pioneer",
    description: "Complete a research-level quantum challenge",
    icon: "🚀",
    unlocked: false,
    rarity: "legendary"
  }
];

const mockUserProgress: UserProgress = {
  totalPoints: 250,
  level: 3,
  streak: 5,
  completedLevels: 2,
  rank: 42,
  achievements: mockAchievements
};

const mockLeaderboard = [
  { rank: 1, name: "QuantumExplorer", points: 2450, avatar: "👑" },
  { rank: 2, name: "QubitMaster", points: 2340, avatar: "⚡" },
  { rank: 3, name: "EntanglePro", points: 2180, avatar: "🔬" },
  { rank: 42, name: "You", points: 250, avatar: "🎯" },
  { rank: 43, name: "CircuitBuilder", points: 240, avatar: "⚙️" },
];

export default function QuantumQuest() {
  const [selectedTab, setSelectedTab] = useState("learn");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userProgress, setUserProgress] = useState(mockUserProgress);
  const { toast } = useToast();

  // Level completion handler
  const completeLevel = (level: Level) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    toast({
      title: "🎉 Level Completed!",
      description: `You earned ${level.points} points for completing ${level.title}`,
    });

    // Update progress
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + level.points,
      completedLevels: prev.completedLevels + 1,
      streak: prev.streak + 1
    }));
    
    // Mark level as completed
    const updatedLevels = mockLevels.map(l => 
      l.id === level.id ? { ...l, completed: true } : l
    );
  };

  // Challenge completion handler
  const handleChallengeComplete = (levelId: string, success: boolean, timeElapsed: number) => {
    const level = mockLevels.find(l => l.id === levelId);
    if (level && success) {
      completeLevel(level);
    }
    setCurrentChallenge(null);
  };

  const handleStartChallenge = (level: Level) => {
    if (!level.locked) {
      setCurrentChallenge(level.id);
    }
  };

  const getDifficultyColor = (difficulty: Level['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      case 'research': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0 
                }}
                animate={{ 
                  y: window.innerHeight + 10,
                  rotate: 360,
                  transition: { 
                    duration: 3,
                    delay: Math.random() * 2 
                  }
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚀 Quantum Quest
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Master quantum computing through interactive challenges and real IBM Quantum experiments
          </p>

          {/* Progress Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{userProgress.totalPoints}</div>
                <div className="text-sm opacity-90">Total Points</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">Level {userProgress.level}</div>
                <div className="text-sm opacity-90">Current Level</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{userProgress.streak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">#{userProgress.rank}</div>
                <div className="text-sm opacity-90">Global Rank</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Progress
            </TabsTrigger>
          </TabsList>

          {/* Learning Challenges */}
          <TabsContent value="learn" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLevels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <Card className={`overflow-hidden ${level.locked ? 'opacity-60' : 'hover:shadow-xl'} transition-all duration-300`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={`${getDifficultyColor(level.difficulty)} text-white text-xs`}
                        >
                          {level.difficulty.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-2">
                          {level.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {level.locked && <Lock className="h-5 w-5 text-gray-400" />}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{level.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{level.description}</p>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{level.points} pts</span>
                        </div>
                        <Button 
                          size="sm"
                          disabled={level.locked}
                          onClick={() => handleStartChallenge(level)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          data-testid={`button-level-${level.id}`}
                        >
                          {level.completed ? 'Replay' : 'Start'}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${achievement.unlocked ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' : 'opacity-60'}`}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3 className={`font-bold mb-2 ${getRarityColor(achievement.rarity)}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {achievement.description}
                      </p>
                      <Badge 
                        variant={achievement.unlocked ? "default" : "secondary"}
                        className={`${getRarityColor(achievement.rarity)} capitalize`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              {mockLeaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`mb-3 ${player.name === 'You' ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300' : ''}`}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${player.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                          {player.rank <= 3 ? <Crown className="h-4 w-4" /> : player.rank}
                        </div>
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {player.points} points
                          </div>
                        </div>
                      </div>
                      {player.rank <= 3 && (
                        <Trophy className={`h-6 w-6 ${player.rank === 1 ? 'text-yellow-500' : player.rank === 2 ? 'text-gray-400' : 'text-orange-600'}`} />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Progress Analytics */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Beginner Levels</span>
                        <span>2/2</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Intermediate Levels</span>
                        <span>0/2</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Advanced Levels</span>
                        <span>0/1</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Research Challenges</span>
                        <span>0/1</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Completed "Superposition States"</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">+150 points</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Completed "First Qubit"</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">+100 points</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Award className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Unlocked "Quantum Beginner"</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Achievement earned</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Level Challenge View */}
        <AnimatePresence>
          {currentChallenge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
            >
              <LevelChallenge
                levelId={currentChallenge}
                onComplete={handleChallengeComplete}
                onBack={() => setCurrentChallenge(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}