# Deployment Guide

This guide provides comprehensive instructions for deploying the AI Travel Agent application to various platforms and environments.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Environment Setup](#environment-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Docker Deployment](#docker-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Google Cloud Deployment](#google-cloud-deployment)
7. [Azure Deployment](#azure-deployment)
8. [Self-Hosted Deployment](#self-hosted-deployment)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Troubleshooting](#troubleshooting)

## Deployment Overview

The AI Travel Agent application is designed to be deployed on various platforms with different configurations for development, staging, and production environments.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Deployment Architecture                  │
├─────────────────────────────────────────────────────────────┤
│ 1. Load Balancer / CDN (Cloudflare, AWS CloudFront)        │
├─────────────────────────────────────────────────────────────┤
│ 2. Application Server (Vercel, Docker, AWS ECS)            │
├─────────────────────────────────────────────────────────────┤
│ 3. Database (Firebase Firestore, AWS RDS)                  │
├─────────────────────────────────────────────────────────────┤
│ 4. Cache Layer (Redis, AWS ElastiCache)                    │
├─────────────────────────────────────────────────────────────┤
│ 5. External Services (APIs, AI Services)                   │
├─────────────────────────────────────────────────────────────┤
│ 6. Monitoring (Vercel Analytics, AWS CloudWatch)           │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Options

| Platform | Complexity | Cost | Scalability | Recommended For |
|----------|------------|------|-------------|-----------------|
| Vercel | Low | Low | High | Small to medium projects |
| Docker | Medium | Medium | High | Custom infrastructure |
| AWS | High | High | Very High | Enterprise applications |
| Google Cloud | High | High | Very High | Google ecosystem |
| Azure | High | High | Very High | Microsoft ecosystem |
| Self-Hosted | High | Low | Medium | Full control needed |

## Environment Setup

### Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** installed
2. **Git** for version control
3. **Firebase project** set up
4. **External API keys** obtained
5. **Domain name** (for production)

### Environment Variables

Create environment-specific configuration files:

#### Development (.env.local)

```env
# Application
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret

# Firebase
FIREBASE_PROJECT_ID=your-dev-project
FIREBASE_CLIENT_EMAIL=your-dev-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# External APIs
OPENWEATHER_API_KEY=your-openweather-key
AMADEUS_API_KEY=your-amadeus-key
AMADEUS_API_SECRET=your-amadeus-secret
GOOGLE_MAPS_API_KEY=your-google-maps-key
GOOGLE_GEMINI_API_KEY=your-gemini-key

# Security
ENCRYPTION_KEY=your-encryption-key
JWT_SECRET=your-jwt-secret

# Monitoring (Optional)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

#### Production (.env.production)

```env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-very-secure-production-secret

# Firebase
FIREBASE_PROJECT_ID=your-production-project
FIREBASE_CLIENT_EMAIL=your-production-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# External APIs
OPENWEATHER_API_KEY=your-production-openweather-key
AMADEUS_API_KEY=your-production-amadeus-key
AMADEUS_API_SECRET=your-production-amadeus-secret
GOOGLE_MAPS_API_KEY=your-production-google-maps-key
GOOGLE_GEMINI_API_KEY=your-production-gemini-key

# Security
ENCRYPTION_KEY=your-production-encryption-key
JWT_SECRET=your-production-jwt-secret

# Monitoring
UPSTASH_REDIS_REST_URL=your-production-redis-url
UPSTASH_REDIS_REST_TOKEN=your-production-redis-token

# Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
```

### Firebase Setup

1. **Create Firebase Project**:
   ```bash
   firebase login
   firebase init
   ```

2. **Enable Services**:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Cloud Functions (if using)

3. **Configure Firestore Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **Generate Service Account**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Download and store securely

## Vercel Deployment

Vercel is the recommended deployment platform for Next.js applications.

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy to Vercel

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### 4. Configure Environment Variables

In Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add all required environment variables
3. Set environment scope (Production, Preview, Development)

### 5. Configure Custom Domain

1. Go to project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 6. Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### 7. Vercel Analytics

Enable Vercel Analytics for monitoring:

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Use Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Create Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret
      - FIREBASE_PROJECT_ID=your-project
      - FIREBASE_CLIENT_EMAIL=your-email
      - FIREBASE_PRIVATE_KEY=your-key
      - OPENWEATHER_API_KEY=your-key
      - AMADEUS_API_KEY=your-key
      - AMADEUS_API_SECRET=your-secret
      - GOOGLE_MAPS_API_KEY=your-key
      - GOOGLE_GEMINI_API_KEY=your-key
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  redis_data:
```

### 3. Build and Run

```bash
# Build the image
docker build -t ai-travel-agent .

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### 4. Docker Production Setup

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Scale the application
docker-compose up -d --scale app=3

# Update the application
docker-compose pull
docker-compose up -d
```

## AWS Deployment

### 1. AWS ECS Deployment

#### Create ECS Task Definition

```json
{
  "family": "ai-travel-agent",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "ai-travel-agent",
      "image": "your-account.dkr.ecr.region.amazonaws.com/ai-travel-agent:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "NEXTAUTH_URL",
          "value": "https://your-domain.com"
        }
      ],
      "secrets": [
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:ai-travel-agent/nextauth-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ai-travel-agent",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### Create ECS Service

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name ai-travel-agent

# Create ECS service
aws ecs create-service \
  --cluster ai-travel-agent \
  --service-name ai-travel-agent-service \
  --task-definition ai-travel-agent:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

### 2. AWS Lambda Deployment

#### Serverless Framework

```yaml
# serverless.yml
service: ai-travel-agent

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    NODE_ENV: ${self:provider.stage}
    NEXTAUTH_URL: ${self:custom.domain}
    NEXTAUTH_SECRET: ${env:NEXTAUTH_SECRET}
    FIREBASE_PROJECT_ID: ${env:FIREBASE_PROJECT_ID}
    FIREBASE_CLIENT_EMAIL: ${env:FIREBASE_CLIENT_EMAIL}
    FIREBASE_PRIVATE_KEY: ${env:FIREBASE_PRIVATE_KEY}
    OPENWEATHER_API_KEY: ${env:OPENWEATHER_API_KEY}
    AMADEUS_API_KEY: ${env:AMADEUS_API_KEY}
    AMADEUS_API_SECRET: ${env:AMADEUS_API_SECRET}
    GOOGLE_MAPS_API_KEY: ${env:GOOGLE_MAPS_API_KEY}
    GOOGLE_GEMINI_API_KEY: ${env:GOOGLE_GEMINI_API_KEY}

functions:
  app:
    handler: server.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
      - http:
          path: /
          method: ANY
          cors: true

plugins:
  - serverless-nextjs-plugin

custom:
  domain: ${self:provider.stage}.your-domain.com
```

#### Deploy with Serverless

```bash
# Install Serverless Framework
npm install -g serverless

# Deploy to AWS
serverless deploy

# Deploy to specific stage
serverless deploy --stage production
```

## Google Cloud Deployment

### 1. Google Cloud Run

#### Create Cloud Run Service

```yaml
# cloud-run.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: ai-travel-agent
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 100
      timeoutSeconds: 300
      containers:
      - image: gcr.io/your-project/ai-travel-agent:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXTAUTH_URL
          value: "https://your-domain.com"
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: nextauth-secret
              key: secret
        resources:
          limits:
            cpu: "1"
            memory: "1Gi"
          requests:
            cpu: "0.5"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Deploy to Cloud Run

```bash
# Build and push image
gcloud builds submit --tag gcr.io/your-project/ai-travel-agent

# Deploy to Cloud Run
gcloud run deploy ai-travel-agent \
  --image gcr.io/your-project/ai-travel-agent \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-secrets NEXTAUTH_SECRET=nextauth-secret:latest
```

### 2. Google App Engine

#### Create app.yaml

```yaml
# app.yaml
runtime: nodejs18
service: ai-travel-agent

env_variables:
  NODE_ENV: production
  NEXTAUTH_URL: https://your-domain.com
  NEXTAUTH_SECRET: your-secret
  FIREBASE_PROJECT_ID: your-project
  FIREBASE_CLIENT_EMAIL: your-email
  FIREBASE_PRIVATE_KEY: your-key
  OPENWEATHER_API_KEY: your-key
  AMADEUS_API_KEY: your-key
  AMADEUS_API_SECRET: your-secret
  GOOGLE_MAPS_API_KEY: your-key
  GOOGLE_GEMINI_API_KEY: your-key

automatic_scaling:
  min_instances: 1
  max_instances: 10
  target_cpu_utilization: 0.6

handlers:
- url: /.*
  script: auto
  secure: always

health_check:
  enable_health_check: true
  check_interval_sec: 30
  timeout_sec: 4
  unhealthy_threshold: 2
  healthy_threshold: 2
  restart_threshold: 60
```

#### Deploy to App Engine

```bash
# Deploy to App Engine
gcloud app deploy

# Deploy to specific service
gcloud app deploy --service ai-travel-agent
```

## Azure Deployment

### 1. Azure Container Instances

#### Create Container Instance

```bash
# Create resource group
az group create --name ai-travel-agent-rg --location eastus

# Create container instance
az container create \
  --resource-group ai-travel-agent-rg \
  --name ai-travel-agent \
  --image your-registry.azurecr.io/ai-travel-agent:latest \
  --cpu 1 \
  --memory 1 \
  --ports 3000 \
  --environment-variables \
    NODE_ENV=production \
    NEXTAUTH_URL=https://your-domain.com \
  --secure-environment-variables \
    NEXTAUTH_SECRET=your-secret \
    FIREBASE_PROJECT_ID=your-project \
    FIREBASE_CLIENT_EMAIL=your-email \
    FIREBASE_PRIVATE_KEY=your-key \
    OPENWEATHER_API_KEY=your-key \
    AMADEUS_API_KEY=your-key \
    AMADEUS_API_SECRET=your-secret \
    GOOGLE_MAPS_API_KEY=your-key \
    GOOGLE_GEMINI_API_KEY=your-key
```

### 2. Azure App Service

#### Create App Service

```bash
# Create App Service plan
az appservice plan create \
  --name ai-travel-agent-plan \
  --resource-group ai-travel-agent-rg \
  --sku B1 \
  --is-linux

# Create App Service
az webapp create \
  --resource-group ai-travel-agent-rg \
  --plan ai-travel-agent-plan \
  --name ai-travel-agent \
  --deployment-container-image-name your-registry.azurecr.io/ai-travel-agent:latest

# Configure environment variables
az webapp config appsettings set \
  --resource-group ai-travel-agent-rg \
  --name ai-travel-agent \
  --settings \
    NODE_ENV=production \
    NEXTAUTH_URL=https://your-domain.com \
    NEXTAUTH_SECRET=your-secret \
    FIREBASE_PROJECT_ID=your-project \
    FIREBASE_CLIENT_EMAIL=your-email \
    FIREBASE_PRIVATE_KEY=your-key \
    OPENWEATHER_API_KEY=your-key \
    AMADEUS_API_KEY=your-key \
    AMADEUS_API_SECRET=your-secret \
    GOOGLE_MAPS_API_KEY=your-key \
    GOOGLE_GEMINI_API_KEY=your-key
```

## Self-Hosted Deployment

### 1. VPS Deployment

#### Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### Application Deployment

```bash
# Clone repository
git clone https://github.com/your-username/ai-travel-agent.git
cd ai-travel-agent

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "ai-travel-agent" -- start
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/ai-travel-agent
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Configuration

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ai-travel-agent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### 2. Kubernetes Deployment

#### Create Kubernetes Manifests

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-travel-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-travel-agent
  template:
    metadata:
      labels:
        app: ai-travel-agent
    spec:
      containers:
      - name: ai-travel-agent
        image: your-registry/ai-travel-agent:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: NEXTAUTH_URL
          value: "https://your-domain.com"
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: ai-travel-agent-secrets
              key: nextauth-secret
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ai-travel-agent-service
spec:
  selector:
    app: ai-travel-agent
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: v1
kind: Secret
metadata:
  name: ai-travel-agent-secrets
type: Opaque
data:
  nextauth-secret: <base64-encoded-secret>
  firebase-project-id: <base64-encoded-project-id>
  firebase-client-email: <base64-encoded-client-email>
  firebase-private-key: <base64-encoded-private-key>
  openweather-api-key: <base64-encoded-api-key>
  amadeus-api-key: <base64-encoded-api-key>
  amadeus-api-secret: <base64-encoded-api-secret>
  google-maps-api-key: <base64-encoded-api-key>
  google-gemini-api-key: <base64-encoded-api-key>
```

#### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services

# Check logs
kubectl logs -f deployment/ai-travel-agent
```

## CI/CD Pipeline

### 1. GitHub Actions

#### Create GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: .next/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: .next/
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### 2. Docker Hub CI/CD

#### Docker Build and Push

```yaml
# .github/workflows/docker.yml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v4
      with:
        images: your-username/ai-travel-agent
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

### 3. AWS CodePipeline

#### Create CodePipeline

```yaml
# codepipeline.yml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  CodePipeline:
    Type: AWS::CodePipeline::Pipeline
    Properties:
      RoleArn: !GetAtt CodePipelineRole.Arn
      Stages:
      - Name: Source
        Actions:
        - Name: SourceAction
          ActionTypeId:
            Category: Source
            Owner: ThirdParty
            Provider: GitHub
            Version: '1'
          Configuration:
            Owner: your-username
            Repo: ai-travel-agent
            Branch: main
            OAuthToken: !Ref GitHubToken
          OutputArtifacts:
          - Name: SourceOutput
      
      - Name: Build
        Actions:
        - Name: BuildAction
          ActionTypeId:
            Category: Build
            Owner: AWS
            Provider: CodeBuild
            Version: '1'
          Configuration:
            ProjectName: !Ref CodeBuildProject
          InputArtifacts:
          - Name: SourceOutput
          OutputArtifacts:
          - Name: BuildOutput
      
      - Name: Deploy
        Actions:
        - Name: DeployAction
          ActionTypeId:
            Category: Deploy
            Owner: AWS
            Provider: ECS
            Version: '1'
          Configuration:
            ClusterName: !Ref ECSCluster
            ServiceName: !Ref ECSService
          InputArtifacts:
          - Name: BuildOutput
```

## Monitoring & Maintenance

### 1. Health Monitoring

#### Health Check Endpoints

```bash
# Check application health
curl -f http://your-domain.com/api/health

# Check readiness
curl -f http://your-domain.com/api/ready

# Check liveness
curl -f http://your-domain.com/api/live
```

#### Monitoring Setup

```bash
# Set up monitoring with Prometheus
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
```

### 2. Log Management

#### Log Aggregation

```bash
# Set up ELK Stack
# Add to docker-compose.yml
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:7.15.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5044:5044"

  kibana:
    image: docker.elastic.co/kibana/kibana:7.15.0
    ports:
      - "5601:5601"
```

### 3. Backup Strategy

#### Database Backup

```bash
# Firebase backup script
#!/bin/bash
# backup-firebase.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/firebase"
PROJECT_ID="your-project-id"

# Create backup directory
mkdir -p $BACKUP_DIR

# Export Firestore data
gcloud firestore export gs://your-backup-bucket/firestore-backup-$DATE \
  --project=$PROJECT_ID

# Backup to local storage
gsutil -m cp -r gs://your-backup-bucket/firestore-backup-$DATE $BACKUP_DIR/

# Clean up old backups (keep last 30 days)
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} \;
```

#### Application Backup

```bash
# Application backup script
#!/bin/bash
# backup-app.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/app"
APP_DIR="/app"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/app-backup-$DATE.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  $APP_DIR

# Clean up old backups (keep last 7 days)
find $BACKUP_DIR -name "app-backup-*.tar.gz" -mtime +7 -delete
```

### 4. Update Strategy

#### Rolling Updates

```bash
# Rolling update script
#!/bin/bash
# rolling-update.sh

NEW_VERSION=$1
CURRENT_VERSION=$(docker images --format "table {{.Tag}}" | grep -v TAG | head -1)

if [ -z "$NEW_VERSION" ]; then
  echo "Usage: $0 <new-version>"
  exit 1
fi

echo "Updating from $CURRENT_VERSION to $NEW_VERSION"

# Pull new image
docker pull your-registry/ai-travel-agent:$NEW_VERSION

# Update containers one by one
docker-compose up -d --no-deps --scale app=2 app
sleep 30
docker-compose up -d --no-deps --scale app=3 app
sleep 30
docker-compose up -d --no-deps --scale app=2 app
sleep 30
docker-compose up -d --no-deps --scale app=1 app

echo "Update completed successfully"
```

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures

```bash
# Check build logs
npm run build 2>&1 | tee build.log

# Common fixes
npm ci --only=production
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Environment Variable Issues

```bash
# Check environment variables
printenv | grep -E "(NEXTAUTH|FIREBASE|API)"

# Test environment loading
node -e "console.log(process.env.NEXTAUTH_SECRET)"
```

#### 3. Database Connection Issues

```bash
# Test Firebase connection
firebase projects:list
firebase use your-project-id
firebase firestore:rules:get
```

#### 4. External API Issues

```bash
# Test API endpoints
curl -H "Authorization: Bearer $API_KEY" \
  "https://api.openweathermap.org/data/2.5/weather?q=London&appid=$API_KEY"
```

### Performance Issues

#### 1. Memory Issues

```bash
# Monitor memory usage
docker stats
kubectl top pods

# Check application memory
curl http://localhost:3000/api/metrics
```

#### 2. CPU Issues

```bash
# Monitor CPU usage
htop
docker stats --no-stream

# Check application CPU
curl http://localhost:3000/api/health
```

### Security Issues

#### 1. SSL Certificate Issues

```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Renew certificate
certbot renew --dry-run
certbot renew
```

#### 2. Firewall Issues

```bash
# Check firewall status
ufw status
iptables -L

# Test port accessibility
telnet your-domain.com 443
```

## Conclusion

This deployment guide provides comprehensive instructions for deploying the AI Travel Agent application to various platforms. Choose the deployment method that best fits your requirements and infrastructure.

For additional support, refer to the [Troubleshooting Guide](TROUBLESHOOTING.md) or contact the development team.