import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Job, InsertJob, JobStatus, Backend, Session } from "@shared/schema";

export function useJobs(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ["/api/jobs", limit, offset],
    queryFn: async () => {
      const response = await fetch(`/api/jobs?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json() as Promise<Job[]>;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useSearchJobs(query: string) {
  return useQuery({
    queryKey: ["/api/jobs/search", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to search jobs");
      return response.json() as Promise<Job[]>;
    },
    enabled: query.length > 0,
  });
}

export function useJobStats() {
  return useQuery({
    queryKey: ["/api/analytics/stats"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json() as Promise<{
        totalJobs: number;
        runningJobs: number;
        queuedJobs: number;
        successRate: number;
      }>;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
}

export function useJobTrends() {
  return useQuery({
    queryKey: ["/api/analytics/trends"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/trends");
      if (!response.ok) throw new Error("Failed to fetch trends");
      return response.json() as Promise<Array<{
        date: string;
        count: number;
        label: string;
      }>>;
    },
  });
}

export function useBackends() {
  return useQuery({
    queryKey: ["/api/backends"],
    queryFn: async () => {
      const response = await fetch("/api/backends");
      if (!response.ok) throw new Error("Failed to fetch backends");
      return response.json() as Promise<Backend[]>;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useSessions() {
  return useQuery({
    queryKey: ["/api/sessions"],
    queryFn: async () => {
      const response = await fetch("/api/sessions");
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return response.json() as Promise<Session[]>;
    },
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (job: InsertJob) => {
      return await apiRequest("POST", "/api/jobs", job);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, error }: { id: string; status: JobStatus; error?: string }) => {
      return await apiRequest("PATCH", `/api/jobs/${id}/status`, { status, error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/jobs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}
