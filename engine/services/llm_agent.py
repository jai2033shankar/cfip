"""
LLM Agent — Orchestrates conversation with the local Ollama model (gemma3), injecting RAG context.
"""

import requests
import json
from typing import List, Dict, Any

class LLMAgent:
    def __init__(self, ollama_url: str = "http://localhost:11434", model_name: str = "gemma3:latest"):
        self.ollama_url = ollama_url
        self.model_name = model_name
        self.generate_endpoint = f"{self.ollama_url}/api/chat"
        
        self.system_prompt = """You are the CFIP (Code Forensics Intelligence Platform) AI Copilot.
You are an expert Enterprise Architect and Staff Software Engineer. 
You help users understand complex codebases, perform code forensics, evaluate architectural impact, and integrate DevOps practices.
Use the provided codebase context to answer the user's questions accurately. If you don't know the answer based on the context, say so. Do not hallucinate code that isn't provided.
Keep your answers concise, well-structured, and use Markdown for formatting code and files."""

    def chat(self, messages: List[Dict[str, str]], context: str = "", tenant: Dict = None, provider: str = "ollama") -> str:
        """
        Send a chat message to the designated model provider.
        """
        if tenant is None:
            tenant = {"tier": "freemium", "api_keys": {}}
            
        tier = tenant.get("tier", "freemium")
        api_keys = tenant.get("api_keys", {})
        
        # Inject context into the latest user message
        modified_messages = messages.copy()
        
        if context and len(modified_messages) > 0 and modified_messages[-1]["role"] == "user":
            original_content = modified_messages[-1]["content"]
            augmented_content = f"CONTEXT FROM REPOSITORY:\n{context}\n\nUSER QUESTION:\n{original_content}"
            modified_messages[-1]["content"] = augmented_content

        system_msg = {"role": "system", "content": self.system_prompt}
            
        if provider == "openai" and tier in ["premium", "enterprise"]:
            openai_key = api_keys.get("openai")
            if not openai_key:
                return "Error: OpenAI API key not configured for this tenant. Please update your settings."
            return self._chat_openai([system_msg] + modified_messages, openai_key)
            
        elif provider == "anthropic" and tier in ["premium", "enterprise"]:
            anthropic_key = api_keys.get("anthropic")
            if not anthropic_key:
                return "Error: Anthropic API key not configured for this tenant. Please update your settings."
            return self._chat_anthropic([system_msg] + modified_messages, anthropic_key)

        elif provider in ["openai", "anthropic"]:
            return f"Error: The {provider} provider is only available for Premium and Enterprise tiers. Please upgrade your subscription."
            
        # Fallback to local Ollama
        return self._chat_ollama([system_msg] + modified_messages)
        
    def _chat_openai(self, messages: List[Dict[str, str]], api_key: str) -> str:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        payload = {
            "model": "gpt-4o",
            "messages": messages,
            "temperature": 0.2
        }
        try:
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=120)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Error communicating with OpenAI API: {e}"
            
    def _chat_anthropic(self, messages: List[Dict[str, str]], api_key: str) -> str:
        system = ""
        user_msgs = []
        for msg in messages:
            if msg["role"] == "system":
                system = msg["content"]
            else:
                user_msgs.append(msg)
                
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        payload = {
            "model": "claude-3-5-sonnet-20241022",
            "max_tokens": 4096,
            "system": system,
            "messages": user_msgs,
            "temperature": 0.2
        }
        try:
            response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=payload, timeout=120)
            response.raise_for_status()
            return response.json()["content"][0]["text"]
        except Exception as e:
            return f"Error communicating with Anthropic API: {e}"

    def _chat_ollama(self, messages: List[Dict[str, str]]) -> str:
        payload = {
            "model": self.model_name,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.2, # Keep it deterministic for code analysis
            }
        }

        try:
            response = requests.post(self.generate_endpoint, json=payload, timeout=120)
            response.raise_for_status()
            result = response.json()
            return result.get("message", {}).get("content", "Error: No response generated.")
        except requests.exceptions.RequestException as e:
            return f"Error communicating with local Ollama instance ({self.model_name}): {e}\nMake sure Ollama is running and the model is pulled."

    def generate_json_insight(self, prompt: str, schema_description: str) -> Dict:
        """Helper to force the LLM to return JSON structured data."""
        # Advanced uses (e.g. generating specific UI objects)
        pass
