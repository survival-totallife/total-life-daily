# Frontend Dockerfile for Vite + React
# Multi-stage build for optimized production image

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (for better layer caching)
COPY package.json package-lock.json* ./

# Install dependencies (using legacy-peer-deps for React 19 compatibility)
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build arguments for environment variables (available at build time)
ARG VITE_API_URL
ARG VITE_YOUTUBE_API_KEY
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Build the application
RUN npm run build

# Stage 2: Serve with nginx (using slim alpine image)
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration as template
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port (will be overridden by Cloud Run's PORT env var)
EXPOSE 8080

# Environment variable for port (Cloud Run will set this)
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
