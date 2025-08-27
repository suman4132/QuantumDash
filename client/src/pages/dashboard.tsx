import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, XCircle, Clock, Play } from "lucide-react";
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
import { ActiveSessions } from "@/components/dashboard/active-sessions";
import { BackendAdvisor } from "@/components/dashboard/backend-advisor";
import { AllBackendsView } from "@/components/dashboard/all-backends-view";
import { SessionForm } from "@/components/dashboard/session-form";
import { NotificationWidget } from "@/components/dashboard/notification-widget";
import { AnimatePresence } from "framer-motion";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentView = searchParams.get('view') || 'dashboard';

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

            const statusIcons = {
              running: <Play className="w-4 h-4" />,
              done: <CheckCircle className="w-4 h-4" />,
              failed: <XCircle className="w-4 h-4" />,
              cancelled: <XCircle className="w-4 h-4" />,
              queued: <Clock className="w-4 h-4" />,
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

  const handleViewChange = (view: string) => {
    if (view === "all-backends") {
      setSearchParams({ view: 'all-backends' });
    } else {
      setSearchParams({});
    }
  };

  const handleOpenSessionForm = () => {
    setShowSessionForm(true);
  };

  const handleCloseSessionForm = () => {
    setShowSessionForm(false);
  };

  // Conditionally render different views
  if (currentView === 'all-backends') {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Floating background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              rotate: [360, 180, 0],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </div>

        <Header
          onSearch={handleSearch}
          onRefreshIntervalChange={handleRefreshIntervalChange}
          onManualRefresh={handleManualRefresh}
          onViewChange={handleViewChange}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div variants={itemVariants}>
            <AllBackendsView onBack={() => handleViewChange('dashboard')} />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>
      <Header
        onSearch={handleSearch}
        onRefreshIntervalChange={handleRefreshIntervalChange}
        onManualRefresh={handleManualRefresh}
        onViewChange={handleViewChange} // Pass the handler to Header
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div variants={itemVariants}>
          <StatsCards />
        </motion.div>
        
        {/* Notification Widget in top right */}
        <motion.div 
          className="fixed top-20 right-6 z-30"
          variants={itemVariants}
        >
          <NotificationWidget />
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
            <Sidebar onViewChange={handleViewChange} onOpenSessionForm={handleOpenSessionForm} />
          </motion.div>
        </div>
      </div>

      {/* Session Form Modal */}
      <AnimatePresence>
        {showSessionForm && (
          <SessionForm onClose={handleCloseSessionForm} />
        )}
      </AnimatePresence>

      {/* Floating Refresh Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          onClick={handleManualRefresh}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 backdrop-blur-sm border-2 border-white/20"
          data-testid="button-floating-refresh"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-7 h-7" />
          </motion.div>
        </Button>
      </motion.div>
    </motion.div>
  );
}