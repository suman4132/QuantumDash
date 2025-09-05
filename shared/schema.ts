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

export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull(), // active, paused, completed, archived
  privacy: text("privacy").notNull(), // public, private
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  lastActivity: timestamp("last_activity").default(sql`now()`),
  progress: integer("progress").default(0), // percentage 0-100
  settings: jsonb("settings"),
});

export const workspaceMembers = pgTable("workspace_members", {
  id: varchar("id").primaryKey(),
  workspaceId: varchar("workspace_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email"),
  role: text("role").notNull(), // owner, admin, member, viewer
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
  permissions: jsonb("permissions"),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  workspaceId: varchar("workspace_id").notNull(),
  ownerId: varchar("owner_id").notNull(),
  status: text("status").notNull(), // draft, running, completed, failed, paused
  backend: text("backend"),
  circuitCode: text("circuit_code"),
  configuration: jsonb("configuration"),
  results: jsonb("results"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
  lastModified: timestamp("last_modified").default(sql`now()`),
  runtime: integer("runtime"), // in minutes
  isPublic: boolean("is_public").default(false),
  tags: jsonb("tags").$type<string[]>(),
});

export const projectCollaborators = pgTable("project_collaborators", {
  id: varchar("id").primaryKey(),
  projectId: varchar("project_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: text("user_name").notNull(),
  role: text("role").notNull(), // owner, editor, viewer
  addedAt: timestamp("added_at").notNull().default(sql`now()`),
  permissions: jsonb("permissions"),
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

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActivity: true,
}).extend({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  privacy: z.enum(["public", "private"]).default("private"),
  progress: z.number().min(0).max(100).default(0),
});

export const insertWorkspaceMemberSchema = createInsertSchema(workspaceMembers).omit({
  id: true,
  joinedAt: true,
}).extend({
  role: z.enum(["owner", "admin", "member", "viewer"]).default("member"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastModified: true,
}).extend({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  status: z.enum(["draft", "running", "completed", "failed", "paused"]).default("draft"),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export const insertProjectCollaboratorSchema = createInsertSchema(projectCollaborators).omit({
  id: true,
  addedAt: true,
}).extend({
  role: z.enum(["owner", "editor", "viewer"]).default("editor"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Backend = typeof backends.$inferSelect;
export type InsertBackend = z.infer<typeof insertBackendSchema>;
export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = z.infer<typeof insertWorkspaceMemberSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectCollaborator = typeof projectCollaborators.$inferSelect;
export type InsertProjectCollaborator = z.infer<typeof insertProjectCollaboratorSchema>;

export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";
export type SessionStatus = "active" | "inactive" | "expired";
export type BackendStatus = "available" | "busy" | "maintenance" | "offline";
export type WorkspaceStatus = "active" | "paused" | "completed" | "archived";
export type WorkspacePrivacy = "public" | "private";
export type WorkspaceMemberRole = "owner" | "admin" | "member" | "viewer";
export type ProjectStatus = "draft" | "running" | "completed" | "failed" | "paused";
export type ProjectCollaboratorRole = "owner" | "editor" | "viewer";
