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

    def chat(self, messages: List[Dict[str, str]], context: str = "") -> str:
        """
        Send a chat message to the Ollama model, optionally with RAG context.
        messages format: [{"role": "user", "content": "hello"}]
        """
        
        # Inject context into the latest user message
        modified_messages = messages.copy()
        
        if context and len(modified_messages) > 0 and modified_messages[-1]["role"] == "user":
            original_content = modified_messages[-1]["content"]
            augmented_content = f"CONTEXT FROM REPOSITORY:\\n{context}\\n\\nUSER QUESTION:\\n{original_content}"
            modified_messages[-1]["content"] = augmented_content

        payload = {
            "model": self.model_name,
            "messages": [{"role": "system", "content": self.system_prompt}] + modified_messages,
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
            return f"Error communicating with local Ollama instance ({self.model_name}): {e}\\nMake sure Ollama is running and the model is pulled."

    def generate_json_insight(self, prompt: str, schema_description: str) -> Dict:
        """Helper to force the LLM to return JSON structured data."""
        # Advanced uses (e.g. generating specific UI objects)
        pass
