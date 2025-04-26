#!/bin/bash

# Navigate to frontend directory
cd frontend

# Install Tailwind CSS and its dependencies
npm install --legacy-peer-deps tailwindcss@^3.3.0 postcss@^8.4.31 autoprefixer@^10.4.16

# Install UI libraries
npm install --legacy-peer-deps @headlessui/react@^1.7.17 @radix-ui/react@^1.0.0 framer-motion@^10.16.4 react-spring@^9.7.3

# Install chart libraries
npm install --legacy-peer-deps recharts@^2.9.0

# Install icon libraries
npm install --legacy-peer-deps lucide-react@^0.292.0

# Install state management
npm install --legacy-peer-deps zustand@^4.4.6

# Install form libraries
npm install --legacy-peer-deps react-hook-form@^7.48.2 zod@^3.22.4 @hookform/resolvers@^3.3.2

# Create Tailwind config files
npx tailwindcss init -p

echo "All dependencies installed successfully!" 