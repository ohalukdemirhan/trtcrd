#!/bin/bash

# Set environment variables
export REACT_APP_API_URL=http://localhost:8000/api/v1
export REACT_APP_ENV=development

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting development server..."
npm start 