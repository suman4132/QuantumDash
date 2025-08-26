import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Header } from "@/components/dashboard/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { JobsTable } from "@/components/dashboard/jobs-table";
import { TimelineView } from "@/components/dashboard/timeline-view";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/queryClient";
import { JobSimulator } from "@/lib/job-simulator";
import { useUpdateJobStatus } from "@/hooks/use-jobs";
import { useToast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(10);
  const updateJobStatus = useUpdateJobStatus();
  const { toast } = useToast();

  // Set up job simulator
  useEffect(() => {
    const simulator = JobSimulator.getInstance();
    
    simulator.onStatusChange((jobId, status, error) => {
      updateJobStatus.mutate(
        { id: jobId, status, error },
        {
          onSuccess: () => {
            const statusMessages = {
              running: "Job started running",
              done: "Job completed successfully",
              failed: "Job failed",
              cancelled: "Job was cancelled",
              queued: "Job queued",
            };
            
            toast({
              title: "Job Status Update",
              description: `${jobId}: ${statusMessages[status]}`,
              variant: status === "failed" ? "destructive" : "default",
            });
          },
        }
      );
    });
  }, [updateJobStatus, toast]);

  // Set up auto-refresh
  useEffect(() => {
    if (refreshInterval === 0) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/backends"] });
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRefreshIntervalChange = useCallback((interval: number) => {
    setRefreshInterval(interval);
  }, []);

  const handleManualRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/api/backends"] });
    queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
  }, []);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header
        onSearch={handleSearch}
        onRefreshIntervalChange={handleRefreshIntervalChange}
        onManualRefresh={handleManualRefresh}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div variants={itemVariants}>
          <StatsCards />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            <motion.div variants={itemVariants}>
              <JobsTable searchQuery={searchQuery} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TimelineView />
            </motion.div>

            <motion.div variants={itemVariants}>
              <AnalyticsCharts />
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div variants={itemVariants}>
            <Sidebar />
          </motion.div>
        </div>
      </div>

      {/* Floating Refresh Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          onClick={handleManualRefresh}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
          data-testid="button-floating-refresh"
        >
          <RefreshCw className="w-6 h-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
