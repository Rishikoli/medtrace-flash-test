import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import AgentPipeline from "@/components/AgentPipeline";
import RequirementsInput from "@/components/RequirementsInput";
import TestCasesDashboard from "@/components/TestCasesDashboard";
import MetricsEndpoint from "@/components/MetricsEndpoint";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import IntegrationHelpers from "@/components/IntegrationHelpers";
import heroImage from "@/assets/medtrace-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                  <span className="text-sm font-medium text-primary">✨ Powered by Gemini 2.0 Flash</span>
                </div>
                <h2 className="text-5xl font-bold text-foreground leading-tight">
                  Transform Healthcare Requirements into 
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"> FHIR-Compliant</span> Test Cases
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  MedTrace converts requirement documents into comprehensive test suites with automated validation, evidence tracking, and seamless CI/CD integration.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-success/5 rounded-xl border border-success/20">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-success">FHIR Patient</p>
                    <p className="text-xs text-muted-foreground">Profile Support</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-primary">4-Agent</p>
                    <p className="text-xs text-muted-foreground">Serverless</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-warning/5 rounded-xl border border-warning/20">
                  <div className="w-3 h-3 bg-warning rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-warning">&lt; 5 min</p>
                    <p className="text-xs text-muted-foreground">Runtime</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-3xl" />
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl border shadow-2xl p-8">
                <img 
                  src={heroImage} 
                  alt="MedTrace Flash Healthcare Compliance"
                  className="rounded-xl w-full h-auto shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  ✓ Live Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-12">
        <Tabs defaultValue="pipeline" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-5 w-full max-w-4xl bg-muted/50 p-1 rounded-xl">
              <TabsTrigger 
                value="pipeline" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Pipeline</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="requirements"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>Requirements</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="results"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Results</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span>Analytics</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="integrations"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                  <span>Integrations</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="pipeline" className="space-y-6">
            <AgentPipeline />
          </TabsContent>
          
          <TabsContent value="requirements" className="space-y-6">
            <RequirementsInput />
          </TabsContent>
          
          <TabsContent value="results" className="space-y-6">
            <TestCasesDashboard />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <IntegrationHelpers />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Hidden metrics endpoint for development */}
      <MetricsEndpoint />
    </div>
  );
};

export default Index;
