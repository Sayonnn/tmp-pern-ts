#!/bin/bash
# scripts/refresh_seed.sh

# Name of your Postgres container (must match docker-compose.yml)
CONTAINER_NAME=db_speedmate
DB_USER=speedmate
DB_NAME=db_speedmate
DB_PASSWORD=speedmate19!

#OUTPUT FILE
OUTPUT_FILE=./outputs/speedmate.sql

echo "📦 Exporting database '$DB_NAME' from container '$CONTAINER_NAME'..."

docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $OUTPUT_FILE

if [ $? -eq 0 ]; then
  echo "✅ Database exported successfully to $OUTPUT_FILE"
else
  echo "❌ Failed to export database"
fi
