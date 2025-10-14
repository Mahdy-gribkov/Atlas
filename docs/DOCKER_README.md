# 🐳 Docker Deployment Guide

This guide explains how to deploy the Travel AI Agent using Docker for production and development environments.

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- At least 4GB RAM available for Docker
- 10GB free disk space

## 🚀 Quick Start

### Production Deployment

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Travel_Agent
   ```

2. **Deploy using the deployment script:**
   ```bash
   ./deploy.sh
   ```

3. **Or deploy manually:**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Access the application:**
   - Web Interface: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

### Development Environment

1. **Start development environment:**
   ```bash
   ./dev.sh
   ```

2. **Or start manually:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Access the services:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Production Environment Configuration
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=INFO

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Database Configuration
DATABASE_PATH=./data/travel_agent.db
DATABASE_ENCRYPTION_KEY=your-production-encryption-key-here

# Security Configuration
SECRET_KEY=your-production-secret-key-here
CORS_ORIGINS=["https://your-domain.com"]

# LLM Configuration
LLM_TYPE=ollama
OLLAMA_HOST=http://ollama:11434
OLLAMA_MODEL=llama3.1:8b
```

### Optional: Local LLM with Ollama

To use a local LLM, start the Ollama service:

```bash
docker-compose --profile llm up -d
```

This will start Ollama on port 11434. You can then pull and use local models:

```bash
docker exec -it travel_agent_ollama_1 ollama pull llama3.1:8b
```

## 📊 Monitoring

### Health Checks

The application includes built-in health checks:

- **Application Health:** http://localhost:8000/health
- **Docker Health:** `docker-compose ps`

### Logs

View application logs:

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs travel-agent

# Follow logs in real-time
docker-compose logs -f travel-agent
```

### Resource Usage

Monitor resource usage:

```bash
docker stats
```

## 🔄 Updates

### Update the Application

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart:**
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

### Update Dependencies

1. **Update requirements:**
   ```bash
   docker-compose exec travel-agent pip install -r requirements.txt
   ```

2. **Restart the service:**
   ```bash
   docker-compose restart travel-agent
   ```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :8000
   
   # Stop the service using the port
   sudo kill -9 <PID>
   ```

2. **Docker build fails:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Database issues:**
   ```bash
   # Remove database volume
   docker-compose down -v
   docker-compose up -d
   ```

4. **Frontend not loading:**
   ```bash
   # Rebuild frontend
   docker-compose exec travel-agent npm run build
   ```

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# Set debug environment
export DEBUG=true
docker-compose up -d
```

## 🔒 Security

### Production Security

1. **Change default secrets:**
   - Update `SECRET_KEY` in environment variables
   - Update `DATABASE_ENCRYPTION_KEY`
   - Use strong, unique passwords

2. **Network security:**
   - Use reverse proxy (nginx/traefik)
   - Enable HTTPS
   - Restrict CORS origins

3. **Container security:**
   - Run as non-root user (already configured)
   - Use read-only filesystem where possible
   - Regular security updates

## 📈 Scaling

### Horizontal Scaling

To scale the application:

```bash
# Scale to 3 instances
docker-compose up -d --scale travel-agent=3
```

### Load Balancing

Use nginx or traefik for load balancing multiple instances.

## 🗂️ Data Management

### Backup

```bash
# Backup database
docker-compose exec travel-agent cp /app/data/travel_agent.db /app/data/backup_$(date +%Y%m%d).db

# Backup logs
docker-compose logs > logs_backup_$(date +%Y%m%d).log
```

### Restore

```bash
# Restore database
docker-compose exec travel-agent cp /app/data/backup_20231201.db /app/data/travel_agent.db
```

## 🚀 Production Deployment

### Cloud Deployment

The application is ready for deployment on:

- **AWS ECS/Fargate**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**
- **Heroku Container Registry**

### Kubernetes

For Kubernetes deployment, create the following resources:

1. **Deployment**
2. **Service**
3. **Ingress**
4. **ConfigMap** (for environment variables)
5. **Secret** (for sensitive data)

## 📞 Support

For issues and questions:

1. Check the logs: `docker-compose logs`
2. Verify health: `curl http://localhost:8000/health`
3. Check Docker status: `docker-compose ps`
4. Review this documentation

## 🎯 Next Steps

After successful deployment:

1. Configure your domain name
2. Set up SSL certificates
3. Configure monitoring and alerting
4. Set up automated backups
5. Configure log aggregation
6. Set up CI/CD pipeline
