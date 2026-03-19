"""
Vector Store — Manages code embeddings and retrieval using ChromaDB and Ollama.
"""

import os
from typing import List, Dict, Any
import chromadb
from langchain_core.documents import Document
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

class VectorStore:
    def __init__(self, data_dir: str = "./data/chroma", model_name: str = "bge-m3:latest", ollama_url: str = "http://localhost:11434"):
        self.data_dir = data_dir
        self.model_name = model_name
        self.ollama_url = ollama_url
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize Embeddings
        self.embeddings = OllamaEmbeddings(
            model=self.model_name,
            base_url=self.ollama_url
        )
        
        # Initialize ChromaDB Client
        self.client = chromadb.PersistentClient(path=self.data_dir)
        
        # Define the Langchain Vectorstore wrapper
        self.vectorstore = Chroma(
            client=self.client,
            collection_name="cfip_codebase",
            embedding_function=self.embeddings,
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=150,
            length_function=len,
        )

    def index_repository(self, files_data: List[Dict[str, str]]):
        """
        Index a list of files into the vector store.
        files_data: list of dicts with 'filepath' and 'content'
        """
        documents = []
        for file in files_data:
            if not file.get("content"):
                continue
                
            # Create a document for each file
            doc = Document(
                page_content=file["content"],
                metadata={"source": file["filepath"]}
            )
            documents.append(doc)
            
        # Split documents into chunks
        chunks = self.text_splitter.split_documents(documents)
        
        # Clear existing collection and add new documents (for demo purposes)
        try:
            self.client.delete_collection("cfip_codebase")
            self.vectorstore = Chroma(
                client=self.client,
                collection_name="cfip_codebase",
                embedding_function=self.embeddings,
            )
        except Exception:
            pass # Collection might not exist yet
            
        if chunks:
            self.vectorstore.add_documents(chunks)
            print(f"Indexed {len(chunks)} chunks into ChromaDB.")

    def retrieve_context(self, query: str, k: int = 5) -> str:
        """
        Retrieve context relevant to the query from the vector store.
        """
        try:
            results = self.vectorstore.similarity_search(query, k=k)
            context_str = ""
            for res in results:
                context_str += f"\\n--- FILE: {res.metadata.get('source', 'Unknown')} ---\\n"
                context_str += f"{res.page_content}\\n"
            return context_str
        except Exception as e:
            print(f"Retrieval error: {e}")
            return "No relevant context found."
