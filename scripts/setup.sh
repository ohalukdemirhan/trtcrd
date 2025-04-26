#!/bin/bash

# Create necessary directories
mkdir -p traefik/config postgres/init postgres/backup grafana/provisioning

# Copy configuration files
cp docker-compose.prod.yml docker-compose.yml
cp traefik/traefik.yml traefik/
cp prometheus.yml .
cp scripts/backup.sh scripts/

# Set correct permissions
chmod +x scripts/backup.sh
chmod 600 traefik/acme.json

# Create docker networks
docker network create traefik-net
docker network create backend-net
docker network create monitoring-net

# Pull required images
docker-compose pull

echo "Setup completed successfully!" 