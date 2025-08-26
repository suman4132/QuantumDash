import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useJobStats } from "@/hooks/use-jobs";

const statusIndicatorVariants = {
  animate: {
    opacity: [1, 0.3, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function SystemStatus() {
  const { data: stats, dataUpdatedAt } = useJobStats();

  const getLastUpdateText = () => {
    if (!dataUpdatedAt) return "Never";
    const secondsAgo = Math.floor((Date.now() - dataUpdatedAt) / 1000);
    return `${secondsAgo}s ago`;
  };

  // Mock network usage based on job activity
  const networkUsage = stats ? Math.min(95, 20 + (stats.runningJobs * 15) + (stats.queuedJobs * 5)) : 0;

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">API Status</span>
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              variants={statusIndicatorVariants}
              animate="animate"
            />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Operational</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">142ms</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Last Update</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid="text-last-update">
            {getLastUpdateText()}
          </span>
        </div>
        
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Network Usage</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{networkUsage}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={networkUsage} 
              className="h-2"
              data-testid="progress-network-usage"
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
