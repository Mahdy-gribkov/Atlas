#!/bin/bash

# Travel AI Agent Development Script
# This script starts the development environment

set -e

echo "🛠️ Starting Travel AI Agent Development Environment..."

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

# Start development services
echo "🚀 Starting development services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 20

# Check health
echo "🏥 Checking service health..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is running successfully!"
    echo "🌐 Backend API: http://localhost:8000"
    echo "📊 Health check: http://localhost:8000/health"
    echo "📚 API documentation: http://localhost:8000/docs"
else
    echo "❌ Backend health check failed. Please check the logs:"
    docker-compose -f docker-compose.dev.yml logs travel-agent-dev
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running successfully!"
    echo "🌐 Frontend: http://localhost:3000"
else
    echo "❌ Frontend health check failed. Please check the logs:"
    docker-compose -f docker-compose.dev.yml logs frontend-dev
fi

echo "🎉 Development environment is ready!"
echo "💡 To stop the services, run: docker-compose -f docker-compose.dev.yml down"
