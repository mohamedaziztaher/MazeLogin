#!/bin/bash

# Script to start MongoDB for MazeID project

echo "Starting MongoDB for MazeID..."

# Check if MongoDB is already running
if pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is already running!"
    exit 0
fi

# Try to start MongoDB service
if systemctl is-active --quiet mongodb 2>/dev/null; then
    echo "MongoDB service is already active!"
    exit 0
fi

# Try starting with systemctl (requires sudo)
echo "Attempting to start MongoDB service..."
if sudo systemctl start mongodb 2>/dev/null; then
    echo "✓ MongoDB started successfully via systemctl"
    exit 0
fi

# Try starting MongoDB directly
echo "Attempting to start MongoDB directly..."
if command -v mongod &> /dev/null; then
    # Create data directory if it doesn't exist
    mkdir -p ~/mongo-data/db
    
    # Start MongoDB in the background
    mongod --dbpath ~/mongo-data/db --port 27017 > /tmp/mongod.log 2>&1 &
    MONGO_PID=$!
    
    # Wait a moment to see if it starts
    sleep 2
    
    if ps -p $MONGO_PID > /dev/null; then
        echo "✓ MongoDB started successfully (PID: $MONGO_PID)"
        echo "  Data directory: ~/mongo-data/db"
        echo "  Log file: /tmp/mongod.log"
        echo "  To stop: kill $MONGO_PID"
        exit 0
    else
        echo "✗ Failed to start MongoDB. Check /tmp/mongod.log for errors."
        exit 1
    fi
else
    echo "✗ MongoDB (mongod) not found in PATH"
    echo ""
    echo "Please install MongoDB or start it manually:"
    echo "  - Arch Linux: sudo pacman -S mongodb"
    echo "  - Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    exit 1
fi

