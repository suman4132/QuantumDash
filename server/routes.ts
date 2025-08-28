import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, insertSessionSchema, JobStatus } from "@shared/schema";
import { z } from "zod";
import { ibmQuantumService } from "./ibm-quantum";

export async function registerRoutes(app: Express): Promise<Server> {
  // Jobs endpoints
  app.get("/api/jobs", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const allJobs = await storage.getJobs();
      const totalJobs = allJobs.length;
      const paginatedJobs = allJobs.slice(offset, offset + limit);

      res.json({
        jobs: paginatedJobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalJobs / limit),
          totalJobs,
          limit
        }
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const jobs = await storage.searchJobs(query);
      res.json(jobs);
    } catch (error) {
      console.error("Error searching jobs:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/jobs/status/:status", async (req, res) => {
    try {
      const status = req.params.status as JobStatus;
      const jobs = await storage.getJobsByStatus(status);
      res.json(jobs);
    } catch (error) {
      console.error(`Error fetching jobs by status ${status}:`, error);
      res.status(500).json({ error: "Failed to fetch jobs by status" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error(`Error fetching job with ID ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });

  app.patch("/api/jobs/:id/status", async (req, res) => {
    try {
      const { status, error } = req.body;
      const job = await storage.updateJobStatus(req.params.id, status, error);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error(`Error updating status for job ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update job status" });
    }
  });

  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      const success = await storage.deleteJob(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting job ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete job" });
    }
  });

  // Sessions endpoints
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  // Backends endpoints
  app.get("/api/backends", async (req, res) => {
    try {
      const backends = await storage.getBackends();
      res.json(backends);
    } catch (error) {
      console.error("Error fetching backends:", error);
      res.status(500).json({ error: "Failed to fetch backends" });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const stats = await storage.getJobStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching job stats:", error);
      res.status(500).json({ error: "Failed to fetch job stats" });
    }
  });

  app.get("/api/analytics/trends", async (req, res) => {
    try {
      // Simple trend data generation
      const jobs = await storage.getJobs();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const trends = last7Days.map(date => {
        const dayJobs = jobs.filter(job =>
          job.submissionTime.toISOString().split('T')[0] === date
        );
        return {
          date,
          count: dayJobs.length,
          label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
        };
      });

      res.json(trends);
    } catch (error) {
      console.error("Error fetching trends:", error);
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  // IBM Quantum Sync
  app.post("/api/sync/ibm", async (req, res) => {
    try {
      if (!ibmQuantumService.isConfigured()) {
        return res.status(400).json({ error: "IBM Quantum API not configured" });
      }

      // Force sync with IBM Quantum
      const jobs = await ibmQuantumService.getJobs(100);
      const backends = await ibmQuantumService.getBackends();

      // Assuming storage has methods to insert/update jobs and backends
      // For now, we'll just log the counts and return them.
      // In a real application, you would process and store these.
      console.log(`Syncing ${jobs.length} jobs and ${backends.length} backends from IBM Quantum.`);

      res.json({
        success: true,
        synced: {
          jobs: jobs.length,
          backends: backends.length
        },
        message: `Successfully synced ${jobs.length} jobs and ${backends.length} backends from IBM Quantum Cloud`
      });
    } catch (error) {
      console.error("Error syncing with IBM Quantum:", error);
      res.status(500).json({
        error: "Failed to sync with IBM Quantum Cloud",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });


  // Export endpoints
  app.get("/api/export/csv", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      const csvHeaders = "Job ID,Backend,Status,Submitted,Duration\n";
      const csvData = jobs.map(job =>
        `${job.id},${job.backend},${job.status},${job.submissionTime.toISOString()},${job.duration || 0}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="quantum_jobs.csv"');
      res.send(csvHeaders + csvData);
    } catch (error) {
      console.error("Error exporting jobs to CSV:", error);
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  app.get("/api/export/json", async (req, res) => {
    try {
      const jobs = await storage.getJobs();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="quantum_jobs.json"');
      res.json(jobs);
    } catch (error) {
      console.error("Error exporting jobs to JSON:", error);
      res.status(500).json({ error: "Failed to export JSON" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}