import { type Job, type InsertJob, type Session, type InsertSession, type Backend, type InsertBackend, JobStatus, SessionStatus, BackendStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Jobs
  getJobs(limit?: number, offset?: number): Promise<Job[]>;
  getJobById(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJobStatus(id: string, status: JobStatus, error?: string): Promise<Job | undefined>;
  deleteJob(id: string): Promise<boolean>;
  searchJobs(query: string): Promise<Job[]>;
  getJobsByStatus(status: JobStatus): Promise<Job[]>;
  getJobsByBackend(backend: string): Promise<Job[]>;
  
  // Sessions
  getSessions(): Promise<Session[]>;
  getSessionById(id: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined>;
  deleteSession(id: string): Promise<boolean>;
  
  // Backends
  getBackends(): Promise<Backend[]>;
  getBackendById(id: string): Promise<Backend | undefined>;
  createBackend(backend: InsertBackend): Promise<Backend>;
  updateBackend(id: string, updates: Partial<Backend>): Promise<Backend | undefined>;
  
  // Analytics
  getJobStats(): Promise<{
    totalJobs: number;
    runningJobs: number;
    queuedJobs: number;
    successRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private jobs: Map<string, Job>;
  private sessions: Map<string, Session>;
  private backends: Map<string, Backend>;

  constructor() {
    this.jobs = new Map();
    this.sessions = new Map();
    this.backends = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some backends
    const backendData: InsertBackend[] = [
      {
        name: "ibm_cairo",
        status: "available",
        qubits: 127,
        queueLength: 0,
        averageWaitTime: 30,
        uptime: "99.8%",
      },
      {
        name: "ibm_osaka", 
        status: "busy",
        qubits: 127,
        queueLength: 8,
        averageWaitTime: 180,
        uptime: "99.2%",
      },
      {
        name: "ibm_kyoto",
        status: "maintenance",
        qubits: 127,
        queueLength: 0,
        averageWaitTime: 0,
        uptime: "0%",
      },
    ];

    backendData.forEach(backend => {
      const id = backend.name;
      this.backends.set(id, {
        ...backend,
        id,
        lastUpdate: new Date(),
      });
    });

    // Initialize with some sessions
    const sessionData: InsertSession[] = [
      {
        name: "Session #1",
        status: "active",
      },
      {
        name: "Session #2",
        status: "active",
      },
    ];

    sessionData.forEach((session, index) => {
      const id = `session_${index + 1}`;
      this.sessions.set(id, {
        ...session,
        id,
        createdAt: new Date(Date.now() - (index + 1) * 3600000),
        lastActivity: new Date(Date.now() - (index + 1) * 600000),
        jobCount: Math.floor(Math.random() * 5) + 1,
      });
    });
  }

  async getJobs(limit = 100, offset = 0): Promise<Job[]> {
    const allJobs = Array.from(this.jobs.values())
      .sort((a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime());
    return allJobs.slice(offset, offset + limit);
  }

  async getJobById(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = `job_${randomUUID().slice(0, 8)}`;
    const job: Job = {
      ...insertJob,
      id,
      submissionTime: new Date(),
      startTime: null,
      endTime: null,
      duration: null,
      results: null,
      error: null,
      queuePosition: insertJob.status === 'queued' ? await this.getNextQueuePosition(insertJob.backend) : null,
    };
    
    this.jobs.set(id, job);
    return job;
  }

  private async getNextQueuePosition(backend: string): Promise<number> {
    const queuedJobs = Array.from(this.jobs.values())
      .filter(job => job.backend === backend && job.status === 'queued');
    return queuedJobs.length + 1;
  }

  async updateJobStatus(id: string, status: JobStatus, error?: string): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const now = new Date();
    const updatedJob: Job = {
      ...job,
      status,
      error: error || null,
    };

    if (status === 'running' && job.status === 'queued') {
      updatedJob.startTime = now;
      updatedJob.queuePosition = null;
    } else if ((status === 'done' || status === 'failed') && job.status === 'running') {
      updatedJob.endTime = now;
      if (job.startTime) {
        updatedJob.duration = Math.floor((now.getTime() - new Date(job.startTime).getTime()) / 1000);
      }
    }

    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }

  async searchJobs(query: string): Promise<Job[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.jobs.values()).filter(job =>
      job.id.toLowerCase().includes(searchTerm) ||
      job.backend.toLowerCase().includes(searchTerm) ||
      job.status.toLowerCase().includes(searchTerm) ||
      job.name?.toLowerCase().includes(searchTerm) ||
      job.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getJobsByStatus(status: JobStatus): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  async getJobsByBackend(backend: string): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.backend === backend);
  }

  async getSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }

  async getSessionById(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = `session_${randomUUID().slice(0, 8)}`;
    const session: Session = {
      ...insertSession,
      id,
      createdAt: new Date(),
      lastActivity: new Date(),
      jobCount: 0,
    };
    
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  async getBackends(): Promise<Backend[]> {
    return Array.from(this.backends.values());
  }

  async getBackendById(id: string): Promise<Backend | undefined> {
    return this.backends.get(id);
  }

  async createBackend(insertBackend: InsertBackend): Promise<Backend> {
    const id = insertBackend.name;
    const backend: Backend = {
      ...insertBackend,
      id,
      lastUpdate: new Date(),
    };
    
    this.backends.set(id, backend);
    return backend;
  }

  async updateBackend(id: string, updates: Partial<Backend>): Promise<Backend | undefined> {
    const backend = this.backends.get(id);
    if (!backend) return undefined;

    const updatedBackend = { ...backend, ...updates, lastUpdate: new Date() };
    this.backends.set(id, updatedBackend);
    return updatedBackend;
  }

  async getJobStats(): Promise<{
    totalJobs: number;
    runningJobs: number;
    queuedJobs: number;
    successRate: number;
  }> {
    const allJobs = Array.from(this.jobs.values());
    const totalJobs = allJobs.length;
    const runningJobs = allJobs.filter(job => job.status === 'running').length;
    const queuedJobs = allJobs.filter(job => job.status === 'queued').length;
    const completedJobs = allJobs.filter(job => job.status === 'done' || job.status === 'failed');
    const successfulJobs = completedJobs.filter(job => job.status === 'done').length;
    const successRate = completedJobs.length > 0 ? (successfulJobs / completedJobs.length) * 100 : 0;

    return {
      totalJobs,
      runningJobs,
      queuedJobs,
      successRate: Math.round(successRate * 10) / 10,
    };
  }
}

export const storage = new MemStorage();
