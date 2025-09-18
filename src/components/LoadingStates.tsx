import { Loader2, Activity, Database, CheckCircle, FileOutput } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className = "" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
};

interface LoadingCardProps {
  title: string;
  description?: string;
  progress?: number;
  className?: string;
}

export const LoadingCard = ({ title, description, progress, className = "" }: LoadingCardProps) => (
  <Card className={`${className}`}>
    <CardContent className="p-6">
      <div className="flex items-center space-x-3">
        <LoadingSpinner size="md" className="text-primary" />
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface AgentLoadingProps {
  agents: Array<{
    id: string;
    name: string;
    status: "pending" | "running" | "completed";
    progress: number;
  }>;
}

export const AgentLoadingStates = ({ agents }: AgentLoadingProps) => {
  const getIcon = (agentId: string) => {
    switch (agentId) {
      case "planner": return Activity;
      case "data": return Database;
      case "analyst": return CheckCircle;
      case "reporter": return FileOutput;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-success";
      case "running": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      {agents.map((agent) => {
        const Icon = getIcon(agent.id);
        return (
          <Card key={agent.id} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-muted ${agent.status === "running" ? "animate-pulse" : ""}`}>
                  <Icon className={`w-4 h-4 ${getStatusColor(agent.status)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{agent.name}</h4>
                    <Badge 
                      variant={agent.status === "completed" ? "secondary" : "outline"}
                      className={agent.status === "running" ? "animate-pulse" : ""}
                    >
                      {agent.status === "running" ? "Processing..." : agent.status}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{agent.progress}%</span>
                    </div>
                    <Progress value={agent.progress} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
            {agent.status === "running" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
                <div className="h-full bg-primary animate-pulse" style={{ width: `${agent.progress}%` }} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

export const TableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-3">
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-8 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

interface RetryableErrorProps {
  error: string;
  onRetry: () => void;
  retryCount?: number;
  maxRetries?: number;
}

export const RetryableError = ({ 
  error, 
  onRetry, 
  retryCount = 0, 
  maxRetries = 3 
}: RetryableErrorProps) => (
  <Card className="border-destructive/20 bg-destructive/5">
    <CardContent className="p-4">
      <div className="flex items-start space-x-3">
        <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">Error occurred</p>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          {retryCount < maxRetries && (
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={onRetry}
                className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded hover:bg-destructive/90"
              >
                Retry ({maxRetries - retryCount} attempts left)
              </button>
              <span className="text-xs text-muted-foreground">
                Attempt {retryCount + 1} of {maxRetries}
              </span>
            </div>
          )}
          {retryCount >= maxRetries && (
            <p className="text-xs text-destructive mt-2">
              Maximum retry attempts reached. Please check your configuration.
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ProgressiveLoader = ({ 
  steps, 
  currentStep 
}: { 
  steps: string[]; 
  currentStep: number; 
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" className="text-primary" />
          <span className="text-sm font-medium">Processing...</span>
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                index < currentStep ? "bg-success" :
                index === currentStep ? "bg-primary animate-pulse" :
                "bg-muted"
              }`} />
              <span className={`text-xs ${
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      </div>
    </CardContent>
  </Card>
);