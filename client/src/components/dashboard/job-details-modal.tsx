
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Server, Hash, Tag, CheckCircle, XCircle, Play, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-auto"
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

            <CardContent className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {job.name || "Unnamed Job"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    ID: {job.id}
                  </p>
                </div>
                <Badge className={`${statusColors[job.status]} flex items-center gap-1.5 text-sm`}>
                  {statusIcons[job.status]}
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-3">
                  {job.queuePosition && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Queue Position:</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        #{job.queuePosition}
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

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <>
                  <Separator />
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
                </>
              )}

              {/* Error Message */}
              {job.error && (
                <>
                  <Separator />
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
                </>
              )}

              {/* Progress Indicator for Running Jobs */}
              {job.status === "running" && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Progress:</h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-green-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Job is currently running...</p>
                  </div>
                </>
              )}

              {/* Additional Information */}
              <Separator />
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-3">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Created:</span>
                    <br />
                    <span className="text-gray-600 dark:text-gray-400">
                      {format(new Date(job.submissionTime), "yyyy-MM-dd HH:mm:ss")}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <br />
                    <span className="text-gray-600 dark:text-gray-400">
                      {job.status} {job.queuePosition ? `(#${job.queuePosition} in queue)` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
