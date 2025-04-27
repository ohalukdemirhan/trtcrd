# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with specific flags for production and skip husky
ENV HUSKY=0
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install --legacy-peer-deps

# Copy source code and configuration
COPY . .

# Set environment variables
ENV REACT_APP_API_URL=/api/v1
ENV REACT_APP_ENV=production
ENV NODE_ENV=production

# Build the application
RUN npx react-scripts build

# Production stage
FROM nginx:alpine-slim

# Install curl for healthcheck (with cleanup)
RUN apk add --no-cache curl && \
    # Add security headers
    echo 'add_header X-Frame-Options "SAMEORIGIN";' > /etc/nginx/conf.d/security-headers.conf && \
    echo 'add_header X-Content-Type-Options "nosniff";' >> /etc/nginx/conf.d/security-headers.conf && \
    echo 'add_header X-XSS-Protection "1; mode=block";' >> /etc/nginx/conf.d/security-headers.conf

# Copy nginx configuration
COPY config/nginx.conf /etc/nginx/nginx.conf

# Copy built files from build stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create a health check endpoint
RUN echo 'healthy' > /usr/share/nginx/html/health && \
    # Set permissions
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Start nginx with optimized settings
CMD ["nginx", "-g", "daemon off;"] 