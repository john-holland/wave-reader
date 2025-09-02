#!/bin/bash

echo "🛑 Stopping all Tome Connector Studio servers..."

# Stop editor server (multiple possible names/paths)
echo "📝 Stopping editor server..."
pkill -f "editor-server.js" 2>/dev/null
pkill -f "editor-build/editor-server.js" 2>/dev/null
pkill -f "tome-connector-editor" 2>/dev/null

# Stop any node processes on port 3003 (editor server port)
echo "🔌 Stopping processes on port 3003..."
lsof -ti:3003 | xargs kill -9 2>/dev/null

# Stop any node processes on port 3000 (vite dev server port)
echo "🔌 Stopping processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null

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

# Stop any node processes running from log-view-machine directory
echo "📁 Stopping processes from log-view-machine directory..."
ps aux | grep -E "node.*log-view-machine" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null

# Check if anything is still running
echo "🔍 Checking for remaining processes..."
echo "Port 3003 (editor server):"
lsof -i :3003 2>/dev/null || echo "  ✅ Port 3003 is free"
echo "Port 3000 (vite dev server):"
lsof -i :3000 2>/dev/null || echo "  ✅ Port 3000 is free"
echo "Related processes:"
ps aux | grep -E "(3003|3000|editor-server|tome.*connector|log-view-machine|vite)" | grep -v grep || echo "  ✅ No related processes found"

echo "✅ Server cleanup complete!"


