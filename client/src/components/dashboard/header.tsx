import { useState, useEffect } from "react";
import { Moon, Sun, Search, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import { useJobStats, useJobs } from "@/hooks/use-jobs";
import { motion } from "framer-motion";
import { 
  Settings, 
  Filter,
  Download,
  BarChart3,
  LogOut,
  User
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  onSearch: (query: string) => void;
  onRefreshIntervalChange: (interval: number) => void;
  onManualRefresh: () => void;
  onViewChange?: (view: string) => void;
  onNotificationToggle?: () => void;
}

export function Header({ onSearch, onRefreshIntervalChange, onManualRefresh, onViewChange, onNotificationToggle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshInterval, setRefreshInterval] = useState("10");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const { data: jobsData } = useJobs(1, 50);

  const jobs = jobsData?.jobs || [];

  // Get recent completed jobs (last 24 hours) and running jobs for notification count
  const recentCompletedJobs = jobs.filter(job => 
    (job.status === "done" || job.status === "failed") && 
    job.endTime && 
    new Date(job.endTime).getTime() > Date.now() - 24 * 60 * 60 * 1000
  );

  const runningJobs = jobs.filter(job => job.status === "running");
  const notificationCount = recentCompletedJobs.length + runningJobs.length;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onManualRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRefreshIntervalChange = (value: string) => {
    setRefreshInterval(value);
    onRefreshIntervalChange(parseInt(value));
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-quantum-blue to-quantum-purple rounded-lg flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-6 h-6 text-white">⚛️</div>
                </motion.div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">IBM Quantum</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Jobs Dashboard</p>
              </div>
            </div>
          </motion.div>

          {/* Search and Controls */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search jobs, backends, IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            {/* Auto-refresh Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Auto-refresh:</span>
              <Select value={refreshInterval} onValueChange={handleRefreshIntervalChange}>
                <SelectTrigger className="w-20 h-8" data-testid="select-refresh-interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Off</SelectItem>
                  <SelectItem value="5">5s</SelectItem>
                  <SelectItem value="10">10s</SelectItem>
                  <SelectItem value="30">30s</SelectItem>
                  <SelectItem value="60">1min</SelectItem>
                </SelectContent>
              </Select>
              {parseInt(refreshInterval) > 0 && (
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>



            {/* Notification Bell */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={onNotificationToggle}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenu>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    logout();
                    window.location.href = '/';
                  }} className="text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}