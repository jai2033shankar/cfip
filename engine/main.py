"""
CFIP Analysis Engine — FastAPI Backend
Performs AST parsing, dependency graph building, risk scoring, and code scanning.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

from services.ast_parser import ASTParser
from services.graph_builder import CodeGraphBuilder
from services.risk_scorer import RiskScorer
from services.code_scanner import CodeScanner
from services.github_client import GitHubClient
from services.business_mapper import BusinessMapper

app = FastAPI(
    title="CFIP Analysis Engine",
    description="Code Forensics Intelligence Platform — Analysis Microservice",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
business_mapper = BusinessMapper()


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


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "cfip-analysis-engine", "version": "1.0.0"}


@app.post("/api/analyze")
def analyze_codebase(request: ScanRequest):
    """Full codebase analysis pipeline"""
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

    # Step 5: Map to business capabilities
    mappings = business_mapper.map_to_capabilities(all_nodes)

    return AnalysisResponse(
        nodes=graph_data["nodes"],
        edges=graph_data["edges"],
        risks=risks,
        metrics=scan_result["metrics"],
        business_mappings=mappings,
    )


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
