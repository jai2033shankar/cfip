# CFIP End-to-End Demo Guide

Welcome to the CFIP (Code Forensics Intelligence Platform) Demo Guide! This document walks you through how to showcase the platform's capabilities effectively to stakeholders, highlighting the core value propositions: **Risk Prediction, Architectural Understanding, and AI-driven Code Intelligence using Local LLMs.**

---

## 🚀 Environment Setup

Before starting the demo, ensure the local environment is properly running. CFIP is designed for air-gapped, on-premise environments, meaning no code leaves the machine.

### 1. Start Local LLMs (Ollama)
Open a terminal and ensure your local Ollama instance is serving the required models:
```bash
ollama serve
# Ensure these models are pulled:
# ollama pull gemma3:latest (For AI Copilot Chat)
# ollama pull bge-m3:latest (For Vector Embeddings)
```

### 2. Start the Python Analysis Engine
This backend handles AST parsing, git cloning, graph building, and RAG vector storage.
```bash
cd engine
source venv/bin/activate
uvicorn main:app --port 8001 --reload
```

### 3. Start the Next.js Frontend
```bash
cd cfip
npm run dev
# The app will be available at http://localhost:3000
```

---

## 🎭 The Demo Flow

### Step 1: The Persona Login
1. Open your browser and navigate to `http://localhost:3000`.
2. You will see the **CFIP Landing Page**, emphasizing its integration for regulated BFSI industries.
3. Click **"Enter Platform"**.
4. The login screen features predefined personas. For the demo, select the **Admin** role (Alex Morgan) and click **Sign In**.

### Step 2: The Command Center & Scanning
1. You are now in the **Command Center**.
2. Notice the "Repository Context" section in the center. The demo is configured to target `https://github.com/jai2033shankar/aero-copilot` by default.
3. Click the **"Scan Repository"** button.
   - *Talking Point:* "Behind the scenes, our Python engine is securely cloning the repo locally, parsing its AST (Abstract Syntax Tree), generating NetworkX dependency graphs, and calculating technical/architectural risk."
4. Wait for the loading animation to finish. The KPI cards will suddenly populate with data (e.g., Critical Risks found, Node Count, Lines of Code).

### Step 3: Product Tour (Self-Guided)
To quickly acquaint the audience with the UI, click the **"Documentation / Start Tour"** button (the open book icon) in the top-right header navigation bar.
*   This triggers the interactive `react-joyride` tour.
*   Click through the tooltips to highlight the Sidebar, Search, AI Copilot, and Engineering Insights.

### Step 4: Visualizing The Code (Static Analysis)
1. **Code Explorer**: Navigate here via the left sidebar. Show how users can browse the file tree.
   - *Key takeaway:* "We overlay security/risk data directly on top of the raw code files."
2. **Dependency Graph**: Open this tab to show the `Cytoscape.js` interactive node map.
   - *Talking Point:* "This isn't just a static picture. It's a live dependency mesh reverse-engineered from the code, allowing you to trace exactly how a single vulnerability cascades through the system."
3. **Architecture View & Risk/Impact**: Show the system layers and the simulated "What-If" blast radius table.

### Step 5: AI Intelligence (Gen-AI & RAG)
This is the pinnacle of the demo, proving that the codebase is completely embedded into a localized AI brain.

1. Navigate to **Engineering Insights**.
   - Show the dynamic categorization of DevOps, CI/CD, and Auth Security configurations automatically flagged by the engine without relying on basic regex.
2. Navigate to the **AI Copilot** tab.
   - *Talking Point:* "We've built a persistent Vector Database (`ChromaDB`) using `bge-m3` embeddings. Now, we can talk securely to `gemma3:latest` about our private codebase."
3. Type the following prompt and hit send:
   > *"What are the primary tech stack components of this repository based on the code provided?"*
4. Watch the streaming response from the local LLM.

### Step 6: Governance
1. Click on **Governance & Audit**.
2. Show the Enterprise Audit Trail at the bottom.
3. It actively logs actions, like when you just initiated the repository scan. This proves compliance and traceability for regulated workloads.

---

## 🛑 Troubleshooting

*   **API Error on Scan:** Ensure `uvicorn main:app --port 8001` is actively running in the `engine` directory.
*   **LLM Connection Error:** Ensure `ollama` is running and the models matched in `llm_agent.py` and `vector_store.py` are actually pulled locally.
*   **Blank Screen on Load:** If modifying React components, check the Next.js terminal for compilation warnings, or simple browser cache clear.
