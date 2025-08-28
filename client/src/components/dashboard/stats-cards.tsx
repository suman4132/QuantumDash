import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, Clock, BarChart3, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useJobStats } from "@/hooks/use-jobs";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2 },
  },
};

export function StatsCards() {
  const { data: stats, isLoading } = useJobStats();

  const cards = [
    {
      title: "Total Jobs",
      value: stats?.totalJobs || 0,
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30",
      borderColor: "border-blue-200 dark:border-blue-700/50",
      change: "+12%",
      trend: "up" as const,
      description: "Cumulative quantum jobs processed",
    },
    {
      title: "Running",
      value: stats?.runningJobs || 0,
      icon: <Zap className="w-6 h-6" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30",
      borderColor: "border-green-200 dark:border-green-700/50",
      change: "+5%",
      trend: "up" as const,
      description: "Currently executing on quantum hardware",
    },
    {
      title: "Queued",
      value: stats?.queuedJobs || 0,
      icon: <Clock className="w-6 h-6" />,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30",
      borderColor: "border-yellow-200 dark:border-yellow-700/50",
      change: "-8%",
      trend: "down" as const,
      description: "Waiting for quantum processor availability",
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || 0}%`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30",
      borderColor: "border-purple-200 dark:border-purple-700/50",
      change: "+2.1%",
      trend: "up" as const,
      description: "Quantum job completion success rate",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{
            y: -4,
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <Card className={`relative overflow-hidden backdrop-blur-sm border-2 ${card.borderColor} ${card.bgColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {card.title}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      card.trend === 'up'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-700'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-700'
                    }`}>
                      {card.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {card.change}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </p>
                    <div className={`p-3 rounded-xl shadow-sm ${card.bgColor} border border-white/20`}>
                      <div className={card.color}>
                        {card.icon}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-bl-full"></div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}