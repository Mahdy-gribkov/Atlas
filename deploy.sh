#!/bin/bash

# Travel AI Agent Deployment Script
# This script builds and deploys the Travel AI Agent using Docker

set -e

echo "🚀 Starting Travel AI Agent Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build the application
echo "🔨 Building Travel AI Agent..."
docker-compose build

# Start the services
echo "🚀 Starting Travel AI Agent services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check health
echo "🏥 Checking service health..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Travel AI Agent is running successfully!"
    echo "🌐 Access the application at: http://localhost:8000"
    echo "📊 Health check: http://localhost:8000/health"
    echo "📚 API documentation: http://localhost:8000/docs"
else
    echo "❌ Health check failed. Please check the logs:"
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment completed successfully!"
