#!/bin/sh

# Wait for database to be ready
sleep 10

# Run migrations
npx prisma migrate deploy

# Start the app
node dist/src/main.js