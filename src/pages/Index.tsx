import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AgentPipeline from "@/components/AgentPipeline";
import RequirementsInput from "@/components/RequirementsInput";
import TestCasesDashboard from "@/components/TestCasesDashboard";
import heroImage from "@/assets/medtrace-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground leading-tight">
                Transform Healthcare Requirements into 
                <span className="text-primary"> FHIR-Compliant</span> Test Cases
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Powered by Gemini 2.0 Flash, MedTrace converts requirement documents into comprehensive test suites with automated validation, evidence tracking, and CI/CD integration.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>US Core Patient Profile</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>4-Agent Serverless Architecture</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>&lt; 5 min runtime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="MedTrace Flash Healthcare Compliance"
                className="rounded-lg shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-12">
        <Tabs defaultValue="pipeline" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pipeline">Agent Pipeline</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="results">Test Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pipeline" className="space-y-6">
            <AgentPipeline />
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-6">
            <RequirementsInput />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <TestCasesDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
