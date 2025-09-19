import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Clock, AlertCircle, TrendingUp, List, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

interface AgentHealth {
  id: string;
  name: string;
  status: "idle" | "in_progress" | "completed" | "error";
  lastHeartbeat: Date;
  lastError?: string;
  avgLatency: number;
  successRate: number;
  queueDepth: number;
  recentRuns: Array<{
    id: string;
    timestamp: Date;
    status: "success" | "failure";
    latency: number;
    evidenceUri: string;
  }>;
}

const AgentHealthPanel = () => {
  const [healthData, setHealthData] = useState<AgentHealth[]>([
    {
      id: "planner",
      name: "Planner",
      status: "completed",
      lastHeartbeat: new Date(Date.now() - 30000),
      avgLatency: 1200,
      successRate: 100,
      queueDepth: 0,
      recentRuns: Array.from({ length: 10 }, (_, i) => ({
        id: `run-${i + 1}`,
        timestamp: new Date(Date.now() - (i + 1) * 300000),
        status: Math.random() > 0.1 ? "success" : "failure" as "success" | "failure",
        latency: 800 + Math.random() * 800,
        evidenceUri: `gs://medtrace-evidence/planner/run-${i + 1}.json`
      }))
    },
    {
      id: "data",
      name: "Data",
      status: "in_progress",
      lastHeartbeat: new Date(Date.now() - 5000),
      avgLatency: 2800,
      successRate: 95,
      queueDepth: 3,
      recentRuns: Array.from({ length: 10 }, (_, i) => ({
        id: `run-${i + 1}`,
        timestamp: new Date(Date.now() - (i + 1) * 300000),
        status: Math.random() > 0.05 ? "success" : "failure" as "success" | "failure",
        latency: 2000 + Math.random() * 1600,
        evidenceUri: `gs://medtrace-evidence/data/run-${i + 1}.json`
      }))
    },
    {
      id: "analyst",
      name: "Analyst-Validator",
      status: "error",
      lastHeartbeat: new Date(Date.now() - 120000),
      lastError: "Gemini 2.0 Flash rate limit exceeded",
      avgLatency: 4500,
      successRate: 87,
      queueDepth: 8,
      recentRuns: Array.from({ length: 10 }, (_, i) => ({
        id: `run-${i + 1}`,
        timestamp: new Date(Date.now() - (i + 1) * 300000),
        status: Math.random() > 0.13 ? "success" : "failure" as "success" | "failure",
        latency: 3500 + Math.random() * 2000,
        evidenceUri: `gs://medtrace-evidence/analyst/run-${i + 1}.json`
      }))
    },
    {
      id: "reporter",
      name: "Reporter",
      status: "idle",
      lastHeartbeat: new Date(Date.now() - 600000),
      avgLatency: 3200,
      successRate: 98,
      queueDepth: 0,
      recentRuns: Array.from({ length: 10 }, (_, i) => ({
        id: `run-${i + 1}`,
        timestamp: new Date(Date.now() - (i + 1) * 300000),
        status: Math.random() > 0.02 ? "success" : "failure" as "success" | "failure",
        latency: 2800 + Math.random() * 800,
        evidenceUri: `gs://medtrace-evidence/reporter/run-${i + 1}.json`
      }))
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthData(prev => prev.map(agent => ({
        ...agent,
        lastHeartbeat: agent.status === "in_progress" ? new Date() : agent.lastHeartbeat,
        queueDepth: agent.status === "in_progress" ? Math.max(0, agent.queueDepth + Math.floor(Math.random() * 3) - 1) : agent.queueDepth
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (agent: AgentHealth) => {
    const now = Date.now();
    const heartbeatAge = now - agent.lastHeartbeat.getTime();
    
    if (agent.status === "error" || heartbeatAge > 300000) return "destructive";
    if (agent.queueDepth > 5 || agent.avgLatency > 5000 || agent.successRate < 90) return "warning";
    return "success";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      idle: "secondary",
      in_progress: "warning",
      completed: "success",
      error: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants] as any}>
      {status.replace("_", " ").toUpperCase()}
    </Badge>;
  };

  const formatLatency = (ms: number) => `${ms.toFixed(0)}ms`;
  const formatTime = (date: Date) => new Date(date).toLocaleTimeString();

  return (
    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Agent Health Monitor</h3>
              <p className="text-sm text-muted-foreground">Real-time system status and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <div className="text-xs text-muted-foreground">
              Updated: {formatTime(new Date())}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthData.map((agent) => {
            const healthColor = getHealthColor(agent);
            
            return (
              <div key={agent.id} className={`p-3 rounded-lg border ${
                healthColor === "destructive" ? "border-destructive/20 bg-destructive/5" :
                healthColor === "warning" ? "border-warning/20 bg-warning/5" :
                "border-success/20 bg-success/5"
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{agent.name}</span>
                    {getStatusBadge(agent.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>{formatTime(agent.lastHeartbeat)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-muted-foreground" />
                      <span>{formatLatency(agent.avgLatency)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-muted-foreground" />
                      <span>{agent.successRate}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <List className="w-3 h-3 text-muted-foreground" />
                      <span>{agent.queueDepth}</span>
                    </div>
                  </div>

                  {agent.lastError && (
                    <div className="flex items-start space-x-1 p-2 bg-destructive/10 rounded text-xs">
                      <AlertCircle className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-destructive">{agent.lastError}</span>
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>{agent.name} - Recent Runs</DialogTitle>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Run ID</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Latency</TableHead>
                            <TableHead>Evidence</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {agent.recentRuns.map((run) => (
                            <TableRow key={run.id}>
                              <TableCell className="font-mono">{run.id}</TableCell>
                              <TableCell>{run.timestamp.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant={run.status === "success" ? "secondary" : "destructive"}>
                                  {run.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatLatency(run.latency)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentHealthPanel;