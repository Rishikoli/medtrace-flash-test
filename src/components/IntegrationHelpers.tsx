import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Server, Key, Webhook, FolderOpen, Copy, Eye, EyeOff } from "lucide-react";
import { enhancedToast } from "@/lib/enhanced-toast";
import { toast } from "sonner";

const IntegrationHelpers = () => {
  const [fhirServerUrl, setFhirServerUrl] = useState("https://hapi.fhir.org/baseR4");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    googleCloud: "AIzaSyC-*********************",
    vertexAI: "ya29.*********************",
    bigQuery: "projects/medtrace/*********************"
  });
  const [webhookUrl, setWebhookUrl] = useState("https://api.github.com/repos/org/repo/dispatches");
  const [webhookSecret, setWebhookSecret] = useState("ghp_*********************");

  const testFhirConnection = async () => {
    setConnectionStatus("testing");
    
    // Mock connection test
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate for demo
      setConnectionStatus(isSuccess ? "success" : "error");
      
      if (isSuccess) {
        enhancedToast.connectionSuccess("FHIR server");
      } else {
        enhancedToast.connectionError("FHIR server", testFhirConnection);
      }
    }, 2000);
  };

  const testWebhook = async () => {
    enhancedToast.info("Webhook Test Sent", "Test payload sent to webhook endpoint");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    enhancedToast.success("Copied to Clipboard", `${label} copied successfully`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4 text-success" />;
      case "error": return <XCircle className="w-4 h-4 text-destructive" />;
      case "testing": return <AlertTriangle className="w-4 h-4 text-warning animate-pulse" />;
      default: return <Server className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Connected</Badge>;
      case "error": return <Badge variant="destructive">Failed</Badge>;
      case "testing": return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Testing...</Badge>;
      default: return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Integration Helpers</h2>
        <Badge variant="outline" className="text-xs">Mock Integrations</Badge>
      </div>

      <Tabs defaultValue="fhir" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fhir">FHIR Server</TabsTrigger>
          <TabsTrigger value="drive">Google Drive</TabsTrigger>
          <TabsTrigger value="webhook">CI/CD Webhooks</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="fhir" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span>FHIR Server Connection Tester</span>
              </CardTitle>
              <CardDescription>
                Test connectivity and validate FHIR server endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fhir-url">FHIR Base URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="fhir-url"
                    value={fhirServerUrl}
                    onChange={(e) => setFhirServerUrl(e.target.value)}
                    placeholder="https://your-fhir-server.com/fhir"
                  />
                  <Button 
                    onClick={testFhirConnection}
                    disabled={connectionStatus === "testing"}
                    className="min-w-[100px]"
                  >
                    {connectionStatus === "testing" ? "Testing..." : "Test"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(connectionStatus)}
                  <span className="text-sm font-medium">Connection Status</span>
                </div>
                {getStatusBadge(connectionStatus)}
              </div>

              {connectionStatus === "success" && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    FHIR server is accessible. Capability statement retrieved successfully.
                    <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                      Server: HAPI FHIR 6.8.0 | FHIR Version: 4.0.1
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {connectionStatus === "error" && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Connection failed. Please check:
                    <ul className="mt-2 text-xs list-disc list-inside">
                      <li>Server URL is correct and accessible</li>
                      <li>Network connectivity</li>
                      <li>CORS settings if testing from browser</li>
                      <li>Authentication requirements</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Quick Tests</Label>
                  <div className="space-y-1">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      GET /metadata
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      GET /Patient?_count=1
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      POST /Patient/$validate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Supported Resources</Label>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Patient</Badge>
                    <Badge variant="outline" className="text-xs">Observation</Badge>
                    <Badge variant="outline" className="text-xs">Bundle</Badge>
                    <Badge variant="outline" className="text-xs">Organization</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5" />
                <span>Google Drive Picker Integration</span>
              </CardTitle>
              <CardDescription>
                Configure and test Google Drive document access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
                <FolderOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Click to open Google Drive picker
                </p>
                <Button onClick={() => {
                  toast({
                    title: "Drive Picker Opened",
                    description: "Google Drive picker would open here in production",
                  });
                }}>
                  Select Requirements Document
                </Button>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Recent Documents</Label>
                <div className="space-y-2">
                  {[
                    { name: "FHIR Patient Requirements v2.1.docx", id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", modified: "2 hours ago" },
                    { name: "Healthcare Compliance Tests.docx", id: "1mGVis0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", modified: "1 day ago" },
                    { name: "MVP Requirements Draft.docx", id: "1cViMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", modified: "3 days ago" }
                  ].map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">Modified {doc.modified}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <FolderOpen className="h-4 w-4" />
                <AlertDescription>
                  Ensure your Google Drive API is configured with the following scopes:
                  <div className="mt-2 text-xs font-mono bg-muted p-2 rounded">
                    https://www.googleapis.com/auth/drive.readonly<br/>
                    https://www.googleapis.com/auth/documents.readonly
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="w-5 h-5" />
                <span>CI/CD Webhook Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure webhooks for automated testing and deployment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://api.github.com/repos/org/repo/dispatches"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="webhook-secret"
                      type={showApiKey ? "text" : "password"}
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Webhook Events</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { event: "test.completed", enabled: true },
                    { event: "test.failed", enabled: true },
                    { event: "evidence.generated", enabled: false },
                    { event: "report.created", enabled: true }
                  ].map((webhook) => (
                    <div key={webhook.event} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-xs font-mono">{webhook.event}</span>
                      <Badge variant={webhook.enabled ? "secondary" : "outline"} className="text-xs">
                        {webhook.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={testWebhook} variant="outline">
                  Test Webhook
                </Button>
                <Button>
                  Save Configuration
                </Button>
              </div>

              <Alert>
                <Webhook className="h-4 w-4" />
                <AlertDescription>
                  Sample webhook payload for test completion:
                  <Textarea
                    className="mt-2 text-xs font-mono"
                    rows={6}
                    readOnly
                    value={JSON.stringify({
                      event: "test.completed",
                      timestamp: "2024-01-15T10:30:00Z",
                      run_id: "run_abc123",
                      status: "success",
                      test_count: 8,
                      passed: 7,
                      failed: 1,
                      evidence_uri: "gs://medtrace-evidence/run_abc123/",
                      artifacts: {
                        junit: "gs://medtrace-artifacts/run_abc123/junit.xml",
                        jsonl: "gs://medtrace-artifacts/run_abc123/tests.jsonl"
                      }
                    }, null, 2)}
                  />
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="w-5 h-5" />
                <span>API Key Management</span>
              </CardTitle>
              <CardDescription>
                Manage API keys and service account credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  API keys are masked for security. Click the eye icon to reveal values.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {Object.entries(apiKeys).map(([service, key]) => (
                  <div key={service} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()} API Key
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={key}
                        onChange={(e) => setApiKeys(prev => ({ ...prev, [service]: e.target.value }))}
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(key, service)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Service Account Status</Label>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    Active
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Project ID</p>
                    <p className="font-mono">medtrace-prod-2024</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service Account</p>
                    <p className="font-mono">medtrace@medtrace-prod.iam</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Key Expiry</p>
                    <p className="font-mono">2024-12-31</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Permissions</p>
                    <p className="font-mono">BigQuery, Storage, Vertex AI</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  Rotate Keys
                </Button>
                <Button variant="outline">
                  Test Permissions
                </Button>
                <Button>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHelpers;