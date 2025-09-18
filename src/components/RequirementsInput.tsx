import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, Settings } from "lucide-react";
import { useState } from "react";

const RequirementsInput = () => {
  const [docUrl, setDocUrl] = useState("");
  const [requirements, setRequirements] = useState(`• US Core Patient resource must support read operation
• Patient search by identifier must return valid FHIR Bundle
• All MustSupport elements must be populated in test data
• Cardinality constraints must be validated for Patient.name
• ValueSet bindings must be checked for Patient.gender`);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Requirements Input</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Document Upload</span>
            </CardTitle>
            <CardDescription>
              Upload or link to your requirements document
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
                value="US Core Patient"
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
                value="8"
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
        <CardContent>
          <Textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
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