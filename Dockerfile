# Multi-stage Dockerfile for CFIP
# Stage 1: Build Next.js frontend
# Stage 2: Setup Python engine
# Stage 3: Final runtime with both services

# ============================================
# Stage 1: Build Next.js Frontend
# ============================================
FROM node:20-slim AS frontend-builder

WORKDIR /app

# Install build tools for native modules (e.g. better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps

# Copy source
COPY src/ ./src/
COPY public/ ./public/
COPY next.config.ts tsconfig.json .eslintrc.json ./

# Build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ============================================
# Stage 2: Python Engine Dependencies
# ============================================
FROM python:3.11-slim AS engine-builder

WORKDIR /engine

COPY engine/requirements.txt .
RUN pip install --no-cache-dir --target=/engine/deps -r requirements.txt

# ============================================
# Stage 3: Final Runtime Image
# ============================================
FROM node:20-slim

LABEL maintainer="CFIP Team <admin@cfip.io>"
LABEL description="Code Forensics Intelligence Platform — Enterprise Edition"
LABEL version="2.0.0"

# Install Python, supervisor, and git
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv \
    supervisor git curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN groupadd -r cfip && useradd -r -g cfip -m cfip

WORKDIR /app

# Copy Next.js build
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/public ./public
COPY package.json next.config.ts ./

# Copy Python engine
COPY engine/ ./engine/
COPY --from=engine-builder /engine/deps /usr/local/lib/python3.11/dist-packages/

# Copy entrypoint and configs
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Supervisor config
RUN mkdir -p /var/log/supervisor
COPY <<'EOF' /etc/supervisor/conf.d/cfip.conf
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nextjs]
command=node_modules/.bin/next start -p 3000
directory=/app
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/nextjs.log
stderr_logfile=/var/log/supervisor/nextjs-error.log
environment=NODE_ENV="production",NEXT_TELEMETRY_DISABLED="1"

[program:engine]
command=python3 -m uvicorn main:app --host 0.0.0.0 --port 8001
directory=/app/engine
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/engine.log
stderr_logfile=/var/log/supervisor/engine-error.log
EOF

# Create data directories
RUN mkdir -p /app/data /app/engine/data /app/repos && \
    chown -R cfip:cfip /app /var/log/supervisor

# Expose ports
EXPOSE 3000 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000 && curl -f http://localhost:8001/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
