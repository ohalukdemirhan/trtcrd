# TrtCrd Frontend

This is the frontend for the TrtCrd application, a comprehensive solution for businesses that need translations with compliance validation, particularly in regulated industries.

## Features

- Translation management
- Compliance checking
- User management
- Subscription management
- Usage tracking

## Tech Stack

- React
- TypeScript
- Material UI
- Redux Toolkit
- React Router
- Axios

## Development Setup

### Prerequisites

- Node.js (v16 recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```

### Running the Development Server

You can use the provided script to start the development server:

```
./start-dev.sh
```

This script sets the necessary environment variables and starts the development server.

Alternatively, you can run the following commands manually:

```
export REACT_APP_API_URL=http://localhost:8000/api/v1
export REACT_APP_ENV=development
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

The application will be available at http://localhost:3000.

### Building for Production

You can use the provided script to build the application for production:

```
./build-prod.sh
```

This script sets the necessary environment variables and builds the application.

Alternatively, you can run the following commands manually:

```
export REACT_APP_API_URL=/api/v1
export REACT_APP_ENV=production
export NODE_OPTIONS=--openssl-legacy-provider
npm run build
```

The production files will be in the `build/` directory.

## Docker

You can also run the frontend using Docker:

```
docker build -t trtcrd-frontend .
docker run -p 3000:80 trtcrd-frontend
```

## Running with Docker Compose

You can run the entire application stack (frontend, backend, database, and cache) using Docker Compose:

```
docker-compose up -d
```

This will start all the services and make the application available at http://localhost:3000.

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components
- `src/routes`: Application routes
- `src/store`: Redux store and slices
- `src/services`: API services
- `src/theme`: Theme configuration
- `src/types`: TypeScript type definitions
- `src/utils`: Utility functions 