"""
BFSI Analyzer — Maps code assets to regulated industry specific rules.
"""

from typing import List, Dict

class BFSIAnalyzer:
    def __init__(self):
        # BFSI domains: Payment, AML, Trade, Ledger, Reporting
        self.keywords = {
            'payment': ['pay', 'transaction', 'settle', 'checkout', 'route', 'card'],
            'aml': ['screen', 'sanction', 'kyc', 'alert', 'watchlist', 'money'],
            'trade': ['trade', 'order', 'match', 'book', 'execution', 'derivatives'],
            'ledger': ['ledger', 'account', 'post', 'entry', 'balance', 'credit', 'debit'],
            'reporting': ['report', 'regulatory', 'basel', 'lcr', 'audit', 'nsfr']
        }
        
    def analyze_domain(self, nodes: List[Dict]) -> Dict:
        """Map nodes to critical BFSI risk profiles based on keywords and metrics."""
        domain_impacts = []
        
        for node in nodes:
            name = node.get('label', '').lower()
            risk_level = node.get('risk', 'low')
            
            # Identify matched domain
            matched_domain = None
            for domain, kws in self.keywords.items():
                if any(kw in name for kw in kws):
                    matched_domain = domain
                    break
                    
            if matched_domain and risk_level in ['critical', 'high']:
                # Record a BFSI-specific impact marker
                desc = self._get_bfsi_risk_description(matched_domain, name, risk_level)
                domain_impacts.append({
                    "id": f"bfsi-{node['id']}",
                    "node_id": node['id'],
                    "domain": matched_domain.capitalize(),
                    "impact_type": f"{matched_domain.capitalize()} Integrity Risk",
                    "severity": risk_level,
                    "description": desc
                })
                
        return domain_impacts

    def _get_bfsi_risk_description(self, domain: str, node_name: str, risk: str) -> str:
        if domain == 'payment':
            return f"Potential loss of payment routing integrity in '{node_name}'. A {risk} risk here could disrupt daily settlements or leak PII."
        elif domain == 'aml':
            return f"Compliance vulnerability found in '{node_name}'. Affects real-time AML screening or sanctions list validation."
        elif domain == 'ledger':
            return f"Ledger consistency at risk due to '{node_name}'. {risk.capitalize()} vulnerability could lead to out-of-balance transaction postings."
        elif domain == 'reporting':
            return f"Regulatory exposure: Failure in '{node_name}' could breach Basel reporting SLAs, resulting in substantial fines."
        return f"Operational risk within the '{domain}' domain caused by high complexity or tight coupling in '{node_name}'."
