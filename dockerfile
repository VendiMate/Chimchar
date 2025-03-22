FROM node:20.17.0-alpine3.20 as base

RUN apk add --no-cache postgresql-client && \
npm install -g nodemon

#Create working directory
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# Copy and set permissions for entrypoint
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Set the environment variable for NODE_ENV
ENV NODE_ENV $NODE_ENV

# Use ENTRYPOINT to ensure the script runs with sh
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

