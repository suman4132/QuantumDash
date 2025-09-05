import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertJobSchema, insertSessionSchema, insertWorkspaceSchema, 
  insertWorkspaceMemberSchema, insertProjectSchema, insertProjectCollaboratorSchema,
  JobStatus, WorkspaceStatus, ProjectStatus 
} from "@shared/schema";
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

  // IBM Quantum Sync Status
  app.get("/api/sync/ibm/status", async (req, res) => {
    try {
      res.json({
        configured: ibmQuantumService.isConfigured(),
        status: ibmQuantumService.getApiStatus(),
        lastSync: new Date().toISOString(),
        endpoints: {
          runtime: "https://runtime.quantum-computing.ibm.com",
          auth: "https://auth.quantum-computing.ibm.com/api"
        }
      });
    } catch (error) {
      console.error("Error checking IBM Quantum status:", error);
      res.status(500).json({ error: "Failed to check IBM Quantum status" });
    }
  });

  // Sync with IBM Quantum
  app.post('/api/sync/ibm', async (req, res) => {
    try {
      if (!ibmQuantumService.isConfigured()) {
        console.log('IBM Quantum API not configured, using simulated data');
        return res.json({ 
          message: 'Using simulated data for demonstration',
          configured: false
        });
      }

      // This would trigger a manual sync in a real implementation
      console.log('Manual IBM Quantum sync requested');
      res.json({ 
        message: 'Sync initiated successfully',
        configured: true
      });
    } catch (error) {
      console.error('Sync error:', error);
      res.status(500).json({ error: 'Failed to sync with IBM Quantum' });
    }
  });


  // Real-time IBM Quantum data
  app.get("/api/ibm-quantum/live", async (req, res) => {
    try {
      if (!ibmQuantumService.isConfigured()) {
        return res.status(400).json({ 
          error: "IBM Quantum API not configured",
          details: "Please add IBM_QUANTUM_API_TOKEN to your .env file"
        });
      }

      const [jobs, backends] = await Promise.all([
        ibmQuantumService.getJobs(50),
        ibmQuantumService.getBackends()
      ]);

      res.json({
        timestamp: new Date().toISOString(),
        jobs: jobs.map(job => ({
          id: job.id,
          name: job.name,
          backend: job.backend,
          status: job.status,
          created: job.created,
          qubits: job.qubits,
          shots: job.shots
        })),
        backends: backends.map(backend => ({
          name: backend.name,
          status: backend.status,
          qubits: backend.num_qubits,
          queue: backend.pending_jobs
        })),
        summary: {
          totalJobs: jobs.length,
          runningJobs: jobs.filter(j => j.status === 'running').length,
          queuedJobs: jobs.filter(j => j.status === 'queued').length,
          availableBackends: backends.filter(b => b.status === 'online').length
        }
      });
    } catch (error) {
      console.error("Error fetching live IBM Quantum data:", error);
      res.status(500).json({ 
        error: "Failed to fetch live data from IBM Quantum",
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

  // ==================== TEAMWORK API ROUTES ====================

  // Workspace endpoints
  app.get("/api/workspaces", async (req, res) => {
    try {
      const workspaces = await storage.getWorkspaces();
      res.json(workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      res.status(500).json({ error: "Failed to fetch workspaces" });
    }
  });

  app.get("/api/workspaces/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const workspaces = await storage.searchWorkspaces(query);
      res.json(workspaces);
    } catch (error) {
      console.error("Error searching workspaces:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/workspaces/:id", async (req, res) => {
    try {
      const workspace = await storage.getWorkspaceById(req.params.id);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json(workspace);
    } catch (error) {
      console.error(`Error fetching workspace with ID ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch workspace" });
    }
  });

  app.post("/api/workspaces", async (req, res) => {
    try {
      const workspaceData = insertWorkspaceSchema.parse(req.body);
      const workspace = await storage.createWorkspace(workspaceData);
      res.status(201).json(workspace);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating workspace:", error);
      res.status(500).json({ error: "Failed to create workspace" });
    }
  });

  app.patch("/api/workspaces/:id", async (req, res) => {
    try {
      const workspace = await storage.updateWorkspace(req.params.id, req.body);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json(workspace);
    } catch (error) {
      console.error(`Error updating workspace ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update workspace" });
    }
  });

  app.delete("/api/workspaces/:id", async (req, res) => {
    try {
      const success = await storage.deleteWorkspace(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Workspace not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting workspace ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete workspace" });
    }
  });

  // Workspace Member endpoints
  app.get("/api/workspaces/:workspaceId/members", async (req, res) => {
    try {
      const members = await storage.getWorkspaceMembers(req.params.workspaceId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching workspace members:", error);
      res.status(500).json({ error: "Failed to fetch workspace members" });
    }
  });

  app.post("/api/workspaces/:workspaceId/members", async (req, res) => {
    try {
      const memberData = insertWorkspaceMemberSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId
      });
      const member = await storage.addWorkspaceMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error adding workspace member:", error);
      res.status(500).json({ error: "Failed to add workspace member" });
    }
  });

  app.patch("/api/workspace-members/:id", async (req, res) => {
    try {
      const member = await storage.updateWorkspaceMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ error: "Workspace member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error(`Error updating workspace member ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update workspace member" });
    }
  });

  app.delete("/api/workspace-members/:id", async (req, res) => {
    try {
      const success = await storage.removeWorkspaceMember(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Workspace member not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error removing workspace member ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to remove workspace member" });
    }
  });

  // Project endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const projects = await storage.searchProjects(query);
      res.json(projects);
    } catch (error) {
      console.error("Error searching projects:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/workspaces/:workspaceId/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByWorkspace(req.params.workspaceId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching workspace projects:", error);
      res.status(500).json({ error: "Failed to fetch workspace projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error(`Error fetching project with ID ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error(`Error updating project ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting project ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Project Collaborator endpoints
  app.get("/api/projects/:projectId/collaborators", async (req, res) => {
    try {
      const collaborators = await storage.getProjectCollaborators(req.params.projectId);
      res.json(collaborators);
    } catch (error) {
      console.error("Error fetching project collaborators:", error);
      res.status(500).json({ error: "Failed to fetch project collaborators" });
    }
  });

  app.post("/api/projects/:projectId/collaborators", async (req, res) => {
    try {
      const collaboratorData = insertProjectCollaboratorSchema.parse({
        ...req.body,
        projectId: req.params.projectId
      });
      const collaborator = await storage.addProjectCollaborator(collaboratorData);
      res.status(201).json(collaborator);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error adding project collaborator:", error);
      res.status(500).json({ error: "Failed to add project collaborator" });
    }
  });

  app.patch("/api/project-collaborators/:id", async (req, res) => {
    try {
      const collaborator = await storage.updateProjectCollaborator(req.params.id, req.body);
      if (!collaborator) {
        return res.status(404).json({ error: "Project collaborator not found" });
      }
      res.json(collaborator);
    } catch (error) {
      console.error(`Error updating project collaborator ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update project collaborator" });
    }
  });

  app.delete("/api/project-collaborators/:id", async (req, res) => {
    try {
      const success = await storage.removeProjectCollaborator(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project collaborator not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error removing project collaborator ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to remove project collaborator" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}