# ============================================
# LocalVibe Business Service - Dockerfile
# ============================================
# Multi-stage build for optimized production image.

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy root workspace files
COPY package.json package-lock.json ./
COPY apps/business-service/package.json ./apps/business-service/
COPY libs/shared-types/package.json ./libs/shared-types/
COPY libs/shared-utils/package.json ./libs/shared-utils/

# Install all dependencies
RUN npm ci --ignore-scripts

# Stage 2: Build and run
FROM node:20-alpine AS runner
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/business-service/node_modules ./apps/business-service/node_modules

# Copy source code
COPY apps/business-service/ ./apps/business-service/
COPY libs/shared-types/ ./libs/shared-types/
COPY libs/shared-utils/ ./libs/shared-utils/
COPY package.json tsconfig.base.json ./

# Set working directory to the service
WORKDIR /app/apps/business-service

# Expose the service port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/health || exit 1

# Start the service
CMD ["npx", "tsx", "src/server.ts"]
