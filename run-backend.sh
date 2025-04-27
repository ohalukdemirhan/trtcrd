#!/bin/bash

# Run the backend services
echo "Starting backend services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Creating .env file..."
  cp .env.example .env 2>/dev/null || {
    echo "# Domain Configuration
DOMAIN=localhost

# Backend Configuration
PROJECT_NAME=TrtCrd
VERSION=1.0.0
API_V1_STR=/api/v1

# Security
SECRET_KEY=dummy-secret-key-for-development-only
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# CORS
CORS_ORIGINS=[\"http://localhost:3000\"]
CORS_METHODS=[\"GET\",\"POST\",\"PUT\",\"DELETE\",\"OPTIONS\",\"PATCH\"]
CORS_HEADERS=[\"*\"]
CORS_CREDENTIALS=true
CORS_MAX_AGE=3600

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=trtcrd
POSTGRES_SERVER=postgres
SQLALCHEMY_DATABASE_URI=postgresql://postgres:postgres@postgres/trtcrd

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis

# OpenAI Configuration (placeholder)
OPENAI_API_KEY=dummy-openai-key

# AWS Configuration (placeholder)
AWS_ACCESS_KEY_ID=dummy-aws-key
AWS_SECRET_ACCESS_KEY=dummy-aws-secret
AWS_REGION=us-west-2

# Stripe Configuration (placeholder)
STRIPE_API_KEY=dummy-stripe-key
STRIPE_WEBHOOK_SECRET=dummy-stripe-webhook-secret

# Paddle Configuration (placeholder)
PADDLE_API_KEY=dummy-paddle-key
PADDLE_WEBHOOK_SECRET=dummy-paddle-webhook-secret
PADDLE_VENDOR_ID=dummy-paddle-vendor-id

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENV=development
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
REACT_APP_PADDLE_VENDOR_ID=your_paddle_vendor_id
NODE_ENV=development" > .env
  }
fi

# Build and start the backend services with Docker Compose
echo "Building and starting backend services with Docker Compose..."
docker-compose up --build -d backend postgres redis

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
  echo "Backend services are running!"
  echo "Backend API: http://localhost:8000/api/v1"
  echo "API Documentation: http://localhost:8000/docs"
else
  echo "Error: Services failed to start. Check docker-compose logs for details."
  docker-compose logs
  exit 1
fi

# Show logs
echo "Showing logs (press Ctrl+C to exit)..."
docker-compose logs -f backend 