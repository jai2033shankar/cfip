"""
Risk Scorer — Calculates risk severity based on graph metrics and code analysis.
"""

import networkx as nx
from typing import Optional


class RiskScorer:
    """Scores risk for nodes in the dependency graph."""

    def __init__(self):
        self.thresholds = {
            "critical_downstream": 40,
            "high_downstream": 20,
            "medium_downstream": 5,
            "critical_complexity": 40,
            "high_complexity": 25,
        }

    def score_all(self, graph_data: dict) -> list:
        """Score all nodes in the graph."""
        risks = []
        for node in graph_data.get("nodes", []):
            risk = self._score_node(node, graph_data)
            if risk:
                risks.append(risk)
        return sorted(risks, key=lambda r: {"critical": 0, "high": 1, "medium": 2, "low": 3}[r["severity"]])

    def _score_node(self, node: dict, graph_data: dict) -> Optional[dict]:
        """Score a single node."""
        downstream = node.get("downstream_count", 0)
        complexity = node.get("complexity", 0)

        severity = self._determine_severity(downstream, complexity)
        if severity == "low" and complexity < 5:
            return None  # Skip trivial nodes

        risk_type = self._determine_risk_type(node, complexity)

        return {
            "id": f"risk-{node['id']}",
            "node_id": node["id"],
            "label": node.get("label", ""),
            "severity": severity,
            "type": risk_type,
            "downstream_count": downstream,
            "complexity": complexity,
            "description": self._generate_description(node, severity, downstream, complexity),
            "recommendation": self._generate_recommendation(risk_type, severity),
        }

    def _determine_severity(self, downstream: int, complexity: int) -> str:
        if downstream >= self.thresholds["critical_downstream"] or complexity >= self.thresholds["critical_complexity"]:
            return "critical"
        elif downstream >= self.thresholds["high_downstream"] or complexity >= self.thresholds["high_complexity"]:
            return "high"
        elif downstream >= self.thresholds["medium_downstream"]:
            return "medium"
        return "low"

    def _determine_risk_type(self, node: dict, complexity: int) -> str:
        if complexity > 30:
            return "Complexity"
        if node.get("downstream_count", 0) > 30:
            return "High Coupling"
        if node.get("type") == "function":
            return "Function Risk"
        return "General Risk"

    def _generate_description(self, node: dict, severity: str, downstream: int, complexity: int) -> str:
        label = node.get("label", "Unknown")
        if severity == "critical":
            return f"{label} has {downstream} downstream dependencies and cyclomatic complexity of {complexity}. Changes here have cascading impact across the system."
        elif severity == "high":
            return f"{label} has significant downstream impact ({downstream} nodes) with elevated complexity ({complexity}). Requires careful review."
        return f"{label} has {downstream} downstream dependencies. Moderate risk."

    def _generate_recommendation(self, risk_type: str, severity: str) -> str:
        recs = {
            "Complexity": "Consider refactoring into smaller, focused functions. Apply Single Responsibility Principle.",
            "High Coupling": "Introduce abstraction layer or interface to reduce tight coupling. Consider event-driven architecture.",
            "Function Risk": "Add comprehensive unit tests. Implement input validation and error handling.",
            "General Risk": "Review code for maintainability. Add documentation and test coverage.",
        }
        return recs.get(risk_type, "Review and address identified concerns.")

    def simulate_impact(self, node_id: str, graph: Optional[nx.DiGraph]) -> dict:
        """Simulate impact of changing a node."""
        if not graph or not graph.has_node(node_id):
            return {"error": "Node not found in graph"}

        descendants = list(nx.descendants(graph, node_id))
        ancestors = list(nx.ancestors(graph, node_id))

        impacts = []
        for desc in descendants:
            data = graph.nodes[desc]
            impacts.append({
                "node_id": desc,
                "label": data.get("label", desc),
                "type": "downstream",
                "severity": "high" if len(list(nx.descendants(graph, desc))) > 10 else "medium",
            })

        return {
            "changed_node": node_id,
            "total_downstream": len(descendants),
            "total_upstream": len(ancestors),
            "impacts": impacts[:20],
            "risk_summary": {
                "blast_radius": len(descendants),
                "severity": "critical" if len(descendants) > 30 else "high" if len(descendants) > 10 else "medium",
            },
        }

    def update_thresholds(self, new_thresholds: dict):
        """Update risk scoring thresholds."""
        self.thresholds.update(new_thresholds)
