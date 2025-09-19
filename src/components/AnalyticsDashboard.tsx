import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Clock, Target, Activity, ArrowUpRight, ArrowDownRight, Download, RefreshCw, Zap } from "lucide-react";

const AnalyticsDashboard = () => {
  // Mock data for charts
  const executionTrends = [
    { date: '2024-01-01', tests: 45, passed: 38, failed: 7, cost: 0.85 },
    { date: '2024-01-02', tests: 52, passed: 47, failed: 5, cost: 0.92 },
    { date: '2024-01-03', tests: 38, passed: 35, failed: 3, cost: 0.76 },
    { date: '2024-01-04', tests: 61, passed: 54, failed: 7, cost: 1.12 },
    { date: '2024-01-05', tests: 47, passed: 44, failed: 3, cost: 0.89 },
    { date: '2024-01-06', tests: 55, passed: 51, failed: 4, cost: 0.98 },
    { date: '2024-01-07', tests: 49, passed: 46, failed: 3, cost: 0.87 }
  ];

  const successRateByType = [
    { type: 'Patient Read', positive: 95, negative: 88, edge: 72 },
    { type: 'Patient Search', positive: 92, negative: 85, edge: 68 },
    { type: 'Bundle Validation', positive: 89, negative: 82, edge: 65 },
    { type: 'Cardinality Check', positive: 94, negative: 87, edge: 71 },
    { type: 'ValueSet Binding', positive: 91, negative: 84, edge: 69 }
  ];

  const performanceMetrics = [
    { agent: 'Planner', avgLatency: 1200, p95Latency: 2100, throughput: 45 },
    { agent: 'Data', avgLatency: 2800, p95Latency: 4200, throughput: 32 },
    { agent: 'Analyst', avgLatency: 4500, p95Latency: 7800, throughput: 28 },
    { agent: 'Reporter', avgLatency: 3200, p95Latency: 5100, throughput: 35 }
  ];

  const costBreakdown = [
    { name: 'Gemini 2.0 Flash', value: 0.45, color: '#8884d8' },
    { name: 'Cloud Run', value: 0.25, color: '#82ca9d' },
    { name: 'BigQuery', value: 0.15, color: '#ffc658' },
    { name: 'Storage', value: 0.10, color: '#ff7300' },
    { name: 'Other', value: 0.05, color: '#00ff88' }
  ];

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatLatency = (value: number) => `${value}ms`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor performance, costs, and test execution trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            <Activity className="w-3 h-3 mr-1" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-success/5 to-success/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Target className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
                </div>
                <p className="text-3xl font-bold">89.2%</p>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowUpRight className="w-3 h-3 text-success" />
                  <span className="text-success font-medium">+2.1%</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Clock className="w-4 h-4 text-warning" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Avg Runtime</span>
                </div>
                <p className="text-3xl font-bold">3.2min</p>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowDownRight className="w-3 h-3 text-success" />
                  <span className="text-success font-medium">-0.3min</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Avg Cost</span>
                </div>
                <p className="text-3xl font-bold">$0.91</p>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowDownRight className="w-3 h-3 text-success" />
                  <span className="text-success font-medium">-$0.05</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Total Runs</span>
                </div>
                <p className="text-3xl font-bold">347</p>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowUpRight className="w-3 h-3 text-success" />
                  <span className="text-success font-medium">+23</span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl bg-muted/30 p-1 rounded-xl border">
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all duration-200 font-medium"
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Execution Trends</span>
                <span className="sm:hidden">Trends</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="success"
              className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all duration-200 font-medium"
            >
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Success Rates</span>
                <span className="sm:hidden">Success</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all duration-200 font-medium"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Performance</span>
                <span className="sm:hidden">Perf</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="costs"
              className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg transition-all duration-200 font-medium"
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Cost Analysis</span>
                <span className="sm:hidden">Costs</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Execution Trends Over Time</CardTitle>
              <CardDescription>Daily test execution volume and success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={executionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value, name) => [value, name === 'cost' ? formatCurrency(value as number) : value]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="passed" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Passed" />
                  <Area type="monotone" dataKey="failed" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Failed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Tracking Per Run</CardTitle>
              <CardDescription>Daily cost analysis with trend line</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={executionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [formatCurrency(value as number), 'Cost']}
                  />
                  <Line type="monotone" dataKey="cost" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Success Rate by Requirement Type</CardTitle>
              <CardDescription>Test case success rates across different FHIR validation types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={successRateByType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  <Bar dataKey="positive" fill="#22c55e" name="Positive Tests" />
                  <Bar dataKey="negative" fill="#f59e0b" name="Negative Tests" />
                  <Bar dataKey="edge" fill="#ef4444" name="Edge Cases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics by Agent</CardTitle>
              <CardDescription>Latency and throughput analysis for each agent</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agent" />
                  <YAxis yAxisId="latency" orientation="left" tickFormatter={formatLatency} />
                  <YAxis yAxisId="throughput" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => [
                      typeof name === 'string' && name.includes('Latency') ? formatLatency(value as number) : value,
                      name
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="latency" dataKey="avgLatency" fill="#8884d8" name="Avg Latency (ms)" />
                  <Bar yAxisId="latency" dataKey="p95Latency" fill="#82ca9d" name="P95 Latency (ms)" />
                  <Line yAxisId="throughput" type="monotone" dataKey="throughput" stroke="#ff7300" name="Throughput" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Average cost distribution per run</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization Insights</CardTitle>
                <CardDescription>Recommendations to reduce costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="font-medium text-sm">Gemini Usage Optimized</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Token usage reduced by 15% through prompt optimization
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="font-medium text-sm">Storage Cleanup Needed</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Old evidence files consuming 12% of storage budget
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium text-sm">Batch Processing</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consider batching small requests to reduce Cloud Run cold starts
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;