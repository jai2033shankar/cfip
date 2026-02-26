"""
Business Mapper — Maps code elements to BFSI business capabilities.
Aligns with BIAN (Banking Industry Architecture Network) taxonomy.
"""

import re
from typing import Optional, List, Dict
import random
import uuid

# BIAN-aligned business capability taxonomy for BFSI
BIAN_TAXONOMY = {
    "Payment Processing": {
        "keywords": ["payment", "pay", "transfer", "remit", "settlement", "clearing", "swift", "sepa", "ach", "wire"],
        "domain": "Operations",
        "description": "End-to-end payment processing including routing, clearing, and settlement across multiple payment rails.",
        "criticality": "critical",
    },
    "AML Compliance": {
        "keywords": ["aml", "anti-money", "laundering", "sanctions", "screening", "suspicious", "sar", "ctr", "fincen"],
        "domain": "Compliance",
        "description": "Anti-money laundering screening, transaction monitoring, suspicious activity detection, and regulatory reporting.",
        "criticality": "critical",
    },
    "Customer Onboarding": {
        "keywords": ["kyc", "know your customer", "identity", "verification", "onboard", "customer_verification", "id_check"],
        "domain": "Customer Management",
        "description": "KYC verification, identity validation, risk profiling, and customer account creation workflows.",
        "criticality": "high",
    },
    "Treasury Operations": {
        "keywords": ["treasury", "liquidity", "cash_management", "forex", "fx", "currency", "funding"],
        "domain": "Operations",
        "description": "Cash management, liquidity forecasting, FX operations, and interbank settlement processes.",
        "criticality": "high",
    },
    "Trade Processing": {
        "keywords": ["trade", "order", "execution", "matching", "settlement", "clearing", "position", "portfolio"],
        "domain": "Capital Markets",
        "description": "Trade capture, matching, confirmation, settlement, and lifecycle management for equities, bonds, and derivatives.",
        "criticality": "high",
    },
    "Regulatory Reporting": {
        "keywords": ["regulatory", "report", "basel", "compliance", "filing", "disclosure", "audit", "regulator"],
        "domain": "Compliance",
        "description": "Basel III/IV capital adequacy, liquidity coverage ratio, net stable funding ratio, and stress testing reports.",
        "criticality": "critical",
    },
    "Financial Accounting": {
        "keywords": ["ledger", "accounting", "journal", "posting", "debit", "credit", "balance_sheet", "gl", "chart_of_accounts"],
        "domain": "Finance",
        "description": "General ledger management, chart of accounts, journal entries, and financial statement generation.",
        "criticality": "critical",
    },
    "Access Control": {
        "keywords": ["auth", "authentication", "authorization", "rbac", "permission", "role", "session", "mfa", "login"],
        "domain": "Security",
        "description": "Authentication, authorization, role-based access control, session management, and multi-factor authentication.",
        "criticality": "high",
    }
}


class BusinessMapper:
    """Maps code elements to BFSI business capabilities using BIAN taxonomy."""

    def __init__(self):
        self.taxonomy = BIAN_TAXONOMY

    def map_to_capabilities(self, parsed_nodes: list) -> list:
        """Map parsed code nodes to top-level business capabilities for the dashboard."""
        capabilities = {}

        for node in parsed_nodes:
            cap_match = self._find_capability(node)
            if cap_match:
                cap_name = cap_match["name"]
                if cap_name not in capabilities:
                    capabilities[cap_name] = {
                        "id": f"bc-{uuid.uuid4().hex[:8]}",
                        "name": cap_name,
                        "domain": cap_match["domain"],
                        "description": cap_match["description"],
                        "modules": set(),
                        "riskLevel": cap_match["criticality"],
                        "coverage": random.randint(40, 95), # Simulated coverage
                        "healthScore": random.randint(50, 98), # Simulated health
                    }
                
                # Add module name without duplication
                mod_name = node.get("label", node.get("id"))
                capabilities[cap_name]["modules"].add(mod_name)

        # Convert sets to lists
        result = []
        for cap in capabilities.values():
            cap["modules"] = list(cap["modules"])[:5] # Limit to top 5 module names for display
            result.append(cap)
            
        return result

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
                    if keyword in node.get("label", "").lower():
                        score += 2

            if score > best_score:
                best_score = score
                best_match = {
                    "name": cap_name,
                    "domain": cap_info["domain"],
                    "description": cap_info["description"],
                    "criticality": cap_info["criticality"]
                }

        return best_match if best_score > 0 else None
