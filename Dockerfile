# Multi-stage Dockerfile for Product Generator
# Optimized for production deployment

# Stage 1: Build client
FROM node:20-alpine AS client-builder

# Accept build arguments for Vite environment variables
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_BASE_URL

# Set them as environment variables for the build
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy client source
COPY client/ ./
COPY shared/ ../shared/

# Build client
RUN npm run build

# Stage 2: Server setup
FROM node:20-alpine AS server-setup

WORKDIR /app

# Install server dependencies (production only)
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Stage 3: Final production image
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy server files and dependencies
COPY --from=server-setup --chown=nodejs:nodejs /app/server ./server
COPY --chown=nodejs:nodejs server/src ./server/src
COPY --chown=nodejs:nodejs shared ./shared

# Copy built client files
COPY --from=client-builder --chown=nodejs:nodejs /app/client/dist ./client/dist

# Create necessary directories
RUN mkdir -p /app/server/uploads /app/server/data && \
    chown -R nodejs:nodejs /app/server/uploads /app/server/data

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5050

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5050/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start server
CMD ["node", "server/src/index.js"]
