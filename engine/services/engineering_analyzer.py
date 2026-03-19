"""
Engineering Analyzer — Scans the codebase for DevOps, CI/CD, and Architecture drift rules.
"""

from typing import List, Dict

class EngineeringAnalyzer:
    def __init__(self):
        # Generic Engineering domains
        self.keywords = {
            'ci_cd': ['pipeline', 'github/workflows', 'jenkins', 'gitlab-ci', 'circleci', 'action', 'deploy', 'build'],
            'infrastructure': ['terraform', 'docker', 'kubernetes', 'helm', 'ansible', 'cloudformation'],
            'auth_security': ['jwt', 'oauth', 'middleware', 'passport', 'auth', 'cors', 'csrf'],
            'database_schema': ['migration', 'prisma', 'schema', 'sequelize', 'typeorm', 'alembic']
        }

    def analyze_domain(self, nodes: List[Dict]) -> List[Dict]:
        """Map nodes to critical generic engineering risk profiles."""
        domain_impacts = []
        
        for node in nodes:
            label = node.get('label', '').lower()
            filepath = node.get('file', '').lower()
            risk_level = node.get('risk', 'low')
            
            # Identify matched domain based on file paths or function names
            matched_domain = None
            for domain, kws in self.keywords.items():
                if any(kw in filepath for kw in kws) or any(kw in label for kw in kws):
                    matched_domain = domain
                    break
                    
            if matched_domain and risk_level in ['critical', 'high']:
                desc = self._get_engineering_risk_description(matched_domain, label, risk_level)
                domain_impacts.append({
                    "id": f"eng-{node['id']}",
                    "node_id": node['id'],
                    "domain": matched_domain.replace('_', ' ').title(),
                    "impact_type": f"{matched_domain.replace('_', ' ').title()} Configuration Risk",
                    "severity": risk_level,
                    "description": desc
                })
                
        return domain_impacts

    def _get_engineering_risk_description(self, domain: str, node_name: str, risk: str) -> str:
        if domain == 'ci_cd':
            return f"Pipeline vulnerability in '{node_name}'. A {risk} risk in deployment config may expose secrets or halt the CI/CD flow."
        elif domain == 'infrastructure':
            return f"Infrastructure drift detected in '{node_name}'. Affects environment stability and IAC configurations."
        elif domain == 'auth_security':
            return f"Security middleware exposure in '{node_name}'. {risk.capitalize()} vulnerabilities here directly impact session or token validation."
        elif domain == 'database_schema':
            return f"Database Schema risk: Unsafe migration or ORM access in '{node_name}' could result in data loss or locking."
        return f"Architectural drift within '{domain}' domain caused by high complexity."
