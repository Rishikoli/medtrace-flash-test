# MedTrace Flash - Healthcare Compliance Testing

**Requirements → Compliant Test Cases (Gemini 2.0 Flash)**

A React-based frontend for the MedTrace Flash healthcare compliance testing system that converts healthcare requirement documents into FHIR-compliant test cases with automated validation, evidence tracking, and CI/CD integration.

## 🏥 What it does

MedTrace Flash transforms healthcare requirement documents into comprehensive FHIR-compliant test suites using AI-powered analysis. The system:

- **Converts** requirement docs into FHIR-compliant test cases
- **Auto-checks** MustSupport/cardinality/bindings compliance  
- **Outputs** test catalogs, evidence packs, and CI artifacts
- **Integrates** with Google Cloud + Workspace services

## 🎯 MVP Scope

- **Profile Focus**: FHIR Patient resource read/search operations
- **Input**: Google Drive docs with 3-5 requirement lines + policy sheets
- **Output**: Test sheets, evidence docs, JUnit XML, executive briefs
- **Target**: 8+ test cases (positive/negative/edge) in <5 minutes at <$1 cost

## 🏗️ Architecture

### Four-Agent Serverless Pipeline
1. **Planner**: Parse docs, read thresholds, publish task lists
2. **Data**: Pull FHIR Patient profiles, normalize to JSONL
3. **Analyst-Validator**: Generate tests with Gemini 2.0 Flash, run conformance checks
4. **Reporter**: Create sheets/docs/slides, emit JUnit/JSON, send summaries

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **State**: TanStack Query + React Router
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form + Zod validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd medtrace-flash-test

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 📋 Features

### 🔄 Agent Pipeline
- Real-time workflow visualization
- Agent health monitoring with metrics
- Progress tracking and error handling
- Guardrail alerts for stuck processes

### 📝 Requirements Management
- Google Drive document integration
- Requirement parsing and validation
- Interactive requirement editing
- Deferred requirement handling

### 🧪 Test Case Generation
- Automated FHIR test case creation
- Positive, negative, and edge case coverage
- FHIRPath assertion generation
- Confidence scoring and quality metrics

### 📊 Results Dashboard
- Comprehensive test case management
- Pass/fail status tracking with sparklines
- Export capabilities (JSONL, JUnit, cURL)
- Evidence linking and traceability

### 📈 Monitoring & Analytics
- Real-time agent health panels
- Performance metrics and KPIs
- Cost and latency tracking
- Historical run analysis

## 🎨 UI Components

The application features a modern, healthcare-focused design with:

- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching
- **Accessibility**: ARIA labels and keyboard navigation
- **Professional Styling**: Healthcare industry-appropriate design

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── AgentPipeline.tsx
│   ├── RequirementsInput.tsx
│   ├── TestCasesDashboard.tsx
│   └── ...
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for local development:

```env
VITE_GOOGLE_CLOUD_PROJECT_ID=your-project-id
VITE_VERTEX_AI_REGION=us-central1
VITE_BIGQUERY_DATASET=medtrace_evidence
```

### Data Contracts

**Task Structure**:
```typescript
{
  id: string;
  type: "planner" | "data" | "analyst" | "reporter";
  inputs: object;
  owner: string;
  status: "pending" | "running" | "completed" | "failed";
  outputs_uri: string;
}
```

**Test Case Structure**:
```typescript
{
  test_id: string;
  requirement_id: string;
  fhir_path: string;
  case_type: "positive" | "negative" | "edge";
  request: string;
  expected: string;
  evidence_uri: string;
}
```

## 🧪 Testing

This is a **testing/demo application** showcasing the MedTrace Flash UI and workflow. The backend integrations are mocked for demonstration purposes.

### Mock Data
- Simulated agent processing with realistic delays
- Sample FHIR test cases and validation results
- Mock evidence tracking and metrics

### Real Integration Points (Future)
- Google Cloud Vertex AI (Gemini 2.0 Flash)
- Google Workspace APIs (Docs, Sheets, Slides)
- FHIR validation services
- BigQuery evidence logging

## 🔒 Security & Compliance

- **Synthetic Data Only**: No real patient data in testing
- **Least-Privilege Access**: Service account best practices
- **Immutable Evidence**: Audit trail for compliance
- **HIPAA-Ready Architecture**: Designed for healthcare standards

## 🚀 Deployment

### Development
```bash
npm run build:dev
npm run preview
```

### Production
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

## 📚 Next Steps

After MVP validation, planned enhancements include:

- **Additional FHIR Resources**: AllergyIntolerance, Observation
- **CI/CD Integration**: Cloud Build gates and automation
- **Terminology Validation**: Enhanced binding checkers
- **Real-time Collaboration**: Multi-user requirement editing

## 🤝 Contributing

This is a demonstration project. For production use, implement:

1. Real Google Cloud service integrations
2. FHIR validation backend services
3. Authentication and authorization
4. Production monitoring and alerting

## 📄 License

This project is for testing and demonstration purposes.
