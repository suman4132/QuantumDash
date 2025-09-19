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
import { EnhancedGateSimulator } from "./enhanced-gate-simulator";
import { QuantumJobIntegration } from "./quantum-job-integration";
import { useToast } from "@/hooks/use-toast";

// Import enhanced quantum gates to ensure proper educational data
const ENHANCED_QUANTUM_GATES = [
  {
    id: "hadamard",
    name: "Hadamard",
    symbol: "H",
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    description: "Creates equal superposition - the foundation of quantum computing",
    matrix: [
      [{ real: 1/Math.sqrt(2), imaginary: 0 }, { real: 1/Math.sqrt(2), imaginary: 0 }],
      [{ real: 1/Math.sqrt(2), imaginary: 0 }, { real: -1/Math.sqrt(2), imaginary: 0 }]
    ],
    educational: {
      concept: "Superposition",
      visualEffect: "Transforms |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2",
      realWorldUse: "Used in quantum algorithms like Grover's search and Shor's factoring"
    }
  },
  {
    id: "pauli-x",
    name: "Pauli-X",
    symbol: "X",
    color: "bg-gradient-to-r from-red-500 to-red-600",
    description: "Quantum NOT gate - flips qubit state",
    matrix: [
      [{ real: 0, imaginary: 0 }, { real: 1, imaginary: 0 }],
      [{ real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }]
    ],
    educational: {
      concept: "Bit Flip",
      visualEffect: "Flips |0⟩ → |1⟩ and |1⟩ → |0⟩",
      realWorldUse: "Error correction, quantum state preparation"
    }
  },
  {
    id: "cnot",
    name: "CNOT",
    symbol: "CNOT",
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
    description: "Controlled NOT - creates entanglement between qubits",
    educational: {
      concept: "Entanglement",
      visualEffect: "Flips target if control is |1⟩",
      realWorldUse: "Bell states, error correction, quantum teleportation"
    }
  }
];

// Helper function to get gate by ID
const getGateById = (id: string) => ENHANCED_QUANTUM_GATES.find(gate => gate.id === id);

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
      initialGates: [getGateById("hadamard")].filter(Boolean),
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
  },
  "qr-501": {
    id: "qr-501",
    title: "Quantum Teleportation Protocol",
    description: "Execute a real quantum teleportation circuit on IBM Quantum hardware",
    difficulty: "research",
    points: 500,
    timeLimit: 1800, // 30 minutes
    category: "Quantum Research",
    learningObjectives: [
      "Implement quantum teleportation protocol",
      "Execute circuits on real quantum hardware",
      "Understand quantum measurement and state transfer"
    ],
    challenge: {
      type: 'research-project',
      instructions: "Build and execute a quantum teleportation circuit. Create Bell pair entanglement, perform measurements, and apply conditional operations to teleport a qubit state. This will run on real IBM Quantum hardware!",
      targetState: "Teleported |ψ⟩ state",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Start by creating a Bell pair between qubits 1 and 2",
        "Entangle the input qubit (0) with qubit 1 using CNOT", 
        "Measure qubits 0 and 1 to collapse the entangled state",
        "Apply X and Z gates conditionally based on measurement results"
      ]
    }
  },
  "qg-202": {
    id: "qg-202",
    title: "Entanglement Circuits", 
    description: "Create entangled states using CNOT gates and measure correlations",
    difficulty: "intermediate",
    points: 250,
    timeLimit: 1200, // 20 minutes
    category: "Quantum Gates",
    learningObjectives: [
      "Master CNOT gate operations",
      "Create entangled two-qubit states",
      "Measure quantum correlations"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Build a circuit that creates a |01⟩ + |10⟩ entangled state. Start with a Hadamard on qubit 1, then apply X to qubit 0, then CNOT with qubit 1 as control.",
      targetState: "|Ψ−⟩ = (|01⟩ - |10⟩)/√2",
      initialGates: [
        {
          id: "hadamard",
          name: "Hadamard", 
          symbol: "H",
          color: "bg-blue-500",
          description: "Creates superposition"
        },
        {
          id: "x",
          name: "Pauli-X",
          symbol: "X",
          color: "bg-red-500",
          description: "Bit flip gate"
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
        { qubit: 0, position: 0, gateId: "x" },
        { qubit: 1, position: 0, gateId: "hadamard" },
        { qubit: 1, position: 1, gateId: "cnot" }
      ],
      maxMoves: 3,
      hints: [
        "Start by flipping qubit 0 with X gate",
        "Apply Hadamard to qubit 1 to create superposition",
        "Use CNOT to create entanglement"
      ]
    }
  },
  "qa-301": {
    id: "qa-301",
    title: "Bell State Analysis",
    description: "Run real Bell state circuits on IBM Quantum hardware",
    difficulty: "advanced",
    points: 400,
    timeLimit: 2400, // 40 minutes
    category: "Quantum Algorithms",
    learningObjectives: [
      "Implement Bell state preparation",
      "Execute algorithms on quantum hardware",
      "Analyze quantum measurement statistics"
    ],
    challenge: {
      type: 'algorithm-implementation',
      instructions: "Implement and execute a Bell state preparation algorithm on real IBM Quantum hardware. Prepare the |Φ+⟩ Bell state and analyze the measurement results to verify entanglement.",
      targetState: "Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Use Hadamard gate on control qubit",
        "Apply CNOT gate to create entanglement",
        "Measure both qubits simultaneously",
        "Check for 50/50 correlation in |00⟩ and |11⟩ states"
      ]
    }
  },
  "qr-401": {
    id: "qr-401",
    title: "Quantum Optimization Challenge",
    description: "Solve a real-world optimization problem using quantum algorithms",
    difficulty: "research",
    points: 600,
    timeLimit: 3600, // 60 minutes
    category: "Research Challenges",
    learningObjectives: [
      "Apply QAOA for optimization problems",
      "Use variational quantum algorithms",
      "Solve MaxCut problems on quantum hardware"
    ],
    challenge: {
      type: 'research-project',
      instructions: "Implement and optimize a Quantum Approximate Optimization Algorithm (QAOA) to solve a 3-node MaxCut problem. This advanced challenge runs on real quantum hardware and requires optimization of variational parameters.",
      targetState: "Optimal MaxCut solution",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Start with equal superposition using Hadamard gates",
        "Apply problem Hamiltonian with ZZ interactions",
        "Implement mixer Hamiltonian with X rotations",
        "Optimize beta and gamma parameters iteratively"
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
            <EnhancedGateSimulator
              challenge={{
                id: challenge.id,
                title: challenge.title,
                description: challenge.challenge.instructions,
                targetState: challenge.challenge.targetState || "|ψ⟩",
                initialGates: challenge.challenge.initialGates,
                solution: challenge.challenge.solution,
                maxMoves: challenge.challenge.maxMoves,
                educationalTips: challenge.learningObjectives
              }}
              onComplete={handleChallengeComplete}
            />
          )}
          
          {(challenge.challenge.type === 'research-project' || challenge.challenge.type === 'algorithm-implementation') && (
            <QuantumJobIntegration
              levelId={challenge.id}
              circuitData={{
                gates: challenge.challenge.solution.map(sol => ({
                  type: sol.gateId,
                  qubit: sol.qubit,
                  position: sol.position
                })),
                qubits: 2
              }}
              expectedResult={challenge.challenge.targetState || "Bell state"}
              onJobComplete={(success, result) => {
                if (success) {
                  toast({
                    title: "🎉 Quantum Execution Complete!",
                    description: `Successfully executed ${challenge.title} on quantum hardware!`,
                  });
                }
                handleChallengeComplete(success);
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}