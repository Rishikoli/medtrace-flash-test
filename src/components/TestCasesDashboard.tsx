import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle, AlertTriangle, Download, ExternalLink, FileText, RotateCcw, Copy } from "lucide-react";
import { useState } from "react";

interface TestCase {
  id: string;
  requirementId: string;
  fhirPath: string;
  caseType: "positive" | "negative" | "edge";
  status: "pass" | "fail" | "pending";
  request: string;
  expected: string;
  evidenceUri: string;
  confidence: number;
}

const TestCasesDashboard = () => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [passRateHistory] = useState([85, 87, 89, 91, 88, 92, 94, 91, 89, 95]); // Mock sparkline data
  
  const testCases: TestCase[] = [
    {
      id: "TC001",
      requirementId: "REQ001",
      fhirPath: "Patient.read",
      caseType: "positive",
      status: "pass",
      request: "GET /Patient/example-patient",
      expected: "200 OK with valid Patient resource",
      evidenceUri: "gs://medtrace-evidence/tc001-evidence.json",
      confidence: 95
    },
    {
      id: "TC002",
      requirementId: "REQ001",
      fhirPath: "Patient.read",
      caseType: "negative",
      status: "pass",
      request: "GET /Patient/nonexistent-patient",
      expected: "404 Not Found",
      evidenceUri: "gs://medtrace-evidence/tc002-evidence.json",
      confidence: 98
    },
    {
      id: "TC003",
      requirementId: "REQ002",
      fhirPath: "Patient.search",
      caseType: "positive",
      status: "pending",
      request: "GET /Patient?identifier=12345",
      expected: "200 OK with Bundle containing matching Patient",
      evidenceUri: "gs://medtrace-evidence/tc003-evidence.json",
      confidence: 87
    },
    {
      id: "TC004",
      requirementId: "REQ003",
      fhirPath: "Patient.name",
      caseType: "edge",
      status: "fail",
      request: "Validate Patient resource with missing name",
      expected: "Validation error for required field",
      evidenceUri: "gs://medtrace-evidence/tc004-evidence.json",
      confidence: 92
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle className="w-4 h-4 text-success" />;
      case "fail": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass": return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Pass</Badge>;
      case "fail": return <Badge variant="destructive">Fail</Badge>;
      default: return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  const getCaseTypeBadge = (type: string) => {
    switch (type) {
      case "positive": return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Positive</Badge>;
      case "negative": return <Badge variant="secondary" className="bg-muted text-muted-foreground">Negative</Badge>;
      default: return <Badge variant="outline">Edge</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    const color = confidence >= 90 ? "success" : confidence >= 80 ? "warning" : "destructive";
    return <Badge variant="secondary" className={`text-xs ${
      color === "success" ? "bg-success/10 text-success border-success/20" :
      color === "warning" ? "bg-warning/10 text-warning border-warning/20" :
      "bg-destructive/10 text-destructive border-destructive/20"
    }`}>
      {confidence}%
    </Badge>;
  };

  const handleRerunSelected = () => {
    console.log("Re-running tests:", selectedTests);
    // Mock re-run logic
  };

  const copyFirstPositiveCurl = () => {
    const firstPositive = testCases.find(tc => tc.caseType === "positive");
    if (firstPositive) {
      const curl = `curl -X GET "https://fhir-server.example.com/${firstPositive.request.replace('GET /', '')}" -H "Accept: application/fhir+json"`;
      navigator.clipboard.writeText(curl);
    }
  };

  const exportJsonl = () => {
    const jsonl = testCases.map(tc => JSON.stringify({
      test_id: tc.id,
      requirement_id: tc.requirementId,
      fhir_path: tc.fhirPath,
      case_type: tc.caseType,
      request: tc.request,
      expected: tc.expected,
      confidence: tc.confidence
    })).join('\n');
    
    const blob = new Blob([jsonl], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medtrace-tests.jsonl';
    a.click();
  };

  // Mini sparkline component
  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 15;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
        />
      </svg>
    );
  };

  const passCount = testCases.filter(tc => tc.status === "pass").length;
  const failCount = testCases.filter(tc => tc.status === "fail").length;
  const pendingCount = testCases.filter(tc => tc.status === "pending").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Generated Test Cases</h2>
          <p className="text-muted-foreground">FHIR compliance test cases with automated validation and evidence tracking</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportJsonl}>
            <Download className="w-4 h-4 mr-2" />
            Export JSONL
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export JUnit
          </Button>
          <Button variant="outline" size="sm" onClick={copyFirstPositiveCurl}>
            <Copy className="w-4 h-4 mr-2" />
            Copy cURL
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            View Evidence Doc
          </Button>
          {selectedTests.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleRerunSelected}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Re-run ({selectedTests.length})
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-primary/20 rounded-full">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Total Tests</span>
                </div>
                <p className="text-3xl font-bold">{testCases.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-success/5 to-success/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-success/20 rounded-full">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Passed</span>
                </div>
                <p className="text-3xl font-bold text-success">{passCount}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-destructive/5 to-destructive/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-destructive/20 rounded-full">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Failed</span>
                </div>
                <p className="text-3xl font-bold text-destructive">{failCount}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-warning/5 to-warning/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-warning/20 rounded-full">
                    <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Pending</span>
                </div>
                <p className="text-3xl font-bold text-warning">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-secondary/20 rounded-full">
                    <div className="w-2 h-2 bg-secondary-foreground rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Pass Rate</span>
                </div>
                <p className="text-3xl font-bold">{Math.round((passCount / testCases.length) * 100)}%</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <div className="text-secondary-foreground">
                  <Sparkline data={passRateHistory} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold">Test Cases</CardTitle>
              <CardDescription className="text-muted-foreground">
                FHIR compliance test cases generated from requirements with automated validation
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {testCases.length} Total
              </Badge>
              <Badge variant="outline" className="bg-success/5 text-success border-success/20">
                {Math.round((passCount / testCases.length) * 100)}% Pass Rate
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedTests.length === testCases.length}
                    onCheckedChange={(checked) => {
                      setSelectedTests(checked ? testCases.map(tc => tc.id) : []);
                    }}
                  />
                </TableHead>
                <TableHead>Test ID</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>FHIR Path</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testCases.map((testCase) => (
                <TableRow key={testCase.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedTests.includes(testCase.id)}
                      onCheckedChange={(checked) => {
                        setSelectedTests(prev => 
                          checked 
                            ? [...prev, testCase.id]
                            : prev.filter(id => id !== testCase.id)
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{testCase.id}</TableCell>
                  <TableCell className="font-mono text-sm">{testCase.requirementId}</TableCell>
                  <TableCell className="font-mono text-sm">{testCase.fhirPath}</TableCell>
                  <TableCell>{getCaseTypeBadge(testCase.caseType)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testCase.status)}
                      {getStatusBadge(testCase.status)}
                    </div>
                  </TableCell>
                  <TableCell>{getConfidenceBadge(testCase.confidence)}</TableCell>
                  <TableCell className="font-mono text-xs max-w-xs truncate">
                    {testCase.request}
                  </TableCell>
                  <TableCell className="text-xs max-w-xs truncate">
                    {testCase.expected}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => console.log(`Re-running ${testCase.id}`)}
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestCasesDashboard;