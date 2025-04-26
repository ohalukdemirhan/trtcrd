#!/bin/bash

# Stop all services
echo "Stopping all services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi

# Stop all services with Docker Compose
echo "Stopping services with Docker Compose..."
docker-compose down

echo "All services have been stopped." 