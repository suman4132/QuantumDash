import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useJobStats, useJobTrends, useJobs } from "@/hooks/use-jobs";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6b7280"];

const chartVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function AnalyticsCharts() {
  const { data: stats, isLoading: statsLoading } = useJobStats();
  const { data: trends, isLoading: trendsLoading } = useJobTrends();
  const { data: jobsData } = useJobs(1, 100); // Get more jobs for analytics
  const jobs = jobsData?.jobs || [];

  // Prepare status chart data
  const statusData = [
    { name: "Done", value: jobs.filter(j => j.status === "done").length },
    { name: "Running", value: jobs.filter(j => j.status === "running").length },
    { name: "Queued", value: jobs.filter(j => j.status === "queued").length },
    { name: "Failed", value: jobs.filter(j => j.status === "failed").length },
    { name: "Cancelled", value: jobs.filter(j => j.status === "cancelled").length },
  ].filter(item => item.value > 0);

  if (statsLoading || trendsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Jobs by Status Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Jobs by Status</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-jobs-by-status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((entry, index) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Job Submission Trends Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Job Submission Trends</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-job-trends">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="label" 
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#0f62fe"
                    strokeWidth={3}
                    dot={{ fill: "#0f62fe", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#0f62fe", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
