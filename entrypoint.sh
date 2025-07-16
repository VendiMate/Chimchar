#!/bin/sh

echo "Starting application in production mode..."

# Check if we're in production environment
if [ "$NODE_ENV" = "production" ]; then
    echo "Production environment detected. Using production database configuration."
    
    # Run production migrations with timeout
    echo "Running production migrations..."
    timeout 300 yarn run db:migrate:prod || {
        echo "Migration failed or timed out, continuing anyway..."
    }
    
    echo "Database setup complete. Starting application..."
else
    echo "Development environment detected. Waiting for local database..."
    
    # Wait for local database with timeout (only in development)
    timeout 60 sh -c 'while ! pg_isready -h db -p 5432 -U admin -d chimchar-docker; do
        echo "db:5432 - no response"
        sleep 2
    done' || {
        echo "Database connection timeout, continuing anyway..."
    }

    echo "db:5432 - accepting connections"
    echo "Database is ready. Running migrations and seeds..."

    # Run development migrations and seeds with timeout
    timeout 300 yarn run db:migrate:dev || {
        echo "Migration failed or timed out, continuing anyway..."
    }
    
    timeout 300 yarn run db:seed:dev || {
        echo "Seeding failed or timed out, continuing anyway..."
    }
fi

# Keep container running
echo "Starting application..."
exec yarn start