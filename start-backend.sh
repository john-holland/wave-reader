#!/bin/bash

# Wave Reader Backend Startup Script
echo "🚀 Starting Wave Reader Backend Services..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create necessary directories
mkdir -p logs
mkdir -p grafana/provisioning/datasources
mkdir -p grafana/provisioning/dashboards

# Create Grafana datasource configuration
cat > grafana/provisioning/datasources/prometheus.yml << EOF
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
EOF

# Create Grafana dashboard configuration
cat > grafana/provisioning/dashboards/dashboard.yml << EOF
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /etc/grafana/provisioning/dashboards
EOF

# Create a basic Grafana dashboard
cat > grafana/provisioning/dashboards/wave-reader-dashboard.json << EOF
{
  "dashboard": {
    "id": null,
    "title": "Wave Reader Backend Metrics",
    "tags": ["wave-reader", "backend"],
    "timezone": "browser",
    "panels": [
      {
        "id": 1,
        "title": "HTTP Request Duration",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "id": 2,
        "title": "HTTP Requests Total",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "requests/sec"
          }
        ]
      },
      {
        "id": 3,
        "title": "Component Operations",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(component_operations_total[5m])",
            "legendFormat": "operations/sec"
          }
        ]
      }
    ]
  }
}
EOF

# Start services with Docker Compose
echo "📦 Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend service is healthy"
else
    echo "❌ Backend service is not responding"
fi

# Display service URLs
echo ""
echo "🌐 Service URLs:"
echo "   Backend API:     http://localhost:3000"
echo "   Health Check:    http://localhost:3000/health"
echo "   Metrics:         http://localhost:3000/metrics"
echo "   Prometheus:      http://localhost:9090"
echo "   Grafana:         http://localhost:3001 (admin/admin)"
echo "   Jaeger UI:       http://localhost:16686"
echo ""
echo "📊 To view metrics:"
echo "   1. Open Grafana at http://localhost:3001"
echo "   2. Login with admin/admin"
echo "   3. Add Prometheus as a data source (http://prometheus:9090)"
echo "   4. Import the Wave Reader dashboard"
echo ""
echo "🔍 To view traces:"
echo "   1. Open Jaeger UI at http://localhost:16686"
echo "   2. Select 'wave-reader-backend' service"
echo "   3. View request traces and spans"
echo ""
echo "🎯 To test the API:"
echo "   curl -X POST http://localhost:3000/api/components/operation \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"component\":\"test\",\"operation\":\"test\",\"data\":{}}'"
echo ""
echo "🚀 All services are starting up. Check the logs with:"
echo "   docker-compose logs -f"
