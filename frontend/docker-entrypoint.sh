#!/bin/sh
set -e

# Use PORT environment variable, default to 8080
PORT=${PORT:-8080}
export PORT

echo "Configuring nginx to listen on port $PORT..."

# Replace PORT placeholder in nginx config
envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Nginx configuration complete. Starting nginx..."

# Start nginx
exec nginx -g "daemon off;"
