#!/bin/bash

# Run the frontend service with Docker
echo "Starting frontend service with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Build and start the frontend service with Docker Compose
echo "Building and starting frontend service with Docker Compose..."
docker-compose up --build -d frontend

# Wait for service to be ready
echo "Waiting for service to be ready..."
sleep 5

# Check if service is running
if docker-compose ps frontend | grep -q "Up"; then
  echo "Frontend service is running!"
  echo "Frontend: http://localhost:3000"
else
  echo "Error: Frontend service failed to start. Check docker-compose logs for details."
  docker-compose logs frontend
  exit 1
fi

# Show logs
echo "Showing logs (press Ctrl+C to exit)..."
docker-compose logs -f frontend 