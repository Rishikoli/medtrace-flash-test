import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, AlertTriangle, Download, ExternalLink, FileText } from "lucide-react";

interface TestCase {
  id: string;
  requirementId: string;
  fhirPath: string;
  caseType: "positive" | "negative" | "edge";
  status: "pass" | "fail" | "pending";
  request: string;
  expected: string;
  evidenceUri: string;
}

const TestCasesDashboard = () => {
  const testCases: TestCase[] = [
    {
      id: "TC001",
      requirementId: "REQ001",
      fhirPath: "Patient.read",
      caseType: "positive",
      status: "pass",
      request: "GET /Patient/example-patient",
      expected: "200 OK with valid Patient resource",
      evidenceUri: "gs://medtrace-evidence/tc001-evidence.json"
    },
    {
      id: "TC002",
      requirementId: "REQ001",
      fhirPath: "Patient.read",
      caseType: "negative",
      status: "pass",
      request: "GET /Patient/nonexistent-patient",
      expected: "404 Not Found",
      evidenceUri: "gs://medtrace-evidence/tc002-evidence.json"
    },
    {
      id: "TC003",
      requirementId: "REQ002",
      fhirPath: "Patient.search",
      caseType: "positive",
      status: "pending",
      request: "GET /Patient?identifier=12345",
      expected: "200 OK with Bundle containing matching Patient",
      evidenceUri: "gs://medtrace-evidence/tc003-evidence.json"
    },
    {
      id: "TC004",
      requirementId: "REQ003",
      fhirPath: "Patient.name",
      caseType: "edge",
      status: "fail",
      request: "Validate Patient resource with missing name",
      expected: "Validation error for required field",
      evidenceUri: "gs://medtrace-evidence/tc004-evidence.json"
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

  const passCount = testCases.filter(tc => tc.status === "pass").length;
  const failCount = testCases.filter(tc => tc.status === "fail").length;
  const pendingCount = testCases.filter(tc => tc.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generated Test Cases</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export JUnit
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            View Evidence Doc
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium">Total Tests</span>
            </div>
            <p className="text-2xl font-bold mt-1">{testCases.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm font-medium">Passed</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-success">{passCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <span className="text-sm font-medium">Failed</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-destructive">{failCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-warning">{pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Cases</CardTitle>
          <CardDescription>
            FHIR compliance test cases generated from requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test ID</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>FHIR Path</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Expected</TableHead>
                <TableHead>Evidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testCases.map((testCase) => (
                <TableRow key={testCase.id}>
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
                  <TableCell className="font-mono text-xs max-w-xs truncate">
                    {testCase.request}
                  </TableCell>
                  <TableCell className="text-xs max-w-xs truncate">
                    {testCase.expected}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
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