# Multi-stage build for production
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Use Ubuntu base for Ollama support
FROM ubuntu:22.04

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.ai/install.sh | sh

# Set up Python environment
WORKDIR /app
COPY requirements-ui.txt ./
RUN pip3 install --no-cache-dir -r requirements-ui.txt

# Copy application files
COPY src/ ./src/
COPY travel_agent.py ./
COPY api.py ./

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./static

# Create data directory
RUN mkdir -p /app/data

EXPOSE 8000

# Download the model during build
RUN ollama serve & \
    sleep 10 && \
    ollama pull llama3.1:8b && \
    pkill ollama

# Simple startup command (model already downloaded)
CMD ["bash", "-c", "ollama serve & sleep 5 && python3 api.py"]