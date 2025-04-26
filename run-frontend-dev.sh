#!/bin/bash

# Run the frontend development server
echo "Starting frontend development server..."

# Navigate to the frontend directory
cd frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Node.js is not installed. Please install Node.js and try again."
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -gt "16" ]; then
  echo "Warning: You are using Node.js v$(node -v). This project works best with Node.js v16."
  echo "You may encounter issues with newer Node.js versions."
  echo "Setting NODE_OPTIONS to handle OpenSSL issues in newer Node.js versions..."
fi

# Run the start-dev.sh script
echo "Running start-dev.sh script..."
./start-dev.sh 