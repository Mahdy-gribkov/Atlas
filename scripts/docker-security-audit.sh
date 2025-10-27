#!/bin/bash

# Docker Security Audit Script
# Based on Docker Bench for Security recommendations

echo "🔒 Docker Security Audit Starting..."
echo "=================================="

# Check Docker version
echo "📋 Docker Version:"
docker --version

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  WARNING: Running as root user"
else
    echo "✅ Running as non-root user"
fi

# Check Docker daemon configuration
echo ""
echo "🔧 Docker Daemon Security:"
echo "-------------------------"

# Check if Docker daemon is running with TLS
if docker info 2>/dev/null | grep -q "TLS"; then
    echo "✅ Docker daemon using TLS"
else
    echo "⚠️  Docker daemon not using TLS"
fi

# Check Docker daemon socket permissions
if [ -e /var/run/docker.sock ]; then
    SOCKET_PERMS=$(stat -c %a /var/run/docker.sock)
    if [ "$SOCKET_PERMS" = "660" ] || [ "$SOCKET_PERMS" = "600" ]; then
        echo "✅ Docker socket has secure permissions ($SOCKET_PERMS)"
    else
        echo "⚠️  Docker socket permissions are too permissive ($SOCKET_PERMS)"
    fi
fi

# Check for running containers
echo ""
echo "🐳 Container Security:"
echo "---------------------"

# List running containers
RUNNING_CONTAINERS=$(docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}")
if [ -n "$RUNNING_CONTAINERS" ]; then
    echo "Running containers:"
    echo "$RUNNING_CONTAINERS"
    
    # Check for privileged containers
    PRIVILEGED_CONTAINERS=$(docker ps --format "{{.Names}}" --filter "label=privileged=true")
    if [ -n "$PRIVILEGED_CONTAINERS" ]; then
        echo "⚠️  WARNING: Privileged containers detected: $PRIVILEGED_CONTAINERS"
    else
        echo "✅ No privileged containers detected"
    fi
    
    # Check for containers running as root
    ROOT_CONTAINERS=$(docker ps --format "{{.Names}}" --filter "label=user=root")
    if [ -n "$ROOT_CONTAINERS" ]; then
        echo "⚠️  WARNING: Containers running as root: $ROOT_CONTAINERS"
    else
        echo "✅ No containers running as root detected"
    fi
else
    echo "ℹ️  No containers currently running"
fi

# Check Docker images
echo ""
echo "🖼️  Image Security:"
echo "------------------"

# List images
echo "Available images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Check for images with vulnerabilities (if trivy is available)
if command -v trivy &> /dev/null; then
    echo ""
    echo "🔍 Vulnerability Scan (Trivy):"
    echo "-----------------------------"
    for image in $(docker images --format "{{.Repository}}:{{.Tag}}" | grep -v "<none>"); do
        echo "Scanning $image..."
        trivy image --severity HIGH,CRITICAL --format table "$image" 2>/dev/null || echo "Scan failed for $image"
    done
else
    echo "ℹ️  Trivy not installed - skipping vulnerability scan"
    echo "   Install with: curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh"
fi

# Check Docker networks
echo ""
echo "🌐 Network Security:"
echo "-------------------"

# List networks
echo "Docker networks:"
docker network ls --format "table {{.Name}}\t{{.Driver}}\t{{.Scope}}"

# Check for default bridge network usage
DEFAULT_BRIDGE_CONTAINERS=$(docker ps --format "{{.Names}}" --filter "network=bridge")
if [ -n "$DEFAULT_BRIDGE_CONTAINERS" ]; then
    echo "⚠️  WARNING: Containers using default bridge network: $DEFAULT_BRIDGE_CONTAINERS"
else
    echo "✅ No containers using default bridge network"
fi

# Check Docker volumes
echo ""
echo "💾 Volume Security:"
echo "------------------"

# List volumes
echo "Docker volumes:"
docker volume ls --format "table {{.Name}}\t{{.Driver}}\t{{.Scope}}"

# Check for bind mounts
BIND_MOUNTS=$(docker ps --format "{{.Names}}" --filter "volume=/")
if [ -n "$BIND_MOUNTS" ]; then
    echo "⚠️  WARNING: Containers with bind mounts detected: $BIND_MOUNTS"
else
    echo "✅ No bind mounts detected"
fi

# Security recommendations
echo ""
echo "🛡️  Security Recommendations:"
echo "-----------------------------"

echo "1. Enable Docker Content Trust:"
echo "   export DOCKER_CONTENT_TRUST=1"

echo ""
echo "2. Use non-root users in containers:"
echo "   USER 1001:1001"

echo ""
echo "3. Drop unnecessary capabilities:"
echo "   --cap-drop=ALL --cap-add=NET_BIND_SERVICE"

echo ""
echo "4. Use read-only filesystems:"
echo "   --read-only"

echo ""
echo "5. Set resource limits:"
echo "   --memory=1g --cpus=0.5"

echo ""
echo "6. Use custom networks:"
echo "   docker network create --driver bridge my-network"

echo ""
echo "7. Scan images regularly:"
echo "   trivy image my-image:latest"

echo ""
echo "8. Monitor container logs:"
echo "   docker logs -f container-name"

echo ""
echo "9. Use Docker secrets for sensitive data:"
echo "   echo 'secret' | docker secret create my-secret -"

echo ""
echo "10. Enable audit logging:"
echo "    --log-driver=json-file --log-opt max-size=10m --log-opt max-file=3"

echo ""
echo "🔒 Security Audit Complete!"
echo "=========================="
