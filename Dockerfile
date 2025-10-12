# Multi-stage build for production
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim AS backend
WORKDIR /app
COPY requirements-ui.txt ./
RUN pip install --no-cache-dir -r requirements-ui.txt
COPY src/ ./src/
COPY travel_agent.py ./
COPY api.py ./
COPY --from=frontend-build /app/frontend/build ./static

EXPOSE 8000
CMD ["python", "api.py"]

