# ============================================
# LocalVibe API Gateway - Dockerfile
# ============================================
# Multi-stage build for optimized production image.

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
COPY apps/gateway/package.json ./apps/gateway/

# Install all dependencies
RUN npm ci --ignore-scripts

# Stage 2: Build and run
FROM node:20-alpine AS runner
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/gateway/node_modules ./apps/gateway/node_modules

# Copy source code
COPY apps/gateway/ ./apps/gateway/
COPY package.json tsconfig.base.json ./

# Set working directory to the service
WORKDIR /app/apps/gateway

# Expose the service port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/health || exit 1

# Start the service
CMD ["npx", "tsx", "src/server.ts"]
