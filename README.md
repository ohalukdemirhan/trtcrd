# TrtCrd - Translation and Compliance Management

TrtCrd is a comprehensive solution for businesses that need translations with compliance validation, particularly in regulated industries.

## Features

- **Translation Service**: Translate text between multiple languages
- **Compliance Checking**: Validate translations against regulatory requirements (GDPR, KVKK, etc.)
- **User Management**: Secure authentication and user profiles
- **Subscription Management**: Tiered subscription plans with usage tracking

## Tech Stack

- **Frontend**: React, TypeScript, Material UI, Redux
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **Caching**: Redis
- **Containerization**: Docker

## Quick Start

The easiest way to run the entire application stack is using Docker Compose:

```bash
# Make the run script executable
chmod +x run.sh

# Run the application
./run.sh
```

This will start all the services and make the application available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1
- API Documentation: http://localhost:8000/docs

To stop all services:

```bash
# Make the stop script executable
chmod +x stop.sh

# Stop all services
./stop.sh
```

## Development Setup

### Frontend Development

You can run the frontend development server without Docker:

```bash
# Make the script executable
chmod +x run-frontend-dev.sh

# Run the frontend development server
./run-frontend-dev.sh
```

Alternatively, you can run the frontend with Docker:

```bash
# Make the script executable
chmod +x run-frontend-docker.sh

# Run the frontend service with Docker
./run-frontend-docker.sh
```

Or you can run the frontend manually:

```bash
cd frontend
export REACT_APP_API_URL=http://localhost:8000/api/v1
export REACT_APP_ENV=development
export NODE_OPTIONS=--openssl-legacy-provider
npm install --legacy-peer-deps
npm start
```

The frontend will be available at http://localhost:3000.

### Backend Development

You can run the backend services using Docker:

```bash
# Make the script executable
chmod +x run-backend.sh

# Run the backend services
./run-backend.sh
```

This will start the backend, PostgreSQL, and Redis services using Docker Compose.

Alternatively, you can run the backend manually:

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example`
5. Run the backend server:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
6. The API will be available at http://localhost:8000

## Docker Compose

The application is containerized using Docker Compose. The following services are defined:

- **frontend**: React frontend served by Nginx
- **backend**: FastAPI backend
- **postgres**: PostgreSQL database
- **redis**: Redis cache

To run the services individually:

```bash
# Start only the backend services
docker-compose up -d backend postgres redis

# Start only the frontend
docker-compose up -d frontend
```

## API Documentation

API documentation is available at `/docs` or `/redoc` when the backend is running.

## License

[MIT License](LICENSE) 