#!/bin/bash

echo "🛑 Stopping all Tome Connector Studio servers..."

# Stop editor server
echo "📝 Stopping editor server..."
pkill -f "editor-server.js" 2>/dev/null

# Stop any node processes on port 3003
echo "🔌 Stopping processes on port 3003..."
lsof -ti:3003 | xargs kill -9 2>/dev/null

# Stop vite dev server
echo "⚡ Stopping Vite dev server..."
pkill -f "vite" 2>/dev/null

# Stop esbuild
echo "🔨 Stopping esbuild..."
pkill -f "esbuild" 2>/dev/null

# Stop playwright test servers
echo "🧪 Stopping Playwright test servers..."
pkill -f "playwright.*test-server" 2>/dev/null

# Stop any remaining node processes related to log-view-machine
echo "🖥️  Stopping log-view-machine processes..."
pkill -f "log-view-machine" 2>/dev/null

# Check if anything is still running
echo "🔍 Checking for remaining processes..."
ps aux | grep -E "(3003|editor-server|tome.*connector|log-view-machine)" | grep -v grep

echo "✅ Server cleanup complete!"


