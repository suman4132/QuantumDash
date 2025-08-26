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
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.jobs = new Map();
    this.sessions = new Map();
    this.backends = new Map();
    this.initializeData();
    this.startJobSimulation();
  }

  private startJobSimulation() {
    // Simulate job status changes every 15-30 seconds
    this.simulationInterval = setInterval(() => {
      this.simulateJobStatusChanges();
    }, 20000 + Math.random() * 10000);
  }

  private initializeData() {
    // Initialize with some backends
    const backendData: InsertBackend[] = [
      {
        name: "ibm_cairo",
        status: "available",
        qubits: 127,
        queueLength: 2,
        averageWaitTime: 45,
        uptime: "99.8%",
      },
      {
        name: "ibm_osaka", 
        status: "busy",
        qubits: 127,
        queueLength: 12,
        averageWaitTime: 320,
        uptime: "99.2%",
      },
      {
        name: "ibm_kyoto",
        status: "available",
        qubits: 127,
        queueLength: 1,
        averageWaitTime: 25,
        uptime: "98.9%",
      },
      {
        name: "ibm_brisbane",
        status: "available",
        qubits: 127,
        queueLength: 0,
        averageWaitTime: 15,
        uptime: "99.5%",
      },
      {
        name: "ibm_sherbrooke",
        status: "busy",
        qubits: 133,
        queueLength: 6,
        averageWaitTime: 180,
        uptime: "99.1%",
      },
      {
        name: "ibm_nazca",
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
        id,
        name: backend.name,
        status: backend.status,
        qubits: backend.qubits,
        queueLength: backend.queueLength ?? 0,
        averageWaitTime: backend.averageWaitTime ?? 0,
        uptime: backend.uptime ?? "0%",
        lastUpdate: new Date(),
      });
    });

    // Initialize with some sessions
    const sessionData: InsertSession[] = [
      {
        name: "Quantum Machine Learning Research",
        status: "active",
      },
      {
        name: "Optimization Algorithms",
        status: "active",
      },
      {
        name: "Error Correction Testing",
        status: "active",
      },
      {
        name: "QAOA Implementation",
        status: "inactive",
      },
    ];

    sessionData.forEach((session, index) => {
      const id = `session_${index + 1}`;
      this.sessions.set(id, {
        ...session,
        id,
        createdAt: new Date(Date.now() - (index + 1) * 3600000),
        lastActivity: new Date(Date.now() - (index + 1) * 600000),
        jobCount: Math.floor(Math.random() * 12) + 3,
      });
    });

    // Initialize with realistic sample jobs
    this.initializeSampleJobs();
  }

  private initializeSampleJobs() {
    const backends = ["ibm_cairo", "ibm_osaka", "ibm_kyoto", "ibm_brisbane", "ibm_sherbrooke"];
    const statuses: JobStatus[] = ["done", "running", "queued", "failed", "cancelled"];
    const jobNames = [
      "VQE Optimization",
      "QAOA Circuit Test", 
      "Quantum ML Training",
      "Error Mitigation Study",
      "Bell State Preparation",
      "Quantum Fourier Transform",
      "Grover's Algorithm",
      "Quantum Teleportation",
      "Shor's Algorithm Demo",
      "Random Circuit Sampling",
      "Quantum Supremacy Test",
      "Variational Classifier",
      "Quantum Chemistry Sim",
      "Error Correction Test",
      "NISQ Algorithm Eval"
    ];

    // Create 45 realistic sample jobs with various timestamps
    for (let i = 0; i < 45; i++) {
      const backend = backends[Math.floor(Math.random() * backends.length)];
      const name = jobNames[Math.floor(Math.random() * jobNames.length)];
      
      // Distribute jobs across different time periods for trends
      const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days
      const submissionTime = new Date(Date.now() - hoursAgo * 3600000);
      
      let status: JobStatus;
      let startTime: Date | null = null;
      let endTime: Date | null = null;
      let duration: number | null = null;
      let queuePosition: number | null = null;
      let error: string | null = null;

      // Determine status based on age (newer jobs more likely to be running/queued)
      if (hoursAgo < 2) {
        // Recent jobs: running or queued
        status = Math.random() < 0.6 ? "running" : "queued";
      } else if (hoursAgo < 12) {
        // Recent jobs: mostly done, some running
        const rand = Math.random();
        if (rand < 0.7) status = "done";
        else if (rand < 0.85) status = "running";
        else if (rand < 0.95) status = "failed";
        else status = "cancelled";
      } else {
        // Older jobs: mostly completed
        const rand = Math.random();
        if (rand < 0.8) status = "done";
        else if (rand < 0.9) status = "failed";
        else status = "cancelled";
      }

      // Set timing based on status
      if (status === "queued") {
        queuePosition = Math.floor(Math.random() * 15) + 1;
      } else if (status === "running") {
        startTime = new Date(submissionTime.getTime() + Math.random() * 3600000);
      } else if (status === "done" || status === "failed") {
        startTime = new Date(submissionTime.getTime() + Math.random() * 1800000);
        endTime = new Date(startTime.getTime() + Math.random() * 1800000 + 30000);
        duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      }

      if (status === "failed") {
        error = "Quantum circuit execution timeout";
      }

      const job: Job = {
        id: `job_${(Date.now() + i).toString(36)}`,
        name,
        backend,
        status,
        queuePosition,
        submissionTime,
        startTime,
        endTime,
        duration,
        qubits: Math.floor(Math.random() * 100) + 5,
        shots: Math.pow(2, Math.floor(Math.random() * 10) + 10), // 1024 to 1M shots
        program: `// ${name}\nqc = QuantumCircuit(${Math.floor(Math.random() * 20) + 2})\n// Implementation details...`,
        results: status === "done" ? { counts: { "00": 512, "11": 512 } } : null,
        error,
        tags: Math.random() < 0.7 ? [
          ["research", "optimization", "ml", "demo"][Math.floor(Math.random() * 4)]
        ] : null,
        sessionId: `session_${Math.floor(Math.random() * 3) + 1}`,
      };

      this.jobs.set(job.id, job);
    }
  }

  private simulateJobStatusChanges() {
    const queuedJobs = Array.from(this.jobs.values()).filter(job => job.status === "queued");
    const runningJobs = Array.from(this.jobs.values()).filter(job => job.status === "running");

    // Move some queued jobs to running (simulate job starts)
    if (queuedJobs.length > 0 && Math.random() < 0.4) {
      const job = queuedJobs[Math.floor(Math.random() * queuedJobs.length)];
      job.status = "running";
      job.startTime = new Date();
      job.queuePosition = null;
      this.jobs.set(job.id, job);
    }

    // Complete some running jobs (simulate job completion)
    if (runningJobs.length > 0 && Math.random() < 0.3) {
      const job = runningJobs[Math.floor(Math.random() * runningJobs.length)];
      job.endTime = new Date();
      if (job.startTime) {
        job.duration = Math.floor((job.endTime.getTime() - new Date(job.startTime).getTime()) / 1000);
      }
      // 85% success rate
      job.status = Math.random() < 0.85 ? "done" : "failed";
      if (job.status === "failed") {
        job.error = "Quantum circuit execution error";
      } else {
        job.results = { counts: { "00": 512, "01": 256, "10": 128, "11": 128 } };
      }
      this.jobs.set(job.id, job);
    }

    // Occasionally add new jobs to keep things interesting
    if (Math.random() < 0.2) {
      this.addRandomJob();
    }

    // Update backend queue lengths based on current queued jobs
    this.updateBackendQueues();
  }

  private addRandomJob() {
    const backends = ["ibm_cairo", "ibm_osaka", "ibm_kyoto", "ibm_brisbane", "ibm_sherbrooke"];
    const jobNames = [
      "Real-time VQE Run",
      "Live QAOA Test", 
      "Dynamic ML Training",
      "Fresh Error Study",
      "New Bell State Prep",
      "Live Circuit Test",
      "Runtime Algorithm",
      "Active Quantum Task"
    ];

    const backend = backends[Math.floor(Math.random() * backends.length)];
    const name = jobNames[Math.floor(Math.random() * jobNames.length)];

    const job: Job = {
      id: `job_${Date.now().toString(36)}`,
      name,
      backend,
      status: "queued",
      queuePosition: Array.from(this.jobs.values()).filter(j => j.backend === backend && j.status === "queued").length + 1,
      submissionTime: new Date(),
      startTime: null,
      endTime: null,
      duration: null,
      qubits: Math.floor(Math.random() * 50) + 10,
      shots: Math.pow(2, Math.floor(Math.random() * 6) + 10),
      program: `// ${name}\nqc = QuantumCircuit(${Math.floor(Math.random() * 10) + 2})\n// Live execution...`,
      results: null,
      error: null,
      tags: [["live", "real-time", "active"][Math.floor(Math.random() * 3)]],
      sessionId: `session_${Math.floor(Math.random() * 3) + 1}`,
    };

    this.jobs.set(job.id, job);
  }

  private updateBackendQueues() {
    this.backends.forEach(backend => {
      const queuedJobs = Array.from(this.jobs.values()).filter(job => 
        job.backend === backend.name && job.status === "queued"
      );
      backend.queueLength = queuedJobs.length;
      backend.lastUpdate = new Date();
      this.backends.set(backend.id, backend);
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
      id,
      name: insertJob.name ?? null,
      backend: insertJob.backend,
      status: insertJob.status,
      queuePosition: insertJob.status === 'queued' ? await this.getNextQueuePosition(insertJob.backend) : null,
      submissionTime: new Date(),
      startTime: null,
      endTime: null,
      duration: null,
      qubits: insertJob.qubits,
      shots: insertJob.shots,
      program: insertJob.program,
      results: null,
      error: null,
      tags: insertJob.tags ?? null,
      sessionId: insertJob.sessionId ?? null,
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
      id,
      name: insertBackend.name,
      status: insertBackend.status,
      qubits: insertBackend.qubits,
      queueLength: insertBackend.queueLength ?? 0,
      averageWaitTime: insertBackend.averageWaitTime ?? 0,
      uptime: insertBackend.uptime ?? "0%",
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
