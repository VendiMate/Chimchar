#!/bin/sh

echo "Starting application in production mode..."

# Check if we're in production environment
if [ "$NODE_ENV" = "production" ]; then
    echo "Production environment detected. Using production database configuration."
    
    # Run production migrations
    echo "Running production migrations..."
    yarn run db:migrate:prod
    
    echo "Database setup complete. Starting application..."
else
    echo "Development environment detected. Waiting for local database..."
    
    # Wait for local database (only in development)
    while ! pg_isready -h db -p 5432 -U admin -d chimchar-docker
    do
        echo "db:5432 - no response"
        sleep 2
    done

    echo "db:5432 - accepting connections"
    echo "Database is ready. Running migrations and seeds..."

    # Run development migrations and seeds
    yarn run db:migrate:dev
    yarn run db:seed:dev

fi

# Keep container running
echo "Starting application..."
exec yarn start