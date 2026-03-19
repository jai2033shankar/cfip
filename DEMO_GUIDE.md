# CFIP Demo Guide

> Enterprise step-by-step walkthrough for the Code Forensics Intelligence Platform.

---

## Prerequisites

| Requirement | Version | Install |
|---|---|---|
| Docker + Compose | 24+ | [docker.com](https://docker.com) |
| Git | 2.0+ | `brew install git` |
| Browser | Chrome/Edge | Latest |

---

## Quick Start (One Command)

```bash
git clone https://github.com/jai2033shankar/cfip.git
cd cfip
docker compose up -d
open http://localhost:3000
```

Wait ~60 seconds for services to start. Ollama will auto-pull models on first run.

---

## Demo Flow (15 min)

### 1. Landing Page (2 min)

1. Open `http://localhost:3000` — observe the professional landing page
2. Scroll to **Supported Technologies** — highlight COBOL, Fortran, PL/I, RPG alongside modern stacks
3. Scroll to **System Architecture** — show the 6-layer architecture diagram
4. Scroll to **Security & Compliance** — emphasize air-gapped, on-prem deployment
5. Click **"Launch Dashboard"**

### 2. Login (30 sec)

| Email | Password |
|---|---|
| `admin@cfip.io` | `admin123` |

### 3. Dashboard Overview (2 min)

1. Point out the **Risk Heatmap**, **Risk Trend**, and **Language Breakdown**
2. COBOL now shows at **14%** of the codebase
3. Show legacy repos in **Repository Health** cards

### 4. Product Tour (1 min)

1. Click the **📖 book icon** in the header
2. Walk through the guided tour — pause at **Legacy Language Analyzer** step
3. Show how each feature is highlighted

### 5. Legacy Analyzer ⭐ (5 min)

1. Click **"Legacy Analyzer"** in the sidebar (note **"New"** badge)
2. **Language Detection Tab:**
   - Show pre-loaded COBOL sample code
   - Click **"Analyze Code"** — observe language detection + keyword matching
   - Show **Structural Analysis**: GO TO count, Y2K date fields
3. **Legacy Repositories Tab:**
   - Show `core-batch-cobol` (health: 42) and `interest-calc-fortran` (health: 55)
   - Show the code structure table with complexity and test coverage
4. **Risk Analysis Tab:**
   - Walk through COBOL-specific risks with business impact
5. **Modernization Tab:**
   - Show AI modernization recommendations with confidence scores

### 6. Code Explorer (1 min)

- Browse file trees, show parsed COBOL structures

### 7. AI Copilot (2 min)

1. Navigate to **AI Copilot**
2. Select model provider (Local Ollama / OpenAI / Anthropic)
3. Ask: *"What are the main risks in our COBOL batch system?"*

### 8. Settings — Enterprise Git (1 min)

1. Navigate to **Settings → Enterprise Git Integration**
2. Show Git provider dropdown: GitHub, GitLab, Bitbucket, Azure DevOps
3. Show API Base URL field for self-hosted instances
4. Show connection test functionality

---

## Docker Commands Reference

```bash
# Start full stack
docker compose up -d

# View logs
docker compose logs -f cfip-app

# Stop
docker compose down

# Reset data
docker compose down -v
```

---

## Key Talking Points

- ✅ **One-command deployment** — `docker compose up -d`
- ✅ **Legacy-first** — COBOL, Fortran, PL/I, RPG
- ✅ **Enterprise Git** — GitHub, GitLab, Bitbucket, Azure DevOps
- ✅ **On-premise, air-gapped** — zero data exfiltration
- ✅ **Local AI** — Ollama for complete data privacy
- ✅ **Security analysis** — OWASP, secrets detection, XSS, command injection
- ✅ **No token limitations** — streaming + chunked LLM responses
