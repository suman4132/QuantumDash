import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Clock, 
  Zap,
  Target,
  Trophy
} from "lucide-react";
import { GateSimulator } from "./gate-simulator";
import { useToast } from "@/hooks/use-toast";

// Enhanced challenge types
interface LevelChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'research';
  points: number;
  timeLimit?: number;
  category: string;
  learningObjectives: string[];
  challenge: {
    type: 'gate-builder' | 'circuit-analysis' | 'algorithm-implementation' | 'research-project';
    instructions: string;
    targetState?: string;
    initialGates: any[];
    solution: any[];
    maxMoves: number;
    hints?: string[];
  };
}

// Sample challenges for different levels
const LEVEL_CHALLENGES: Record<string, LevelChallenge> = {
  "qb-101": {
    id: "qb-101",
    title: "First Qubit",
    description: "Learn what a qubit is and how it differs from classical bits",
    difficulty: "beginner",
    points: 100,
    timeLimit: 300, // 5 minutes
    category: "Quantum Basics",
    learningObjectives: [
      "Understand the concept of a qubit",
      "Differentiate between |0⟩ and |1⟩ states",
      "Visualize quantum state representation"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Click on the qubit to see it in the |0⟩ state. This is your first quantum bit!",
      targetState: "|0⟩",
      initialGates: [], // No gates needed for this intro
      solution: [],
      maxMoves: 0
    }
  },
  "qb-102": {
    id: "qb-102", 
    title: "Superposition States",
    description: "Master the concept of quantum superposition with interactive examples",
    difficulty: "beginner",
    points: 150,
    timeLimit: 600, // 10 minutes
    category: "Quantum Basics",
    learningObjectives: [
      "Create superposition using Hadamard gates",
      "Understand equal probability states",
      "Measure superposition outcomes"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Use a Hadamard gate to create superposition. Place it on the first qubit to create the |+⟩ state.",
      targetState: "|+⟩",
      initialGates: [
        {
          id: "hadamard",
          name: "Hadamard",
          symbol: "H",
          color: "bg-blue-500",
          description: "Creates superposition - equal |0⟩ and |1⟩ probability"
        }
      ],
      solution: [{ qubit: 0, position: 0, gateId: "hadamard" }],
      maxMoves: 1,
      hints: [
        "The Hadamard gate creates an equal superposition state",
        "Drag the H gate onto the qubit line",
        "The |+⟩ state means (|0⟩ + |1⟩)/√2"
      ]
    }
  },
  "qg-201": {
    id: "qg-201",
    title: "Hadamard Gates",
    description: "Build circuits using Hadamard gates to create superposition",
    difficulty: "intermediate",
    points: 200,
    timeLimit: 900, // 15 minutes
    category: "Quantum Gates",
    learningObjectives: [
      "Master Hadamard gate properties",
      "Create complex superposition states",
      "Understand gate sequences"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Create a Bell state by first applying Hadamard to qubit 0, then CNOT with qubit 0 as control and qubit 1 as target.",
      targetState: "|Φ+⟩ = (|00⟩ + |11⟩)/√2",
      initialGates: [
        {
          id: "hadamard",
          name: "Hadamard", 
          symbol: "H",
          color: "bg-blue-500",
          description: "Creates superposition"
        },
        {
          id: "cnot",
          name: "CNOT",
          symbol: "⊕", 
          color: "bg-purple-500",
          description: "Controlled-NOT gate"
        }
      ],
      solution: [
        { qubit: 0, position: 0, gateId: "hadamard" },
        { qubit: 0, position: 1, gateId: "cnot" }
      ],
      maxMoves: 2,
      hints: [
        "Start with Hadamard on the control qubit",
        "Then add CNOT to create entanglement",
        "Bell states are maximally entangled"
      ]
    }
  }
};

interface LevelChallengeProps {
  levelId: string;
  onComplete: (levelId: string, success: boolean, timeElapsed: number) => void;
  onBack: () => void;
}

export function LevelChallenge({ levelId, onComplete, onBack }: LevelChallengeProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const { toast } = useToast();
  
  const challenge = LEVEL_CHALLENGES[levelId];
  
  if (!challenge) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Challenge not found: {levelId}</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Levels
        </Button>
      </div>
    );
  }

  const handleChallengeComplete = (success: boolean) => {
    onComplete(levelId, success, timeElapsed);
  };

  const showNextHint = () => {
    if (challenge.challenge.hints && currentHintIndex < challenge.challenge.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
      toast({
        title: "💡 Hint",
        description: challenge.challenge.hints![currentHintIndex + 1],
      });
    }
  };

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'advanced': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'research': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quest
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{challenge.title}</h1>
              <p className="text-gray-600 dark:text-gray-300">{challenge.description}</p>
            </div>
          </div>
          <Badge className={`${getDifficultyColor()} font-semibold`}>
            {challenge.difficulty.toUpperCase()}
          </Badge>
        </motion.div>

        {/* Challenge Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{challenge.points}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold">
                {challenge.timeLimit ? Math.floor(challenge.timeLimit / 60) : '∞'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {challenge.timeLimit ? 'Minutes' : 'No Limit'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{challenge.challenge.maxMoves || '∞'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Max Moves</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{challenge.category}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Category</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenge.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Challenge Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Challenge Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {challenge.challenge.instructions}
              </p>
              {challenge.challenge.hints && challenge.challenge.hints.length > 0 && (
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showNextHint}
                    disabled={currentHintIndex >= challenge.challenge.hints.length - 1}
                    data-testid="button-hint"
                  >
                    💡 Show Hint ({currentHintIndex + 1}/{challenge.challenge.hints.length})
                  </Button>
                  <span className="text-sm text-gray-500">
                    Hints help you learn, but try solving it first!
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive Challenge Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {challenge.challenge.type === 'gate-builder' && (
            <GateSimulator
              challenge={{
                id: challenge.id,
                title: challenge.title,
                description: challenge.challenge.instructions,
                targetState: challenge.challenge.targetState || "|ψ⟩",
                initialGates: challenge.challenge.initialGates,
                solution: challenge.challenge.solution,
                maxMoves: challenge.challenge.maxMoves
              }}
              onComplete={handleChallengeComplete}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}