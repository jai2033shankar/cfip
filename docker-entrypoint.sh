#!/bin/bash
set -e

echo "============================================"
echo "  CFIP — Code Forensics Intelligence Platform"
echo "  Starting Enterprise Edition v2.0.0"
echo "============================================"

# Wait for dependent services
echo "[CFIP] Waiting for services..."

# Wait for Ollama
if [ -n "$OLLAMA_HOST" ]; then
    echo "[CFIP] Checking Ollama at $OLLAMA_HOST..."
    for i in $(seq 1 30); do
        if curl -sf "$OLLAMA_HOST/api/tags" > /dev/null 2>&1; then
            echo "[CFIP] ✅ Ollama is ready"
            
            # Auto-pull models if not present
            MODELS=$(curl -sf "$OLLAMA_HOST/api/tags" | python3 -c "import sys,json; print(' '.join([m['name'] for m in json.load(sys.stdin).get('models',[])]))" 2>/dev/null || echo "")
            
            if echo "$MODELS" | grep -q "gemma3"; then
                echo "[CFIP] ✅ gemma3 model found"
            else
                echo "[CFIP] 📦 Pulling gemma3:latest (first run only)..."
                curl -sf "$OLLAMA_HOST/api/pull" -d '{"name":"gemma3:latest"}' > /dev/null 2>&1 &
            fi
            
            if echo "$MODELS" | grep -q "bge-m3"; then
                echo "[CFIP] ✅ bge-m3 embedding model found"
            else
                echo "[CFIP] 📦 Pulling bge-m3:latest (first run only)..."
                curl -sf "$OLLAMA_HOST/api/pull" -d '{"name":"bge-m3:latest"}' > /dev/null 2>&1 &
            fi
            break
        fi
        echo "[CFIP] Waiting for Ollama... ($i/30)"
        sleep 2
    done
fi

# Wait for ChromaDB
if [ -n "$CHROMADB_HOST" ]; then
    echo "[CFIP] Checking ChromaDB at $CHROMADB_HOST..."
    for i in $(seq 1 20); do
        if curl -sf "$CHROMADB_HOST/api/v1/heartbeat" > /dev/null 2>&1; then
            echo "[CFIP] ✅ ChromaDB is ready"
            break
        fi
        echo "[CFIP] Waiting for ChromaDB... ($i/20)"
        sleep 2
    done
fi

echo ""
echo "[CFIP] ============================================"
echo "[CFIP]  🚀 Starting CFIP Services"
echo "[CFIP]  📊 Dashboard:  http://localhost:3000"
echo "[CFIP]  ⚙️  Engine API: http://localhost:8001"
echo "[CFIP]  🤖 Ollama:     $OLLAMA_HOST"
echo "[CFIP]  💾 ChromaDB:   $CHROMADB_HOST"
echo "[CFIP] ============================================"
echo ""

# Start supervisor (manages Next.js + FastAPI)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/cfip.conf
