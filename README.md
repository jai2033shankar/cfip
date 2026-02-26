<p align="center">
  <img src="https://img.shields.io/badge/CFIP-Code%20Forensics%20Intelligence-6366f1?style=for-the-badge&logo=codereview&logoColor=white" alt="CFIP Badge"/>
</p>

<h1 align="center">CFIP — Code Forensics Intelligence Platform</h1>

<p align="center">
  <strong>"See Your Code. Understand Your Risk. Predict Your Impact."</strong>
</p>

<p align="center">
  An on-prem AI-powered code intelligence platform that performs deep code forensics, architecture reconstruction, end-to-end dependency visualization, business impact simulation, risk prediction, and proactive remediation suggestions — designed specifically for <strong>regulated industries (BFSI)</strong> where explainability, auditability, and control are non-negotiable.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/D3.js-7.x-f9a03c?style=flat-square&logo=d3.js" alt="D3.js"/>
  <img src="https://img.shields.io/badge/Cytoscape.js-3.x-f76f00?style=flat-square" alt="Cytoscape.js"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

---

## 🎯 Target Market

| Segment | Use Case |
|---------|----------|
| **Tier 1 & 2 Banks** | Legacy modernization, risk assessment |
| **Insurance Companies** | Policy engine audit, compliance mapping |
| **Capital Markets** | Trade system dependency tracing |
| **FinTech & Payments** | Payment flow integrity analysis |
| **Core Banking Vendors** | Architecture documentation |
| **Enterprise Engineering** | Tech debt quantification |

---

## 🧠 Core Capabilities

### 1. Code Comprehension Engine
Multi-language AST parsing (Java, Python, TypeScript, JavaScript, SQL) with functional decomposition, business rule extraction, and data flow tracing.

### 2. BFSI Domain Analyzer [New]
Uses a subset of banking domain keywords (`payment`, `aml`, `ledger`, `reporting`) to flag critical node behaviors, calculating "Payment Flow Integrity Risk", "AML Sanctions Validation Risk" instead of generic technical debt labels.

### 3. Architecture Reconstruction
Reverse-engineers system architecture from code — generates system layer diagrams, service mesh topology, module dependency maps, and API contract visualization dynamically mapped through `.nodes` and `.edges`.

### 4. Dependency Graph Visualization
Interactive Cytoscape.js-powered graph with live node clustering, directional pathfinding, type/risk filtering, neighborhood highlighting, and node-level metrics (LOC, complexity).

### 5. Risk & Impact Simulation
Pre-commit risk radar with severity scoring, category filtering, and **what-if analysis** — simulates downstream cascade, SLA risk, compliance risk, and data integrity risk before any code is deployed based on static code parsing.

### 6. Business Intelligence Layer
Code-to-business capability mapping dynamically aligned with the **BIAN (Banking Industry Architecture Network)** framework. Calculates live tracking coverage across domains like Operations, Compliance, Security, Customer Management, Capital Markets, and Finance.

### 7. AI Remediation Engine [New]
AI-generated remediation suggestions from discovered technical debt and architecture smells. Ranks with expected Risk Reduction scores, Confidence, and actionable Effort estimates (in engineering days), complete with an accept/reject audit workflow.

### 8. Governance & Audit [New]
Local-storage backed active Enterprise Audit trail that captures interactions like 'Live Repository Scan Initiated' with a timestamp to record governance activity within the UI natively. RBAC role management for Admin, Architect, Developer, and Auditor personas.

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%"><strong>Landing Page</strong><br/>Premium dark theme with BFSI-focused value proposition</td>
    <td width="50%"><strong>Command Center</strong><br/>KPI cards, D3 risk trend chart, language donut, activity feed</td>
  </tr>
  <tr>
    <td width="50%"><strong>Dependency Graph</strong><br/>Interactive Cytoscape visualization with 52 nodes, 54 edges</td>
    <td width="50%"><strong>Risk & Impact</strong><br/>Risk registry with what-if impact simulation</td>
  </tr>
  <tr>
    <td width="50%"><strong>Code Explorer</strong><br/>File tree with syntax-highlighted viewer and inline risk annotations</td>
    <td width="50%"><strong>Architecture View</strong><br/>System layers, module deps, service mesh, API contracts</td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  Next.js 16 (App Router) • React • D3.js • Cytoscape.js    │
├─────────────────────────────────────────────────────────────┤
│                      API LAYER                               │
│  Next.js API Routes → Python FastAPI Analysis Engine         │
├─────────────────────────────────────────────────────────────┤
│                   ANALYSIS ENGINE                            │
│  AST Parser • Graph Builder • Risk Scorer • Code Scanner     │
│  GitHub Client • Business Mapper • BIAN Taxonomy             │
├─────────────────────────────────────────────────────────────┤
│                   INTELLIGENCE LAYER                         │
│  NetworkX Graph • Impact Simulation • Anti-Pattern Detection │
│  Ollama LLM (on-prem) • Confidence Scoring                  │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                                │
│  SQLite / Neo4j • GitHub API • Local File System             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.10 (for analysis engine)
- **npm** or **yarn**

### 1. Frontend (Next.js)

```bash
# Clone the repository
git clone https://github.com/jai2033shankar/cfip.git
cd cfip

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

### 2. Backend Analysis Engine (Optional)

```bash
cd engine

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start the engine
python main.py
```

The analysis engine runs on **http://localhost:8001**.

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
# GitHub Integration
GITHUB_PAT=ghp_your_personal_access_token
GITHUB_ORG=your-organization

# AI Model (Ollama — on-prem)
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=codellama:13b

# Database
DATABASE_PATH=./data/cfip.db
```

---

## 👤 Demo Credentials

The platform includes 4 pre-configured demo users with role-based access:

| Role | Name | Email | Password |
|------|------|-------|----------|
| **Admin** | Alex Morgan | `admin@cfip.io` | `admin123` |
| **Architect** | Sarah Chen | `architect@cfip.io` | `arch123` |
| **Developer** | James Wilson | `developer@cfip.io` | `dev123` |
| **Auditor** | Maria Garcia | `auditor@cfip.io` | `audit123` |

---

## 📁 Project Structure

```
cfip/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── login/page.tsx              # Authentication
│   │   ├── dashboard/
│   │   │   ├── layout.tsx              # Sidebar + header
│   │   │   ├── page.tsx                # Command Center
│   │   │   ├── explorer/page.tsx       # Code Explorer
│   │   │   ├── graph/page.tsx          # Dependency Graph
│   │   │   ├── risk/page.tsx           # Risk & Impact
│   │   │   ├── architecture/page.tsx   # Architecture View
│   │   │   ├── business/page.tsx       # Business Intelligence
│   │   │   ├── remediation/page.tsx    # AI Remediation
│   │   │   ├── governance/page.tsx     # Governance & Audit
│   │   │   └── settings/page.tsx       # Configuration
│   │   └── api/                        # API routes
│   ├── lib/
│   │   ├── seed-data.ts                # Comprehensive BFSI mock data
│   │   └── auth.ts                     # Auth utilities
│   └── globals.css                     # 700+ line design system
├── engine/
│   ├── main.py                         # FastAPI application
│   ├── requirements.txt
│   └── services/
│       ├── ast_parser.py               # Multi-language AST parsing
│       ├── graph_builder.py            # NetworkX dependency graph
│       ├── risk_scorer.py              # Risk severity scoring
│       ├── code_scanner.py             # Directory scan & metrics
│       ├── github_client.py            # GitHub PAT integration
│       ├── business_mapper.py          # BIAN taxonomy mapping
│       ├── bfsi_analyzer.py            # Financial domain pattern rules
│       └── remediation_generator.py    # AI insights & risk reduction logic
├── package.json
└── README.md
```

---

## 🛡️ Security & Compliance

CFIP is built with BFSI regulatory requirements at its core:

| Feature | Description |
|---------|-------------|
| **Air-Gapped Mode** | All processing on-prem, no external calls |
| **On-Prem LLM** | Ollama-based inference, code never leaves your network |
| **AES-256 Encryption** | Data encrypted at rest |
| **Audit Trail** | 7-year retention, immutable logs |
| **RBAC** | Role-based access (Admin, Architect, Developer, Auditor) |
| **Human-in-the-Loop** | Manual approval required for AI-generated fixes |
| **Prompt Injection Guard** | Input validation against injection patterns |
| **Code Export Prevention** | No code snippets leave the platform |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **Styling** | Vanilla CSS (custom design system, glassmorphism) |
| **Visualization** | D3.js 7, Cytoscape.js 3 |
| **Backend** | Python FastAPI |
| **Graph Engine** | NetworkX |
| **Auth** | Custom credentials (NextAuth.js hooks) |
| **LLM** | Ollama (CodeLlama, DeepSeek Coder, StarCoder) |
| **Database** | SQLite (demo) / Neo4j (production) |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Built with ❤️ for regulated industries that demand explainability, auditability, and control.</sub>
</p>
