#!/bin/bash

# Load environment variables
set -a
source ../.env.prod
set +a

# Create backup directory if it doesn't exist
BACKUP_DIR="/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup PostgreSQL database
echo "Backing up PostgreSQL database..."
docker exec trtcrd-postgres-1 pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > "$BACKUP_DIR/postgres_${TIMESTAMP}.sql.gz"

# Backup Redis data
echo "Backing up Redis data..."
docker exec trtcrd-redis-1 redis-cli -a $REDIS_PASSWORD SAVE
docker cp trtcrd-redis-1:/data/dump.rdb "$BACKUP_DIR/redis_${TIMESTAMP}.rdb"

# Backup configuration files
echo "Backing up configuration files..."
tar -czf "$BACKUP_DIR/config_${TIMESTAMP}.tar.gz" \
    ../.env.prod \
    ../traefik/ \
    ../prometheus.yml \
    ../grafana/provisioning/

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "postgres_*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "redis_*.rdb" -mtime +7 -delete
find $BACKUP_DIR -name "config_*.tar.gz" -mtime +7 -delete

# Upload to S3 (if configured)
if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ]; then
    echo "Uploading backups to S3..."
    aws s3 sync $BACKUP_DIR s3://${PROJECT_NAME,,}-backups/
fi

echo "Backup completed successfully!" 