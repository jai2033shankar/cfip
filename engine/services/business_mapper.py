"""
Business Mapper — Maps code elements to BFSI business capabilities.
Aligns with BIAN (Banking Industry Architecture Network) taxonomy.
"""

import re
from typing import Optional


# BIAN-aligned business capability taxonomy for BFSI
BIAN_TAXONOMY = {
    "Payment Processing": {
        "keywords": ["payment", "pay", "transfer", "remit", "settlement", "clearing", "swift", "sepa", "ach", "wire"],
        "domain": "Operations",
        "criticality": "critical",
    },
    "AML Compliance": {
        "keywords": ["aml", "anti-money", "laundering", "sanctions", "screening", "suspicious", "sar", "ctr", "fincen"],
        "domain": "Compliance",
        "criticality": "critical",
    },
    "KYC Onboarding": {
        "keywords": ["kyc", "know your customer", "identity", "verification", "onboard", "customer_verification", "id_check"],
        "domain": "Customer Management",
        "criticality": "high",
    },
    "Treasury Operations": {
        "keywords": ["treasury", "liquidity", "cash_management", "forex", "fx", "currency", "funding"],
        "domain": "Operations",
        "criticality": "high",
    },
    "Trade Processing": {
        "keywords": ["trade", "order", "execution", "matching", "settlement", "clearing", "position", "portfolio"],
        "domain": "Capital Markets",
        "criticality": "high",
    },
    "Regulatory Reporting": {
        "keywords": ["regulatory", "report", "basel", "compliance", "filing", "disclosure", "audit", "regulator"],
        "domain": "Compliance",
        "criticality": "critical",
    },
    "Financial Accounting": {
        "keywords": ["ledger", "accounting", "journal", "posting", "debit", "credit", "balance_sheet", "gl", "chart_of_accounts"],
        "domain": "Finance",
        "criticality": "critical",
    },
    "Access Control": {
        "keywords": ["auth", "authentication", "authorization", "rbac", "permission", "role", "session", "mfa", "login"],
        "domain": "Security",
        "criticality": "high",
    },
    "Risk Management": {
        "keywords": ["risk", "credit_risk", "market_risk", "operational_risk", "var", "stress_test", "exposure"],
        "domain": "Risk",
        "criticality": "high",
    },
    "Customer Management": {
        "keywords": ["customer", "client", "account", "profile", "preference", "contact", "crm"],
        "domain": "Customer Management",
        "criticality": "medium",
    },
    "Fraud Detection": {
        "keywords": ["fraud", "detect", "anomaly", "suspicious", "alert", "monitoring", "pattern"],
        "domain": "Security",
        "criticality": "critical",
    },
    "Notification Services": {
        "keywords": ["notification", "email", "sms", "push", "alert", "message", "communication"],
        "domain": "Infrastructure",
        "criticality": "low",
    },
}


class BusinessMapper:
    """Maps code elements to BFSI business capabilities using BIAN taxonomy."""

    def __init__(self):
        self.taxonomy = BIAN_TAXONOMY

    def map_to_capabilities(self, parsed_nodes: list) -> list:
        """Map parsed code nodes to business capabilities."""
        mappings = []

        for node in parsed_nodes:
            capability = self._find_capability(node)
            if capability:
                mappings.append({
                    "node_id": node["id"],
                    "node_label": node.get("label", ""),
                    "node_type": node.get("type", ""),
                    "file": node.get("file", ""),
                    "business_capability": capability["name"],
                    "domain": capability["domain"],
                    "criticality": capability["criticality"],
                    "confidence": capability["confidence"],
                })

        return mappings

    def _find_capability(self, node: dict) -> Optional[dict]:
        """Find the best matching business capability for a node."""
        search_text = " ".join([
            node.get("label", ""),
            node.get("file", ""),
            " ".join(node.get("calls", [])) if "calls" in node else "",
        ]).lower()

        best_match = None
        best_score = 0

        for cap_name, cap_info in self.taxonomy.items():
            score = 0
            for keyword in cap_info["keywords"]:
                if keyword in search_text:
                    score += 1
                    # Exact function name match gives higher weight
                    if keyword in node.get("label", "").lower():
                        score += 2

            if score > best_score:
                best_score = score
                best_match = {
                    "name": cap_name,
                    "domain": cap_info["domain"],
                    "criticality": cap_info["criticality"],
                    "confidence": min(95, 50 + score * 15),
                }

        return best_match if best_score > 0 else None

    def get_capability_coverage(self, mappings: list) -> dict:
        """Calculate coverage of business capabilities."""
        coverage = {}
        for cap_name in self.taxonomy:
            mapped_nodes = [m for m in mappings if m["business_capability"] == cap_name]
            coverage[cap_name] = {
                "mapped_nodes": len(mapped_nodes),
                "domain": self.taxonomy[cap_name]["domain"],
                "criticality": self.taxonomy[cap_name]["criticality"],
            }
        return coverage

    def generate_ontology_report(self, mappings: list) -> dict:
        """Generate a business ontology report."""
        domains = {}
        for mapping in mappings:
            domain = mapping["domain"]
            if domain not in domains:
                domains[domain] = {"capabilities": {}, "total_nodes": 0}

            cap = mapping["business_capability"]
            if cap not in domains[domain]["capabilities"]:
                domains[domain]["capabilities"][cap] = []
            domains[domain]["capabilities"][cap].append(mapping["node_label"])
            domains[domain]["total_nodes"] += 1

        return {"domains": domains, "total_mappings": len(mappings)}
