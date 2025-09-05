
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Server, Hash, Tag, CheckCircle, XCircle, Play, Pause, Cpu, Zap, Code, BarChart3, Target, Activity, Database, Settings, TrendingUp, GitBranch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from "recharts";
import type { Job, JobStatus } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";

const statusColors: Record<JobStatus, string> = {
  queued: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  running: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  done: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const statusIcons: Record<JobStatus, React.ReactNode> = {
  queued: <Clock className="w-4 h-4" />,
  running: <Play className="w-4 h-4" />,
  done: <CheckCircle className="w-4 h-4" />,
  failed: <XCircle className="w-4 h-4" />,
  cancelled: <Pause className="w-4 h-4" />,
};

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const formatDuration = (duration: number | null) => {
    if (!duration) return "N/A";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Generate sample data for visualizations
  const generateErrorData = () => {
    return [
      { name: 'T1 (μs)', value: 311.79, min: 85.2, max: 523.4, type: 'coherence' },
      { name: 'T2 (μs)', value: 353.48, min: 127.8, max: 489.3, type: 'coherence' },
      { name: 'Readout Error', value: 4.7e-3, min: 1.343e-3, max: 1.936e-1, type: 'error' },
      { name: 'CZ Error', value: 1.681e-3, min: 6.943e-4, max: 1.99e-1, type: 'error' },
      { name: 'SX Error', value: 1.832e-4, min: 4.2e-5, max: 8.9e-4, type: 'error' }
    ];
  };

  const generateQueueData = () => {
    const data = [];
    const now = Date.now();
    for (let i = 0; i < 24; i++) {
      data.push({
        time: format(new Date(now - (24 - i) * 3600000), 'HH:mm'),
        position: Math.max(1, Math.floor(Math.random() * 50) - i * 2),
        estimatedWait: Math.max(5, 120 - i * 4)
      });
    }
    return data;
  };

  const generateTopologyData = () => {
    const nodes = [];
    const connections = [];
    const qubits = job.qubits || 27;
    
    // Generate qubit nodes in a grid-like pattern
    for (let i = 0; i < qubits; i++) {
      const row = Math.floor(i / Math.ceil(Math.sqrt(qubits)));
      const col = i % Math.ceil(Math.sqrt(qubits));
      nodes.push({
        id: i,
        x: col * 60 + 30,
        y: row * 60 + 30,
        error: Math.random() * 0.01,
        connected: i < qubits - 1
      });
      
      // Add connections to adjacent qubits
      if (col < Math.ceil(Math.sqrt(qubits)) - 1) {
        connections.push({ from: i, to: i + 1, error: Math.random() * 0.005 });
      }
      if (row < Math.floor(qubits / Math.ceil(Math.sqrt(qubits)))) {
        connections.push({ from: i, to: i + Math.ceil(Math.sqrt(qubits)), error: Math.random() * 0.005 });
      }
    }
    
    return { nodes, connections };
  };

  const errorData = generateErrorData();
  const queueData = generateQueueData();
  const topologyData = generateTopologyData();

  const formatScientific = (value: number) => {
    if (value < 0.001) {
      return value.toExponential(2);
    }
    return value.toFixed(3);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-5xl max-h-[90vh] overflow-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">Job Details</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
                data-testid="close-job-details"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {/* Header Info */}
              <div className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {job.name || "Unnamed Job"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      ID: {job.id}
                    </p>
                  </div>
                  <Badge className={`${statusColors[job.status as JobStatus]} flex items-center gap-1.5 text-sm`}>
                    {statusIcons[job.status as JobStatus]}
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mx-6 mb-4">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="circuit" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Circuit
                  </TabsTrigger>
                  <TabsTrigger value="execution" className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Execution
                  </TabsTrigger>
                  <TabsTrigger value="results" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Results
                  </TabsTrigger>
                  <TabsTrigger value="calibration" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    System
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="px-6 pb-6 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Job Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Backend:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {job.backend}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Submitted:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(job.submissionTime), "PPpp")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDuration(job.duration)}
                          </span>
                        </div>
                        {job.queuePosition && (
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Queue Position:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              #{job.queuePosition}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Circuit Specifications
                      </h4>
                      <div className="space-y-3">
                        {job.qubits && (
                          <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Qubits:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {job.qubits}
                            </span>
                          </div>
                        )}
                        {job.shots && (
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">Shots:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {job.shots.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Time Ago:</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDistanceToNow(new Date(job.submissionTime), { addSuffix: true })}
                          </span>
                        </div>
                        {job.startTime && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Started:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(job.startTime), "PPpp")}
                            </span>
                          </div>
                        )}
                        {job.endTime && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Completed:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {format(new Date(job.endTime), "PPpp")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress for Running Jobs */}
                  {job.status === "running" && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3 text-green-800 dark:text-green-200">Execution Progress</h4>
                      <div className="w-full bg-green-200 dark:bg-green-700 rounded-full h-3">
                        <motion.div
                          className="bg-green-500 h-3 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 2, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-2">Job is currently executing on quantum hardware...</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="circuit" className="px-6 pb-6 space-y-6">
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Quantum Circuit Details
                    </h4>
                    
                    {/* Circuit Specifications Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-800 dark:text-blue-200">Qubits</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {job.qubits || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-purple-800 dark:text-purple-200">Shots</span>
                        </div>
                        <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {job.shots?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">Circuit Depth</span>
                        </div>
                        <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {job.qubits ? Math.floor(Math.random() * 50) + 10 : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Quantum Processor Topology */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-medium flex items-center gap-2">
                          <GitBranch className="w-4 h-4" />
                          Processor Topology
                        </h5>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">Map View</Badge>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                        <div className="relative w-full h-96 flex items-center justify-center">
                          <svg width="100%" height="100%" viewBox="0 0 400 300" className="border rounded">
                            {/* Draw connections first (behind nodes) */}
                            {topologyData.connections.map((conn, i) => {
                              const fromNode = topologyData.nodes[conn.from];
                              const toNode = topologyData.nodes[conn.to];
                              if (!fromNode || !toNode) return null;
                              
                              const opacity = 1 - conn.error * 100; // Higher error = more transparent
                              return (
                                <line
                                  key={`conn-${i}`}
                                  x1={fromNode.x}
                                  y1={fromNode.y}
                                  x2={toNode.x}
                                  y2={toNode.y}
                                  stroke={conn.error > 0.003 ? '#ef4444' : '#10b981'}
                                  strokeWidth="2"
                                  opacity={Math.max(0.3, opacity)}
                                />
                              );
                            })}
                            
                            {/* Draw qubit nodes */}
                            {topologyData.nodes.map((node) => {
                              const color = node.error > 0.005 ? '#ef4444' : node.error > 0.002 ? '#f59e0b' : '#10b981';
                              return (
                                <g key={`node-${node.id}`}>
                                  <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="12"
                                    fill={color}
                                    stroke="#374151"
                                    strokeWidth="1"
                                  />
                                  <text
                                    x={node.x}
                                    y={node.y + 4}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="white"
                                    fontWeight="bold"
                                  >
                                    {node.id}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Good (&lt; 0.002)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Fair (0.002-0.005)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Poor (&gt; 0.005)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Circuit Program */}
                    {job.program && (
                      <div>
                        <h5 className="font-medium mb-2">Quantum Circuit Program</h5>
                        <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {job.program}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Basis Gates */}
                    <div>
                      <h5 className="font-medium mb-2">Basis Gates</h5>
                      <div className="flex flex-wrap gap-2">
                        {['cx', 'u1', 'u2', 'u3', 'measure'].map((gate) => (
                          <Badge key={gate} variant="outline" className="font-mono">
                            {gate}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="execution" className="px-6 pb-6 space-y-6">
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Backend & Execution Details
                    </h4>
                    
                    {/* Backend Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Backend Specifications</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Backend Name:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">{job.backend}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Total Qubits:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">127</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Processor Type:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Eagle r3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Region:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">US-East</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Queue Information</h5>
                        <div className="space-y-3">
                          {job.queuePosition && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Position in Queue:</span>
                              <Badge variant="outline">#{job.queuePosition}</Badge>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Estimated Wait:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {job.status === 'queued' ? '~15 minutes' : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Queue Length:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">23 jobs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Queue Timeline Chart */}
                    {job.status === 'queued' && (
                      <div>
                        <h5 className="font-medium mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Queue Position Timeline (24h)
                        </h5>
                        <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={queueData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" fontSize={12} />
                              <YAxis fontSize={12} />
                              <Tooltip 
                                formatter={(value, name) => [
                                  name === 'position' ? `#${value}` : `${value} min`,
                                  name === 'position' ? 'Queue Position' : 'Est. Wait Time'
                                ]}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="position" 
                                stroke="#3b82f6" 
                                fill="#3b82f6" 
                                fillOpacity={0.3}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}

                    {/* Performance Metrics Chart */}
                    <div>
                      <h5 className="font-medium mb-4">Backend Performance Metrics</h5>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={errorData.filter(d => d.type === 'error')}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={80} />
                            <YAxis fontSize={12} tickFormatter={formatScientific} />
                            <Tooltip formatter={(value) => [formatScientific(Number(value)), 'Error Rate']} />
                            <Bar dataKey="value" fill="#ef4444" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="px-6 pb-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Execution Results
                    </h4>
                    
                    {job.results ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                          <h5 className="font-medium mb-2">Measurement Results</h5>
                          <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
                            {JSON.stringify(job.results, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : job.status === 'done' ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Job completed successfully. Results may be available in the original quantum computing platform.
                        </p>
                      </div>
                    ) : job.status === 'running' ? (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Job is currently executing. Results will be available upon completion.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          No results available yet. Job status: {job.status}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="calibration" className="px-6 pb-6 space-y-6">
                  <div className="space-y-6">
                    <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      System Calibration & Performance
                    </h4>
                    
                    {/* Coherence Times Chart */}
                    <div>
                      <h5 className="font-medium mb-4">Coherence Times Distribution</h5>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={errorData.filter(d => d.type === 'coherence')}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip formatter={(value) => [`${value} μs`, 'Coherence Time']} />
                            <Bar dataKey="value" fill="#10b981">
                              <Bar dataKey="min" fill="#dc2626" />
                              <Bar dataKey="max" fill="#3b82f6" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex items-center gap-6 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500"></div>
                          <span>Median</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-600"></div>
                          <span>Minimum</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-600"></div>
                          <span>Maximum</span>
                        </div>
                      </div>
                    </div>

                    {/* Error Rate Scatter Plot */}
                    <div>
                      <h5 className="font-medium mb-4">Error Rate Analysis</h5>
                      <div className="bg-gray-50 dark:bg-gray-900/50 border rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={250}>
                          <ScatterChart data={[
                            { x: 1.68e-3, y: 1.83e-4, name: 'CZ vs SX Error' },
                            { x: 4.7e-3, y: 1.343e-3, name: 'Readout vs Min' },
                            { x: 6.94e-4, y: 1.99e-1, name: 'Best vs Max' }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              type="number" 
                              dataKey="x" 
                              fontSize={12}
                              tickFormatter={formatScientific}
                              name="Error Rate A"
                            />
                            <YAxis 
                              type="number" 
                              dataKey="y" 
                              fontSize={12}
                              tickFormatter={formatScientific}
                              name="Error Rate B"
                            />
                            <Tooltip 
                              formatter={(value, name) => [formatScientific(Number(value)), name]}
                            />
                            <Scatter dataKey="y" fill="#8884d8" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Detailed Error Rates Table */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Error Rates</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">2Q Error (best):</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">6.94E-4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median CZ Error:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">1.68E-3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median SX Error:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">1.83E-4</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Readout Error:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">4.7E-3</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300">Coherence Times</h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median T1:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">311.79 μs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Median T2:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">353.48 μs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">CLOPS:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">180K</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Last Calibrated:</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">31 minutes ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Tags and Error sections remain visible in overview tab */}
              {(job.tags && job.tags.length > 0 || job.error) && (
                <div className="px-6 pb-4 space-y-4">
                  {/* Tags */}
                  {job.tags && job.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Tags:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {job.error && (
                    <div>
                      <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                        Error Details:
                      </h4>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                        <p className="text-sm text-red-700 dark:text-red-300 font-mono">
                          {job.error}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
