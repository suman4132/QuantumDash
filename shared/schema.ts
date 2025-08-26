import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey(),
  name: text("name"),
  backend: text("backend").notNull(),
  status: text("status").notNull(), // queued, running, done, failed, cancelled
  queuePosition: integer("queue_position"),
  submissionTime: timestamp("submission_time").notNull().default(sql`now()`),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  qubits: integer("qubits"),
  shots: integer("shots"),
  program: text("program"),
  results: jsonb("results"),
  error: text("error"),
  tags: jsonb("tags").$type<string[]>(),
  sessionId: varchar("session_id"),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // active, inactive, expired
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  lastActivity: timestamp("last_activity").notNull().default(sql`now()`),
  jobCount: integer("job_count").default(0),
});

export const backends = pgTable("backends", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // available, busy, maintenance, offline
  qubits: integer("qubits").notNull(),
  queueLength: integer("queue_length").default(0),
  averageWaitTime: integer("average_wait_time"), // in seconds
  uptime: text("uptime"),
  lastUpdate: timestamp("last_update").default(sql`now()`),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  submissionTime: true,
  startTime: true,
  endTime: true,
  duration: true,
  results: true,
}).extend({
  name: z.string().optional(),
  qubits: z.number().min(1).max(1000),
  shots: z.number().min(1).max(100000),
  program: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
  jobCount: true,
});

export const insertBackendSchema = createInsertSchema(backends).omit({
  id: true,
  lastUpdate: true,
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Backend = typeof backends.$inferSelect;
export type InsertBackend = z.infer<typeof insertBackendSchema>;

export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";
export type SessionStatus = "active" | "inactive" | "expired";
export type BackendStatus = "available" | "busy" | "maintenance" | "offline";
