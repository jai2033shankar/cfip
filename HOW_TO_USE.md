# How to Use CFIP

> Comprehensive guide for using the Code Forensics Intelligence Platform.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Legacy Language Analyzer](#legacy-language-analyzer)
4. [Code Explorer](#code-explorer)
5. [Dependency Graph](#dependency-graph)
6. [Risk & Impact Analysis](#risk--impact-analysis)
7. [Engineering Insights](#engineering-insights)
8. [AI Remediation](#ai-remediation)
9. [AI Copilot](#ai-copilot)
10. [Governance](#governance)
11. [Settings & Configuration](#settings--configuration)
12. [Product Tour](#product-tour)

---

## Getting Started

### Installation

```bash
git clone https://github.com/your-org/cfip.git
cd cfip
npm install
npm run dev
```

### Login

Navigate to `http://localhost:3000/login`

| Email | Password | Role |
|---|---|---|
| `admin@cfip.io` | `admin123` | Administrator |

After login, you'll be redirected to the dashboard.

---

## Dashboard Overview

The main dashboard provides an at-a-glance view of your codebase health:

- **Risk Heatmap** — Visual matrix of risk distribution across modules
- **Risk Trend** — Historical chart tracking critical/high/medium/low risks over time
- **Repository Health** — Health scores for each scanned repository
- **Language Breakdown** — Pie chart showing language distribution (including COBOL, Fortran)
- **Recent Scans** — Timeline of the most recent analysis runs

---

## Legacy Language Analyzer

> Navigate to: **Dashboard → Legacy Analyzer** (sidebar, under "Intelligence")

The Legacy Analyzer enables COBOL, Fortran, PL/I, and RPG code analysis.

### Language Detection

1. **Paste code** into the textarea (a COBOL sample is pre-loaded)
2. Click **"Analyze Code"**
3. The system auto-detects the language by matching keywords:
   - COBOL: `IDENTIFICATION DIVISION`, `PROGRAM-ID`, `PERFORM`, `COPY`, `PIC`
   - Fortran: `PROGRAM`, `SUBROUTINE`, `FUNCTION`, `IMPLICIT NONE`
   - PL/I: `PROCEDURE`, `DECLARE`, `DCL`, `BEGIN/END`
   - RPG: `DCL-S`, `DCL-DS`, `BEGSR`, `CHAIN`, `READ`

### Structural Analysis

For COBOL code, the analyzer reports:
- **GO TO Statements** — Count of unstructured control flow
- **PERFORM Calls** — Structured procedure invocations
- **CALL Statements** — External program calls
- **COPY Imports** — Copybook dependencies
- **Y2K Date Fields** — 2-digit year fields detected
- **Missing END-IF** — IF statements without explicit scope terminators

### Legacy Repositories

View scanned legacy repositories with:
- Health score, risk distribution, file/function counts
- Code structure table with LOC, complexity, test coverage per component

### Risk Analysis

COBOL-specific risks include:
- GO TO spaghetti code (> 3 statements = warning)
- Copybook sprawl (shared across 30+ programs)
- Y2K-era date fields in financial calculations
- Missing VSAM FILE STATUS error handling
- Hardcoded database credentials

### Modernization Recommendations

AI-generated modernization strategies with:
- **Confidence score** — How certain the AI is about the recommendation
- **Risk reduction** — Percentage reduction in overall risk
- **Effort estimate** — Days required for implementation
- **Pattern** — Architectural pattern (e.g., Strangler Fig, Anti-Corruption Layer)

---

## Code Explorer

> Navigate to: **Dashboard → Code Explorer**

Browse your codebase file trees and view parsed code structure:
- File tree navigation with syntax highlighting
- Function/class/module extraction per file
- Complexity and LOC metrics inline

---

## Dependency Graph

> Navigate to: **Dashboard → Dependencies**

Interactive knowledge graph showing:
- Module → Service → Function → Database relationships
- Call chains and data flow paths
- Criticality-weighted edges (thickness = importance)
- Filter by module, risk level, or relationship type

---

## Risk & Impact Analysis

> Navigate to: **Dashboard → Risk & Impact**

Simulate the impact of changing a component:
- Select a node to see all downstream impacts
- View SLA, compliance, data, and security risk summaries
- Color-coded severity: critical (red), high (orange), medium (yellow), low (green)

---

## Engineering Insights

> Navigate to: **Dashboard → Engineering Insights**

Technical debt analysis and code quality metrics:
- Maintainability index per module
- Dead code detection
- Circular dependency alerts
- DevOps maturity indicators

---

## AI Remediation

> Navigate to: **Dashboard → AI Remediation**

Generate actionable patches for technical debt:
- AI suggests refactoring patterns with confidence scores
- View affected files and estimated effort
- Generate code patches (requires Ollama)

---

## AI Copilot

> Navigate to: **Dashboard → AI Copilot**

Chat with your codebase using natural language:
- Powered by local Ollama (gemma3:latest) + ChromaDB vector store
- Ask questions like: *"What are the dependencies of TXNPROC?"*
- No data leaves your network

### Setup

1. Install Ollama: `brew install ollama` (macOS)
2. Pull models: `ollama pull gemma3:latest && ollama pull bge-m3:latest`
3. Start Ollama: `ollama serve`
4. Enable in Settings → AI Model → Local Ollama

---

## Governance

> Navigate to: **Dashboard → Governance**

Compliance and change tracking:
- Change approval workflows
- Audit log of all analysis actions
- SLA monitoring dashboards
- Regulatory compliance status

---

## Settings & Configuration

> Navigate to: **Dashboard → Settings**

### GitHub Integration
- Connect repositories via personal access token
- Configure auto-scan on push

### AI Model
- **Local Ollama** (default, air-gapped) — gemma3:latest
- **OpenAI** — GPT-4 (optional, requires API key)
- **Anthropic** — Claude (optional, requires API key)

### Scanning Parameters
- Include/exclude file patterns
- Maximum file size threshold
- Anti-pattern detection sensitivity

### Risk Thresholds
- Customize critical/high/medium/low boundaries
- Configure alert notifications

---

## Product Tour

Click the **📖 book icon** in the dashboard header to start the guided product tour.

The tour highlights:
1. Dashboard overview and risk heatmap
2. Repository selection and scan initiation
3. AI Copilot chat interface
4. Engineering Insights
5. **Legacy Language Analyzer** — COBOL/Fortran/PL/I/RPG analysis
6. AI Remediation patches
7. Governance and compliance

The tour can be restarted at any time by clicking the book icon again.
