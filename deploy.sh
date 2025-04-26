#!/bin/bash

# Exit script if any command fails
set -e

# Define color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of trtcrd application...${NC}"

# Create nginx.conf if it doesn't exist
echo -e "${YELLOW}Creating nginx configuration...${NC}"
cat > nginx.conf << 'EOL'
worker_processes auto;
pid /tmp/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    server_tokens off;

    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Health check endpoint
        location /health {
            access_log off;
            add_header Content-Type text/plain;
            return 200 'healthy';
        }

        # API requests
        location /api/v1 {
            proxy_pass http://trtcrd-backend:8000/api/v1;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Serve static files
        location / {
            try_files $uri $uri/ /index.html;
            expires 1d;
            add_header Cache-Control "public, max-age=86400";
        }

        # Error pages
        error_page 404 /index.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
EOL

# Pull the latest Docker images
echo -e "${YELLOW}Pulling latest Docker images...${NC}"
docker pull halukdemirhan/trtcrd-frontend:latest
docker pull halukdemirhan/trtcrd-backend:latest

# Stop and remove any existing containers
echo -e "${YELLOW}Stopping and removing existing containers (if any)...${NC}"
docker rm -f trtcrd-frontend trtcrd-backend postgres redis 2>/dev/null || true

# Create a Docker network if it doesn't exist
echo -e "${YELLOW}Setting up Docker network...${NC}"
docker network create trtcrd-network 2>/dev/null || true

# Start PostgreSQL container
echo -e "${YELLOW}Starting PostgreSQL database...${NC}"
docker run -d \
  --name postgres \
  --network trtcrd-network \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=trtcrd \
  -v postgres-data:/var/lib/postgresql/data \
  postgres:14-alpine

# Start Redis container
echo -e "${YELLOW}Starting Redis cache...${NC}"
docker run -d \
  --name redis \
  --network trtcrd-network \
  -v redis-data:/data \
  redis:alpine redis-server --requirepass redis

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Start Backend container with all required environment variables
echo -e "${YELLOW}Starting Backend API...${NC}"
docker run -d \
  --name trtcrd-backend \
  --network trtcrd-network \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/trtcrd \
  -e REDIS_URL=redis://:redis@redis:6379/0 \
  -e SECRET_KEY=your_secret_key_here \
  -e ENVIRONMENT=production \
  -e POSTGRES_SERVER=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=trtcrd \
  -e REDIS_HOST=redis \
  -e REDIS_PASSWORD=redis \
  -e OPENAI_API_KEY=your_openai_api_key \
  -e AWS_ACCESS_KEY_ID=your_aws_access_key \
  -e AWS_SECRET_ACCESS_KEY=your_aws_secret_key \
  -e STRIPE_API_KEY=your_stripe_api_key \
  -e STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret \
  -e PADDLE_API_KEY=your_paddle_api_key \
  -e PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret \
  halukdemirhan/trtcrd-backend:latest

# Start Frontend container with custom nginx.conf
echo -e "${YELLOW}Starting Frontend application...${NC}"
docker run -d \
  --name trtcrd-frontend \
  --network trtcrd-network \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  halukdemirhan/trtcrd-frontend:latest

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}The application is now accessible at http://your-server-ip${NC}"

docker ps 