import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Database, CheckCircle, FileOutput, Clock, ArrowRight, FileText, AlertTriangle } from "lucide-react";
import AgentHealthPanel from "./AgentHealthPanel";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "idle";
  icon: React.ComponentType<any>;
  progress: number;
}

const AgentPipeline = () => {
  const agents: Agent[] = [
    {
      id: "planner",
      name: "Planner",
      description: "Parse Doc, read Sheet thresholds, publish minimal task list",
      status: "completed",
      icon: Brain,
      progress: 100
    },
    {
      id: "data",
      name: "Data",
      description: "Pull FHIR Patient profile/examples, normalize JSONL",
      status: "running",
      icon: Database,
      progress: 65
    },
    {
      id: "analyst",
      name: "Analyst-Validator",
      description: "Generate positive/negative/edge tests with Gemini 2.0 Flash",
      status: "pending",
      icon: CheckCircle,
      progress: 0
    },
    {
      id: "reporter",
      name: "Reporter",
      description: "Create Sheet/Doc/Slides; emit JUnit/JSON; send Gmail summary",
      status: "idle",
      icon: FileOutput,
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "running": return "warning";
      case "pending": return "secondary";
      default: return "muted";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "running": return "In Progress";
      case "pending": return "Pending";
      default: return "Idle";
    }
  };

  const pendingCount = agents.filter(a => a.status === "pending").length;
  const errorAgents = agents.filter(a => a.status === "running" && Math.random() > 0.8); // Mock error condition
  const showPendingAlert = pendingCount > 0; // In real app: check if pending > 2 minutes
  const showErrorAlert = errorAgents.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Agent Pipeline</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Est. 3 min remaining</span>
        </div>
      </div>

      {/* Guardrail Alerts */}
      {showPendingAlert && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Tasks have been pending for over 2 minutes. Consider re-pulling data.
            <Button variant="link" className="p-0 ml-2 h-auto">
              Trigger fix task
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {showErrorAlert && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Agent errors detected. 
            <Button variant="link" className="p-0 ml-2 h-auto text-destructive">
              View evidence
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Agent Health Panel */}
      <AgentHealthPanel />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className="relative">
              <Card className={`transition-all duration-200 ${
                agent.status === "running" ? "ring-2 ring-primary/20 shadow-lg" : ""
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        agent.status === "completed" ? "bg-success/10" :
                        agent.status === "running" ? "bg-warning/10" :
                        "bg-muted"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          agent.status === "completed" ? "text-success" :
                          agent.status === "running" ? "text-warning" :
                          "text-muted-foreground"
                        }`} />
                      </div>
                      <Badge variant={getStatusColor(agent.status) as any} className="text-xs">
                        {getStatusText(agent.status)}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <FileText className="w-3 h-3" />
                    </Button>
                  </div>
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {agent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{agent.progress}%</span>
                    </div>
                    <Progress value={agent.progress} className="h-2" />
                    {agent.status === "running" && (
                      <div className="w-full bg-primary/20 rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{width: `${agent.progress}%`}} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {index < agents.length - 1 && (
                <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 hidden lg:block">
                  <div className="w-4 h-4 bg-background border-2 border-muted rounded-full flex items-center justify-center">
                    <ArrowRight className="w-2 h-2 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPipeline;