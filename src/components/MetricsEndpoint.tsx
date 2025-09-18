// Hidden metrics endpoint component for observability
// In a real app, this would be a proper API endpoint

interface MetricsData {
  agents: {
    [key: string]: {
      latency_p50: number;
      latency_p95: number;
      pass_count: number;
      fail_count: number;
      evidence_completeness: number;
      last_heartbeat: string;
    };
  };
  system: {
    total_runs: number;
    uptime_minutes: number;
    error_rate: number;
  };
}

export const getMetrics = (): MetricsData => {
  // Mock metrics data that would normally come from BigQuery/Firestore
  return {
    agents: {
      planner: {
        latency_p50: 1200,
        latency_p95: 2100,
        pass_count: 47,
        fail_count: 1,
        evidence_completeness: 100,
        last_heartbeat: new Date().toISOString()
      },
      data: {
        latency_p50: 2800,
        latency_p95: 4200,
        pass_count: 43,
        fail_count: 3,
        evidence_completeness: 98,
        last_heartbeat: new Date(Date.now() - 5000).toISOString()
      },
      analyst: {
        latency_p50: 4500,
        latency_p95: 7800,
        pass_count: 38,
        fail_count: 6,
        evidence_completeness: 92,
        last_heartbeat: new Date(Date.now() - 120000).toISOString()
      },
      reporter: {
        latency_p50: 3200,
        latency_p95: 5100,
        pass_count: 41,
        fail_count: 1,
        evidence_completeness: 96,
        last_heartbeat: new Date(Date.now() - 600000).toISOString()
      }
    },
    system: {
      total_runs: 152,
      uptime_minutes: 1440,
      error_rate: 0.08
    }
  };
};

// Component to display metrics in dev mode (hidden in production)
const MetricsEndpoint = () => {
  const metrics = getMetrics();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-muted rounded-lg text-xs font-mono max-w-md">
      <div className="font-bold mb-2">/metrics (dev only)</div>
      <pre className="text-xs overflow-auto max-h-48">
        {JSON.stringify(metrics, null, 2)}
      </pre>
    </div>
  );
};

export default MetricsEndpoint;