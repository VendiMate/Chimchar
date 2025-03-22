#!/bin/sh

echo "Waiting for database to be ready..."
while ! pg_isready -h db -p 5430 -U admin -d chimchar-docker
do
    echo "db:5430 - no response"
    sleep 2
done

echo "Database is ready"
echo "Database is ready. Running migrations and seeds..."

# Run migrations
yarn run db:migrate:dev
yarn run db:seed:dev

# Keep container running
echo "Starting application..."
exec yarn start