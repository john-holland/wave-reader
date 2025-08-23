#!/bin/bash

# Enhanced Wave Reader Backend Startup Script
# This script sets up and starts the ML-powered backend server

echo "🌊 Starting Enhanced Wave Reader Backend..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Navigate to backend directory
cd "$(dirname "$0")/src/backend" || {
    echo "❌ Failed to navigate to backend directory"
    exit 1
}

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if enhanced-server.js exists
if [ ! -f "enhanced-server.js" ]; then
    echo "❌ enhanced-server.js not found. Please ensure the file exists."
    exit 1
fi

# Set environment variables
export NODE_ENV=${NODE_ENV:-development}
export PORT=${PORT:-3001}

echo "🌍 Environment: $NODE_ENV"
echo "🔌 Port: $PORT"
echo ""

# Start the enhanced server
echo "🚀 Starting Enhanced Wave Reader Backend..."
echo "📊 ML Service: Initializing..."
echo "🌊 Wave Reader Service: Starting..."
echo "📈 Analytics Service: Starting..."
echo "🔧 Extension Service: Starting..."
echo ""

# Start the server
node enhanced-server.js

# Handle server exit
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Enhanced Wave Reader Backend stopped gracefully"
else
    echo ""
    echo "❌ Enhanced Wave Reader Backend stopped with errors"
    exit 1
fi
