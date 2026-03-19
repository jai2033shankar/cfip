# How to Use CFIP

> Complete guide for deploying and using the Code Forensics Intelligence Platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Dashboard Overview](#dashboard-overview)
5. [Legacy Language Analyzer](#legacy-language-analyzer)
6. [Code Explorer](#code-explorer)
7. [Dependency Graph](#dependency-graph)
8. [Risk & Impact Analysis](#risk--impact-analysis)
9. [Security Analysis](#security-analysis)
10. [AI Copilot](#ai-copilot)
11. [AI Remediation](#ai-remediation)
12. [Governance](#governance)
13. [Settings & Configuration](#settings--configuration)
14. [Product Tour](#product-tour)
15. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

| Component | Version | Purpose |
|---|---|---|
| Docker + Docker Compose | 24+ | Container deployment |
| Git | 2.0+ | Repository access |
| Browser | Chrome/Edge latest | Dashboard access |

### Optional (for local development)

| Component | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Frontend development |
| Python | 3.10+ | Engine development |
| Ollama | Latest | Local AI inference |

### Hardware Requirements

| Tier | CPU | RAM | Storage | GPU |
|---|---|---|---|---|
| Demo | 4 cores | 8 GB | 10 GB | Not required |
| Production | 8+ cores | 16+ GB | 50+ GB | Recommended (NVIDIA) |

---

## Installation

### Docker Deployment (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/jai2033shankar/cfip.git
cd cfip

# 2. Copy environment config
cp .env.example .env
# Edit .env with your settings (Git tokens, API keys, etc.)

# 3. Deploy entire stack
docker compose up -d

# 4. Open dashboard
open http://localhost:3000
```

This starts three services:
- **CFIP App** (Next.js + FastAPI) — `http://localhost:3000`
- **Ollama** (Local LLM) — `http://localhost:11434`
- **ChromaDB** (Vector Store) — `http://localhost:8000`

### Local Development

```bash
# Frontend
npm install --legacy-peer-deps
npm run dev

# Engine (separate terminal)
cd engine
pip install -r requirements.txt
python main.py

# Ollama (separate terminal)
ollama serve
ollama pull gemma3:latest
ollama pull bge-m3:latest
```

### Login

| Email | Password | Role |
|---|---|---|
| `admin@cfip.io` | `admin123` | Administrator |

---

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and customize:

```env
# Git integration
GIT_PROVIDER=github          # github, gitlab, bitbucket, azure_devops
GIT_BASE_URL=https://api.github.com
GIT_PAT=ghp_xxxxxxxxxxxx

# LLM (optional — leave blank for air-gapped)
OPENAI_API_KEY=sk-xxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx

# Security
CFIP_SECRET_KEY=your-secret-key
```

### Enterprise Git Integration

Navigate to **Settings → Enterprise Git Integration**:

1. Select **Git Provider** (GitHub, GitLab, Bitbucket, Azure DevOps)
2. Enter **API Base URL** (for self-hosted instances)
3. Enter **Personal Access Token**
4. Click **Test Connection** to validate
5. Click **Save**

---

## Dashboard Overview

The main dashboard provides at-a-glance codebase health:

- **Risk Heatmap** — Module risk distribution
- **Risk Trend** — Historical tracking over time
- **Repository Health** — Scores per repository
- **Language Breakdown** — Language distribution (including COBOL/Fortran)

---

## Legacy Language Analyzer

> **Dashboard → Legacy Analyzer** (sidebar, under "Intelligence")

### Language Detection

1. Paste COBOL, Fortran, PL/I, or RPG code
2. Click **"Analyze Code"**
3. System auto-detects language by keyword matching
4. View structural analysis results

### Supported Detections

| Language | Key Patterns |
|---|---|
| COBOL | IDENTIFICATION DIVISION, PROGRAM-ID, PERFORM, COPY, PIC |
| Fortran | PROGRAM, SUBROUTINE, FUNCTION, IMPLICIT NONE |
| PL/I | PROCEDURE, DECLARE, DCL, BEGIN/END |
| RPG | DCL-S, DCL-DS, BEGSR, CHAIN, READ |

### Analysis Outputs

- GO TO statement count, PERFORM calls, CALL statements
- Y2K-era date fields, missing END-IF scoping
- Modernization recommendations with confidence scores

---

## Security Analysis

CFIP detects security threats automatically during code scanning:

| Category | Patterns Detected |
|---|---|
| **SQL Injection** | String concatenation in SQL queries |
| **XSS** | innerHTML, dangerouslySetInnerHTML |
| **Hardcoded Secrets** | Passwords, API keys, tokens, AWS keys |
| **Command Injection** | os.system(), subprocess with shell=True |
| **Insecure Deserialization** | pickle.loads, yaml.load |
| **COBOL-Specific** | GO TO spaghetti, Y2K dates, missing error handling |

---

## AI Copilot

> **Dashboard → AI Copilot**

Chat with your codebase using natural language:

1. Select model: **Ollama (local)**, **OpenAI**, or **Anthropic**
2. Ask questions about code structure, dependencies, risks
3. Responses use ChromaDB RAG for full repository context

### Setup for Local AI

```bash
ollama serve
ollama pull gemma3:latest
ollama pull bge-m3:latest
```

No data leaves your network when using Ollama.

---

## Settings

### Git Integration
- GitHub / GitHub Enterprise
- GitLab (cloud + self-hosted)
- Bitbucket Server
- Azure DevOps

### AI Models
- **Ollama** — Local, air-gapped (default)
- **OpenAI GPT-4o** — Cloud, requires API key
- **Anthropic Claude 3.5** — Cloud, requires API key

### Risk Thresholds
- Critical/High/Medium/Low boundaries
- Complexity and coverage minimums

---

## Product Tour

Click the **📖 book icon** in the dashboard header. The tour covers:
1. Dashboard overview
2. Repository scanning
3. AI Copilot
4. Engineering Insights
5. Legacy Language Analyzer
6. AI Remediation
7. Governance

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `docker compose up` fails | Ensure Docker Desktop is running |
| Ollama not responding | Check: `docker compose logs ollama` |
| Build fails | `npm install --legacy-peer-deps && npm run build` |
| Architecture diagram missing | Verify `public/architecture-diagram.png` exists |
| Legacy Analyzer empty | Check seed-data.ts exports |
| Engine 502 | `docker compose restart cfip-app` |
| ChromaDB unhealthy | `docker compose restart chromadb` |

### Docker Commands

```bash
docker compose up -d          # Start stack
docker compose logs -f        # View logs
docker compose down           # Stop
docker compose down -v        # Stop + delete data
docker compose restart        # Restart all
```
