"""
CFIP Analysis Engine — FastAPI Backend
Performs AST parsing, dependency graph building, risk scoring, and code scanning.
Enterprise Edition v2.0.0
"""

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import json

from services.ast_parser import ASTParser
from services.graph_builder import CodeGraphBuilder
from services.risk_scorer import RiskScorer
from services.code_scanner import CodeScanner
from services.bfsi_analyzer import BFSIAnalyzer
from services.engineering_analyzer import EngineeringAnalyzer
from services.business_mapper import BusinessMapper
from services.remediation_generator import RemediationGenerator
from services.vector_store import VectorStore
from services.llm_agent import LLMAgent
from services.github_client import GitHubClient
from services.tenant_manager import TenantManager

app = FastAPI(
    title="CFIP Analysis Engine",
    description="Code Forensics Intelligence Platform — Enterprise Edition",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://cfip-app:3000",
        "http://127.0.0.1:3000",
        os.getenv("CFIP_CORS_ORIGIN", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service instances
parser = ASTParser()
graph_builder = CodeGraphBuilder()
risk_scorer = RiskScorer()
code_scanner = CodeScanner()
github_client = GitHubClient()
bfsi_analyzer = BFSIAnalyzer()
engineering_analyzer = EngineeringAnalyzer()
remediation_generator = RemediationGenerator()
tenant_manager = TenantManager()
business_mapper = BusinessMapper()

# AI & RAG Components
vector_store = VectorStore()
llm_agent = LLMAgent()


# --- Request/Response Models ---

class ScanRequest(BaseModel):
    directory: Optional[str] = None
    github_url: Optional[str] = None
    github_pat: Optional[str] = None


class AnalysisResponse(BaseModel):
    nodes: list
    edges: list
    risks: list
    metrics: dict
    business_mappings: list
    remediations: list


class ChatRequest(BaseModel):
    query: str
    history: list = []
    provider: str = "ollama"


class GitConnectRequest(BaseModel):
    provider: str = "github"  # github, gitlab, bitbucket, azure_devops
    base_url: str = "https://api.github.com"
    pat: str = ""
    ssh_key: Optional[str] = None


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "cfip-analysis-engine",
        "version": "2.0.0",
        "ollama": os.getenv("OLLAMA_HOST", "http://localhost:11434"),
        "chromadb": os.getenv("CHROMADB_HOST", "http://localhost:8000"),
    }


@app.post("/api/analyze")
def analyze_codebase(request: ScanRequest, x_tenant_id: str = Header(default="tenant_freemium")):
    """Full codebase analysis pipeline"""
    
    if not tenant_manager.check_repo_limit(x_tenant_id):
        raise HTTPException(status_code=403, detail="Repository limit reached for your subscription tier.")
        
    target_dir = request.directory

    if request.github_url and request.github_pat:
        target_dir = github_client.clone_repo(request.github_url, request.github_pat)

    if not target_dir or not os.path.exists(target_dir):
        return {"error": "Invalid directory path"}

    # Step 1: Scan files
    scan_result = code_scanner.scan_directory(target_dir)

    # Step 2: Parse AST for each file
    all_nodes = []
    for file_info in scan_result["files"]:
        parsed = parser.parse_file(file_info["path"], file_info["language"])
        all_nodes.extend(parsed)

    # Step 3: Build dependency graph
    graph_data = graph_builder.build_graph(all_nodes)

    # Step 4: Score risks
    risks = risk_scorer.score_all(graph_data)
    
    # Step 5: BFSI & Gen-Eng domain analysis
    risks.extend(bfsi_analyzer.analyze_domain(all_nodes))
    risks.extend(engineering_analyzer.analyze_domain(all_nodes))
    
    # Step 6: Generate AI Remediations based on risks
    remediations = remediation_generator.generate_from_risks(risks)

    # Step 7: Map to business capabilities
    mappings = business_mapper.map_to_capabilities(all_nodes)
    
    # Step 8: Background RAG Indexing (Send to ChromaDB)
    node_chunks = [
        {"filepath": node.get("file", "unknown"), "content": f"Node: {node.get('label')}\nType: {node.get('type')}\nCalls: {node.get('calls')}\nComplexity: {node.get('complexity')}"}
        for node in all_nodes
    ]
    try:
        vector_store.index_repository(node_chunks)
    except Exception:
        pass  # ChromaDB may not be available in demo mode
    
    # Increment usage counter
    tenant_manager.increment_repo_count(x_tenant_id)

    return AnalysisResponse(
        nodes=graph_data["nodes"],
        edges=graph_data["edges"],
        risks=risks,
        metrics=scan_result["metrics"],
        business_mappings=mappings,
        remediations=remediations,
    )

@app.post("/api/chat")
async def chat_with_copilot(req: ChatRequest, x_tenant_id: str = Header(default="tenant_freemium")):
    """Answers user queries using Ollama + retrieved codebase context."""
    
    tenant = tenant_manager.get_tenant(x_tenant_id)
    
    # 1. Retrieve RAG context from ChromaDB
    context = vector_store.retrieve_context(req.query, k=5)
    
    # 2. Format history
    messages = req.history.copy()
    if not messages or messages[-1]["role"] != "user" or messages[-1]["content"] != req.query:
        messages.append({"role": "user", "content": req.query})
        
    # 3. Call local Gemma3 model or Cloud LLM if configured
    response = llm_agent.chat(messages, context=context, tenant=tenant, provider=req.provider)
    
    return {"message": response}

# --- ADMIN ROUTES ---

class TierUpdateRequest(BaseModel):
    tenant_id: str
    tier: str

class ApiKeyUpdateRequest(BaseModel):
    tenant_id: str
    provider: str
    api_key: str

@app.get("/api/admin/tenants")
def get_all_tenants():
    return tenant_manager.get_all_tenants()

@app.post("/api/admin/tenants/tier")
def update_tenant_tier(req: TierUpdateRequest):
    success = tenant_manager.update_tenant_tier(req.tenant_id, req.tier)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update tenant tier")
    return {"status": "success"}

@app.post("/api/admin/tenants/apikey")
def update_tenant_apikey(req: ApiKeyUpdateRequest):
    success = tenant_manager.update_api_keys(req.tenant_id, req.provider, req.api_key)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update API key")
    return {"status": "success"}
    
@app.get("/api/tenant/{tenant_id}")
def get_tenant_info(tenant_id: str):
    return tenant_manager.get_tenant(tenant_id)


@app.post("/api/scan")
def scan_directory(request: ScanRequest):
    """Quick scan without full analysis"""
    if not request.directory or not os.path.exists(request.directory):
        return {"error": "Invalid directory"}
    return code_scanner.scan_directory(request.directory)


@app.post("/api/parse")
def parse_file(filepath: str):
    """Parse a single file"""
    if not os.path.exists(filepath):
        return {"error": "File not found"}
    ext = os.path.splitext(filepath)[1]
    lang = {".py": "python", ".js": "javascript", ".ts": "typescript", ".java": "java"}.get(ext, "unknown")
    return parser.parse_file(filepath, lang)


@app.post("/api/impact")
def simulate_impact(node_id: str):
    """Simulate impact of changing a specific node"""
    return risk_scorer.simulate_impact(node_id, graph_builder.current_graph)


@app.post("/api/github/clone")
def clone_repository(url: str, pat: str):
    """Clone a GitHub repository for analysis"""
    result = github_client.clone_repo(url, pat)
    return {"directory": result, "status": "cloned"}


@app.post("/api/git/connect")
def validate_git_connection(req: GitConnectRequest):
    """Validate enterprise Git provider connection."""
    import requests as req_lib
    
    headers = {"Authorization": f"token {req.pat}"}
    
    provider_urls = {
        "github": f"{req.base_url}/user",
        "gitlab": f"{req.base_url}/api/v4/user",
        "bitbucket": f"{req.base_url}/2.0/user",
        "azure_devops": f"{req.base_url}/_apis/projects?api-version=7.0",
    }
    
    url = provider_urls.get(req.provider, f"{req.base_url}/user")
    
    try:
        if req.provider == "azure_devops":
            import base64
            auth = base64.b64encode(f":{req.pat}".encode()).decode()
            headers = {"Authorization": f"Basic {auth}"}
        elif req.provider == "gitlab":
            headers = {"PRIVATE-TOKEN": req.pat}
            
        response = req_lib.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            user_info = {
                "github": lambda d: {"username": d.get("login"), "name": d.get("name")},
                "gitlab": lambda d: {"username": d.get("username"), "name": d.get("name")},
                "bitbucket": lambda d: {"username": d.get("username"), "name": d.get("display_name")},
                "azure_devops": lambda d: {"username": "connected", "name": f"{d.get('count', 0)} projects"},
            }
            info = user_info.get(req.provider, lambda d: {})(data)
            return {"status": "connected", "provider": req.provider, **info}
        else:
            return {"status": "error", "message": f"Authentication failed (HTTP {response.status_code})"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/api/status")
def system_status():
    """Check connectivity to all dependent services."""
    import requests as req_lib
    
    status = {
        "engine": "running",
        "ollama": "disconnected",
        "chromadb": "disconnected",
    }
    
    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    chromadb_host = os.getenv("CHROMADB_HOST", "http://localhost:8000")
    
    try:
        r = req_lib.get(f"{ollama_host}/api/tags", timeout=3)
        if r.status_code == 200:
            models = [m["name"] for m in r.json().get("models", [])]
            status["ollama"] = "connected"
            status["ollama_models"] = models
    except Exception:
        pass
    
    try:
        r = req_lib.get(f"{chromadb_host}/api/v1/heartbeat", timeout=3)
        if r.status_code == 200:
            status["chromadb"] = "connected"
    except Exception:
        pass
    
    return status


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
