#!/bin/bash

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to install dependencies if needed
install_deps() {
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install --legacy-peer-deps
    fi
}

# Function to set environment variables
set_env() {
    local env=$1
    export NODE_OPTIONS=--openssl-legacy-provider
    
    if [ "$env" = "development" ]; then
        export REACT_APP_API_URL=http://localhost:8000/api/v1
        export REACT_APP_ENV=development
    else
        export REACT_APP_API_URL=/api/v1
        export REACT_APP_ENV=production
    fi
}

# Function to start development server
start_dev() {
    set_env "development"
    install_deps
    echo "Starting development server..."
    npm start
}

# Function to build for production
build_prod() {
    set_env "production"
    install_deps
    echo "Building the application for production..."
    npm run build
    echo "Build completed. The production files are in the build/ directory."
}

# Function to run with Docker Compose
run_docker() {
    check_docker
    echo "Starting TrtCrd application..."
    echo "Starting services with Docker Compose..."
    docker-compose up -d

    echo "Waiting for services to be ready..."
    sleep 5

    if docker-compose ps | grep -q "Up"; then
        echo "Services are running!"
        echo "Frontend: http://localhost:3000"
        echo "Backend API: http://localhost:8000/api/v1"
        echo "API Documentation: http://localhost:8000/docs"
    else
        echo "Error: Services failed to start. Check docker-compose logs for details."
        exit 1
    fi
}

# Main script logic
case "$1" in
    "dev")
        start_dev
        ;;
    "build")
        build_prod
        ;;
    "docker")
        run_docker
        ;;
    *)
        echo "Usage: $0 {dev|build|docker}"
        echo "  dev    - Start development server"
        echo "  build  - Build for production"
        echo "  docker - Run with Docker Compose"
        exit 1
        ;;
esac 