ARG NODE_ENV
ARG NPM_TOKEN

FROM node:20.17.0-alpine3.20 as base

# Install PostgreSQL client and nodemon globally
RUN apk add --no-cache postgresql-client && \
    npm install -g nodemon

# Create app directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy all project files into the container
COPY . .

# Copy and set permissions for entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set the environment variable for NODE_ENV
ENV NODE_ENV $NODE_ENV

# Use ENTRYPOINT to ensure the script runs with sh
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]
