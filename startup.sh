#!/bin/bash

# Function to check if service is ready
check_service() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    return 1
}

# Start Ollama in background
echo "🚀 Starting Ollama..."
ollama serve &
OLLAMA_PID=$!

# Start Python API in background (don't wait for Ollama)
echo "🚀 Starting Python API..."
python3 api.py &
API_PID=$!

# Wait for services to be ready in parallel
echo "⏳ Waiting for services to start..."
if check_service "http://localhost:11434/api/tags"; then
    echo "✅ Ollama ready"
else
    echo "❌ Ollama failed to start"
fi

if check_service "http://localhost:8000/health"; then
    echo "✅ API ready"
else
    echo "❌ API failed to start"
fi

# Start Nginx in foreground
echo "🌐 Starting Nginx..."
nginx -g 'daemon off;'
