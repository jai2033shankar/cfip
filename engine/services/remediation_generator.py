"""
Remediation Generator — Uses AI/rules to suggest actionable refactoring/security steps.
"""

from typing import List, Dict
import random

class RemediationGenerator:
    def __init__(self):
        self.categories = ['architecture', 'security', 'performance', 'reliability', 'maintenance']
        
    def generate_from_risks(self, risks: List[Dict]) -> List[Dict]:
        """Convert identified risks into actionable AI remediation suggestions."""
        suggestions = []
        
        for idx, risk in enumerate(risks[:10]):  # Limit to top 10 for demo/performance
            severity = risk.get('severity', 'medium')
            risk_type = risk.get('type', 'General')
            node_id = risk.get('node_id', 'unknown')
            
            # Map risk severity to effort/reduction 
            effort = 'high' if severity == 'critical' else ('medium' if severity == 'high' else 'low')
            effort_days = random.randint(10, 30) if effort == 'high' else (random.randint(4, 10) if effort == 'medium' else random.randint(1, 4))
            reduction = random.randint(25, 45) if severity == 'critical' else random.randint(10, 25)
            
            category = 'refactoring'
            if 'Security' in risk_type: category = 'security'
            elif 'Performance' in risk_type: category = 'performance'
            elif 'Coupling' in risk_type or 'Architecture' in risk_type: category = 'architecture'
            elif 'Compliance' in risk_type: category = 'compliance'
            
            sug = {
                "id": f"rem-{idx+1}-{node_id}",
                "title": f"Refactor / Secure {risk.get('label', 'Component')}",
                "category": category,
                "confidence": random.randint(80, 99),
                "riskReduction": reduction,
                "effort": effort,
                "effortDays": effort_days,
                "description": risk.get('description', '') + f" \n{risk.get('recommendation', 'Address identified technical debt.')}",
                "affectedFiles": [node_id.split('/')[-1] if '/' in node_id else node_id],
                "pattern": risk.get('recommendation', 'General Refactoring').split('.')[0],
                "priority": idx + 1
            }
            suggestions.append(sug)
            
        return suggestions
