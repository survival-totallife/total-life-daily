#!/bin/bash
# Quick start script for Mac/Linux
# This script helps you get Total Life Daily running quickly

echo "================================"
echo "Total Life Daily - Quick Start"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "[1/3] Creating .env file from example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your GOOGLE_API_KEY"
    echo "   Get your key at: https://aistudio.google.com/apikey"
    echo ""
    read -p "Press Enter after you've edited .env with your API key..."
else
    echo "[1/3] .env file exists ✓"
fi

echo ""
echo "[2/3] Starting Docker containers..."
echo "This will take 2-3 minutes on first run"
echo ""

docker-compose up --build

# If docker-compose fails, show helpful error
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to start Docker containers"
    echo ""
    echo "Make sure:"
    echo "1. Docker Desktop is installed and running"
    echo "2. You have edited .env with your GOOGLE_API_KEY"
    echo ""
fi
