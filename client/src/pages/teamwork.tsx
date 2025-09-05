import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  Share2, 
  Globe, 
  Lock, 
  Calendar, 
  Clock, 
  GitBranch, 
  Activity,
  Settings,
  UserPlus,
  MessageSquare,
  FileText,
  Code2,
  Zap,
  BarChart3,
  Download,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Eye,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  PlayCircle,
  PauseCircle,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Header } from "@/components/dashboard/header";
import { formatDistanceToNow } from "date-fns";

// Mock data for demonstration
const mockWorkspaces = [
  {
    id: "ws-1",
    name: "Quantum ML Research",
    description: "Exploring quantum machine learning algorithms with variational circuits",
    members: ["Alice Chen", "Bob Wilson", "Dr. Sarah Kim"],
    status: "active",
    privacy: "private",
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    progress: 75,
    circuits: 12,
    jobs: 45
  },
  {
    id: "ws-2", 
    name: "Optimization Algorithms",
    description: "Developing QAOA solutions for combinatorial optimization problems",
    members: ["John Doe", "Emma Davis", "Mike Thompson", "Lisa Zhang"],
    status: "active",
    privacy: "public",
    lastActivity: new Date(Date.now() - 5 * 60 * 1000),
    progress: 60,
    circuits: 8,
    jobs: 28
  },
  {
    id: "ws-3",
    name: "Quantum Cryptography",
    description: "Building quantum key distribution protocols and security analysis",
    members: ["Dr. Alex Moore", "Rachel Green"],
    status: "paused",
    privacy: "private",
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    progress: 40,
    circuits: 6,
    jobs: 15
  }
];

const mockProjects = [
  {
    id: "proj-1",
    name: "VQE Ground State Calculation",
    workspace: "Quantum ML Research",
    owner: "Alice Chen",
    collaborators: 3,
    status: "running",
    lastModified: new Date(Date.now() - 30 * 60 * 1000),
    runtime: "2h 15m",
    backend: "ibm_cairo"
  },
  {
    id: "proj-2",
    name: "QAOA Max-Cut Implementation",
    workspace: "Optimization Algorithms", 
    owner: "John Doe",
    collaborators: 2,
    status: "completed",
    lastModified: new Date(Date.now() - 60 * 60 * 1000),
    runtime: "45m",
    backend: "ibm_brisbane"
  },
  {
    id: "proj-3",
    name: "Quantum Teleportation Protocol",
    workspace: "Quantum Cryptography",
    owner: "Dr. Alex Moore",
    collaborators: 1,
    status: "draft",
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
    runtime: "-",
    backend: "simulator"
  }
];

export default function Teamwork() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  // Filter workspaces based on search and filters
  const filteredWorkspaces = mockWorkspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workspace.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || workspace.status === statusFilter;
    const matchesPrivacy = privacyFilter === "all" || workspace.privacy === privacyFilter;
    
    return matchesSearch && matchesStatus && matchesPrivacy;
  });

  // Filter projects for selected workspace
  const workspaceProjects = selectedWorkspace 
    ? mockProjects.filter(p => p.workspace === mockWorkspaces.find(w => w.id === selectedWorkspace)?.name)
    : mockProjects;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefreshIntervalChange = (interval: number) => {
    // Handle refresh interval
  };

  const handleManualRefresh = () => {
    // Handle manual refresh
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "running": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    return privacy === "private" ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header 
        onSearch={handleSearch}
        onRefreshIntervalChange={handleRefreshIntervalChange}
        onManualRefresh={handleManualRefresh}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                Team Collaboration
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Work together on quantum computing projects with real-time collaboration
              </p>
            </div>
            <Dialog open={isCreateWorkspaceOpen} onOpenChange={setIsCreateWorkspaceOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" data-testid="button-create-workspace">
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Workspace</DialogTitle>
                  <DialogDescription>
                    Set up a collaborative workspace for your quantum computing project.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input 
                      id="workspace-name" 
                      placeholder="Enter workspace name..."
                      data-testid="input-workspace-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workspace-desc">Description</Label>
                    <Textarea 
                      id="workspace-desc" 
                      placeholder="Describe your project goals and scope..."
                      data-testid="textarea-workspace-description"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="workspace-private">Private Workspace</Label>
                    <Switch id="workspace-private" data-testid="switch-workspace-private" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateWorkspaceOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateWorkspaceOpen(false)} data-testid="button-create-workspace-confirm">
                    Create Workspace
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search workspaces and projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-workspaces"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                <SelectTrigger className="w-32" data-testid="select-privacy-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Privacy</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="workspaces" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="workspaces" data-testid="tab-workspaces">Workspaces</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">Shared Projects</TabsTrigger>
          </TabsList>

          {/* Workspaces Tab */}
          <TabsContent value="workspaces" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredWorkspaces.map((workspace, index) => (
                <motion.div
                  key={workspace.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setSelectedWorkspace(workspace.id)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{workspace.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            {getPrivacyIcon(workspace.privacy)}
                            <Badge 
                              variant="secondary" 
                              className={`${getStatusColor(workspace.status)} text-xs px-2 py-1`}
                            >
                              {workspace.status}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Workspace
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Invite Members
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {workspace.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium">{workspace.progress}%</span>
                        </div>
                        <Progress value={workspace.progress} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-blue-600">{workspace.circuits}</div>
                          <div className="text-xs text-gray-500">Circuits</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-green-600">{workspace.jobs}</div>
                          <div className="text-xs text-gray-500">Jobs</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-purple-600">{workspace.members.length}</div>
                          <div className="text-xs text-gray-500">Members</div>
                        </div>
                      </div>

                      {/* Members */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Members</div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {workspace.members.slice(0, 3).map((member, idx) => (
                              <Avatar key={idx} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                <AvatarFallback className="text-xs">
                                  {member.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {workspace.members.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                <span className="text-xs font-medium">+{workspace.members.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <UserPlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Last Activity */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>Last active {formatDistanceToNow(workspace.lastActivity)} ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredWorkspaces.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workspaces found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery || statusFilter !== "all" || privacyFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Create your first collaborative workspace to get started"}
                </p>
                {(!searchQuery && statusFilter === "all" && privacyFilter === "all") && (
                  <Button onClick={() => setIsCreateWorkspaceOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workspace
                  </Button>
                )}
              </motion.div>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-blue-500" />
                    Shared Quantum Projects
                  </CardTitle>
                  <CardDescription>
                    Real-time collaborative quantum computing projects across all workspaces
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr className="text-left">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Workspace</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Runtime</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Backend</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Collaborators</th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {workspaceProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{project.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Modified {formatDistanceToNow(project.lastModified)} ago
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {project.workspace}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {project.status === "running" && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                {project.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {project.status === "draft" && <Edit3 className="h-4 w-4 text-gray-400" />}
                                <Badge className={getStatusColor(project.status)}>
                                  {project.status}
                                </Badge>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {project.runtime}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline" className="text-xs">
                                {project.backend}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  {Array.from({ length: Math.min(project.collaborators, 3) }, (_, i) => (
                                    <Avatar key={i} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                      <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">+{project.collaborators}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Copy className="h-4 w-4 mr-2" />
                                      Duplicate
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Export
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Open in Editor
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}