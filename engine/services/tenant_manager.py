import json
import os
from typing import Dict, Any, List

# A mock database file to store tenant information persistently for the demo
TENANTS_DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "tenants.json")

class TenantManager:
    def __init__(self):
        self._ensure_db()
        self.tenants = self._load()

    def _ensure_db(self):
        os.makedirs(os.path.dirname(TENANTS_DB_PATH), exist_ok=True)
        if not os.path.exists(TENANTS_DB_PATH):
            default_tenants = {
                "tenant_freemium": {
                    "id": "tenant_freemium",
                    "name": "Solo Developer (Free)",
                    "tier": "freemium",
                    "api_keys": {},
                    "repo_count": 0
                },
                "tenant_premium": {
                    "id": "tenant_premium",
                    "name": "Startup Team (Premium)",
                    "tier": "premium",
                    "api_keys": {},
                    "repo_count": 0
                },
                "tenant_enterprise": {
                    "id": "tenant_enterprise",
                    "name": "Global Bank (Enterprise)",
                    "tier": "enterprise",
                    "api_keys": {},
                    "repo_count": 0
                }
            }
            with open(TENANTS_DB_PATH, 'w') as f:
                json.dump(default_tenants, f, indent=4)

    def _load(self) -> Dict[str, Any]:
        with open(TENANTS_DB_PATH, 'r') as f:
            return json.load(f)

    def _save(self):
        with open(TENANTS_DB_PATH, 'w') as f:
            json.dump(self.tenants, f, indent=4)

    def get_tenant(self, tenant_id: str) -> Dict[str, Any]:
        """Retrieve a tenant by ID. Default to freemium if not found for safety."""
        return self.tenants.get(tenant_id, self.tenants.get("tenant_freemium"))
        
    def get_all_tenants(self) -> List[Dict[str, Any]]:
        return list(self.tenants.values())

    def update_tenant_tier(self, tenant_id: str, new_tier: str) -> bool:
        if tenant_id in self.tenants and new_tier in ["freemium", "premium", "enterprise"]:
            self.tenants[tenant_id]["tier"] = new_tier
            self._save()
            return True
        return False

    def update_api_keys(self, tenant_id: str, provider: str, api_key: str) -> bool:
        if tenant_id in self.tenants and provider in ["openai", "anthropic"]:
            self.tenants[tenant_id]["api_keys"][provider] = api_key
            self._save()
            return True
        return False

    def check_feature_access(self, tenant_id: str, feature: str) -> bool:
        """Check if a tenant's subscription tier allows access to a feature."""
        tenant = self.get_tenant(tenant_id)
        tier = tenant["tier"]

        # Freemium features
        if feature in ["basic_scan", "dependency_graph"]:
            return True
            
        # Premium features
        if feature in ["rag_context", "risk_simulator", "ai_remediation", "cloud_llms"]:
            return tier in ["premium", "enterprise"]
            
        # Enterprise features
        if feature in ["bfsi_domain", "governance", "unlimited_repos"]:
            return tier == "enterprise"
            
        return False
        
    def check_repo_limit(self, tenant_id: str) -> bool:
        """Check if tenant can scan another repository"""
        tenant = self.get_tenant(tenant_id)
        tier = tenant["tier"]
        current_count = tenant.get("repo_count", 0)
        
        if tier == "freemium" and current_count >= 1:
            return False
        if tier == "premium" and current_count >= 10:
            return False
        return True # Enterprise is unlimited
        
    def increment_repo_count(self, tenant_id: str):
        if tenant_id in self.tenants:
            self.tenants[tenant_id]["repo_count"] = self.tenants[tenant_id].get("repo_count", 0) + 1
            self._save()
