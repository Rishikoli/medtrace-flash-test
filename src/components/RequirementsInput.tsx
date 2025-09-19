import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Settings } from "lucide-react";
import { useState } from "react";

const RequirementsInput = () => {
  const [docUrl, setDocUrl] = useState("");
  const [testCount, setTestCount] = useState("8");
  const [requirements, setRequirements] = useState(`• FHIR Patient resource must support read operation
• Patient search by identifier must return valid FHIR Bundle
• All required elements must be populated in test data
• Cardinality constraints must be validated for Patient.name
• ValueSet bindings must be checked for Patient.gender`);
  
  const [parsedRequirements, setParsedRequirements] = useState([
    { id: "REQ001", text: "FHIR Patient resource must support read operation", deferred: false, reason: "" },
    { id: "REQ002", text: "Patient search by identifier must return valid FHIR Bundle", deferred: false, reason: "" },
    { id: "REQ003", text: "All required elements must be populated in test data", deferred: true, reason: "Future iteration" },
    { id: "REQ004", text: "Cardinality constraints must be validated for Patient.name", deferred: false, reason: "" },
    { id: "REQ005", text: "ValueSet bindings must be checked for Patient.gender", deferred: false, reason: "" }
  ]);

  const toggleDeferred = (id: string, reason: string = "") => {
    setParsedRequirements(prev => prev.map(req => 
      req.id === id ? { ...req, deferred: !req.deferred, reason: req.deferred ? "" : reason } : req
    ));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Requirements Input</h2>
        <p className="text-muted-foreground">Upload and configure your healthcare requirement documents for FHIR compliance testing</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <span>Document Upload</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Upload or link to your healthcare requirements document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-url">Google Drive Document URL</Label>
              <Input
                id="doc-url"
                placeholder="https://docs.google.com/document/d/..."
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center p-6 border-2 border-dashed border-muted rounded-lg">
              <div className="text-center space-y-2">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop a document or click to browse
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Configuration</span>
            </CardTitle>
            <CardDescription>
              Set profile and validation parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile">FHIR Profile</Label>
              <Input
                id="profile"
                value="FHIR Patient"
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <Input
                id="model"
                value="gemini-2.0-flash"
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-count">Target Test Count</Label>
              <Input
                id="test-count"
                type="number"
                value={testCount}
                onChange={(e) => setTestCount(e.target.value)}
                min="1"
                max="50"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requirements Preview</CardTitle>
          <CardDescription>
            Review and edit requirements before processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Parsed Requirements</Label>
              <Button variant="outline" size="sm" onClick={() => {
                const bullets = requirements.split('\n').filter(line => line.trim().startsWith('•'));
                const parsed = bullets.map((bullet, idx) => ({
                  id: `REQ${String(idx + 1).padStart(3, '0')}`,
                  text: bullet.replace('•', '').trim(),
                  deferred: false,
                  reason: ""
                }));
                setParsedRequirements(parsed);
              }}>
                Re-parse
              </Button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {parsedRequirements.map((req) => (
                <div key={req.id} className={`flex items-center justify-between p-3 rounded-lg border ${req.deferred ? 'bg-muted/50' : 'bg-background'}`}>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-muted-foreground">{req.id}</span>
                      {req.deferred && <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">Deferred</span>}
                    </div>
                    <p className={`text-sm ${req.deferred ? 'text-muted-foreground line-through' : ''}`}>{req.text}</p>
                    {req.deferred && req.reason && (
                      <p className="text-xs text-muted-foreground italic">Reason: {req.reason}</p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      if (!req.deferred) {
                        const reason = prompt("Reason for deferring this requirement:");
                        if (reason !== null) toggleDeferred(req.id, reason);
                      } else {
                        toggleDeferred(req.id);
                      }
                    }}
                  >
                    {req.deferred ? 'Include' : 'Defer'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline">Save Draft</Button>
        <Button>Start MedTrace Flash</Button>
      </div>
    </div>
  );
};

export default RequirementsInput;