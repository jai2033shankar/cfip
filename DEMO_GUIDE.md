# CFIP Demo Guide

> Step-by-step walkthrough for demonstrating the Code Forensics Intelligence Platform.

---

## Pre-requisites

| Requirement | Version |
|---|---|
| Node.js  | 18+ |
| npm      | 9+  |
| Browser  | Chrome / Edge (latest) |

```bash
cd cfip
npm install
npm run dev
```

Navigate to `http://localhost:3000`

---

## Demo Flow

### 1. Landing Page (2 min)

1. Open the landing page — observe the hero section with key stats
2. Scroll to **Supported Technologies** — highlight **COBOL**, **Fortran**, **PL/I**, **RPG** alongside Java, Python, etc.
3. Scroll to **System Architecture** — show the 6-layer architecture diagram
4. Scroll to **Security & Compliance** — emphasize air-gapped, on-prem deployment
5. Click **"Launch Dashboard"**

### 2. Login (30 sec)

| Email | Password |
|---|---|
| `admin@cfip.io` | `admin123` |

### 3. Dashboard Overview (2 min)

1. Show the **Risk Heatmap** and **Risk Trend** charts
2. Point out the **Language Breakdown** — COBOL now shows at **14%** of the codebase
3. Open the **Repository Health** cards and show the legacy repos (core-batch-cobol, interest-calc-fortran)

### 4. Product Tour (1 min)

1. Click the **book icon** (📖) in the top-right header bar
2. Walk through the guided tour, pausing at the **"Legacy Language Analyzer"** step
3. Show how the tour highlights each feature in the sidebar

### 5. Legacy Language Analyzer — NEW ⭐ (5 min)

1. Click **"Legacy Analyzer"** in the sidebar (note the **"New"** badge)
2. **Language Detection Tab:**
   - Show the pre-loaded COBOL sample code in the textarea
   - Click **"Analyze Code"** — observe: language detected as COBOL, matched keywords highlighted
   - Show the **Structural Analysis** results: GO TO count, PERFORM calls, Y2K date fields
   - Scroll down to the **Supported Legacy Languages** cards
3. **Legacy Repositories Tab:**
   - Show the 2 legacy repositories: `core-batch-cobol` (health: 42) and `interest-calc-fortran` (health: 55)
   - Point out the risk profiles and low health scores
   - Show the **Legacy Code Structure** table with LOC, complexity, and test coverage
4. **Risk Analysis Tab:**
   - Walk through COBOL-specific risks: GO TO spaghetti, copybook sprawl, Y2K dates, missing VSAM error handling, hardcoded credentials
   - Highlight the **Business Impact** for each risk and estimated effort
5. **Modernization Tab:**
   - Show the 4 modernization recommendations with confidence scores and risk reduction percentages
   - Highlight: "Modernize COBOL Batch to Java Spring Batch" (78% confidence, 45% risk reduction)

### 6. Code Explorer (2 min)

1. Navigate to **Code Explorer** — show the file tree with COBOL files
2. Browse a COBOL file and show the parsed structure

### 7. Dependencies (2 min)

1. Navigate to **Dependencies** — show the knowledge graph
2. Filter to show COBOL module dependencies (TXNPROC → VALIDATE-TRANSACTION → ACCT-MASTER)

### 8. AI Copilot (2 min)

1. Navigate to **AI Copilot**
2. Ask: *"What are the main risks in our COBOL batch processing system?"*
3. Show the AI response using local Ollama inference

### 9. Settings (1 min)

1. Navigate to **Settings**
2. Show the AI configuration (Ollama local model)
3. Show scanning parameters

---

## Key Talking Points

- ✅ **Legacy-first platform** — COBOL, Fortran, PL/I, RPG first-class support
- ✅ **On-premise, air-gapped** — zero data leaves the network
- ✅ **AI-powered** — local LLM for code comprehension and remediation
- ✅ **BFSI-ready** — compliance, risk, and governance built in
- ✅ **Modernization** — actionable recommendations with confidence scoring

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `npm run dev` fails | Delete `node_modules` + `.next`, then `npm install && npm run dev` |
| Ollama not responding | `ollama serve` and pull models: `ollama pull gemma3:latest` |
| Architecture diagram missing | Ensure `public/architecture-diagram.png` exists |
| Legacy Analyzer empty | Check that `seed-data.ts` has `legacyRepositories` exports |
