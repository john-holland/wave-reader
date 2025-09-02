# Wave Reader Backend

A robust Node.js backend service with OpenTelemetry integration, metrics collection, and k-nearest-neighbors analysis for the Wave Reader Chrome extension.

## 🚀 Features

- **OpenTelemetry Integration**: Distributed tracing with Jaeger and metrics with Prometheus
- **Metrics Collection**: Comprehensive performance and business metrics
- **k-NN Analysis**: Machine learning for metric pattern recognition
- **Artificial Data Generation**: Expanded training data for better ML models
- **Health Monitoring**: Built-in health checks and monitoring
- **Docker Support**: Easy deployment with Docker Compose
- **RESTful API**: Clean API endpoints for component operations

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Chrome       │    │   Wave Reader   │    │   Backend      │
│   Extension    │────│   Backend       │────│   Services     │
│                │    │   Server        │    │                │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   OpenTelemetry │
                       │   SDK           │
                       └─────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
            ┌─────────────┐         ┌─────────────┐
            │   Jaeger    │         │ Prometheus  │
            │   (Traces)  │         │ (Metrics)   │
            └─────────────┘         └─────────────┘
                    │                       │
                    ▼                       ▼
            ┌─────────────┐         ┌─────────────┐
            │   Grafana   │         │   k-NN      │
            │   (UI)      │         │   Model     │
            └─────────────┘         └─────────────┘
```

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- curl (for testing)

## 🚀 Quick Start

### 1. Start All Services

```bash
./start-backend.sh
```

This script will:
- Create necessary directories and configurations
- Start all services with Docker Compose
- Check service health
- Display service URLs and instructions

### 2. Manual Start

```bash
# Create directories
mkdir -p logs grafana/provisioning/{datasources,dashboards}

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### 3. Development Mode

```bash
# Install dependencies
npm install

# Start backend only
node src/backend/server.js
```

## 🌐 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Backend API | http://localhost:3000 | Main API server |
| Health Check | http://localhost:3000/health | Service health status |
| Metrics | http://localhost:3000/metrics | Prometheus metrics |
| Prometheus | http://localhost:9090 | Metrics collection |
| Grafana | http://localhost:3001 | Metrics visualization (admin/admin) |
| Jaeger UI | http://localhost:16686 | Distributed tracing |

## 📊 Metrics & Monitoring

### Available Metrics

#### HTTP Metrics
- `http_request_duration`: Request duration histogram
- `http_requests_total`: Total request count
- `http_requests_by_status`: Requests by status code
- `http_requests_by_method`: Requests by HTTP method

#### Component Metrics
- `component_operations_total`: Component operation count
- `component_errors_total`: Component error count
- `component_operation_duration`: Operation duration

#### Wave Animation Metrics
- `wave_animations_total`: Total wave animations
- `wave_animation_duration`: Animation duration
- `active_wave_animations`: Currently active animations

#### System Metrics
- `memory_usage_bytes`: Memory usage
- `cpu_usage_percent`: CPU usage
- `active_connections`: Active connections

### Viewing Metrics

1. **Prometheus**: http://localhost:9090
   - Query metrics directly
   - View time series data
   - Create basic graphs

2. **Grafana**: http://localhost:3001 (admin/admin)
   - Import the Wave Reader dashboard
   - Create custom visualizations
   - Set up alerts

## 🔍 Distributed Tracing

### Viewing Traces

1. Open Jaeger UI: http://localhost:16686
2. Select `wave-reader-backend` service
3. View request traces and spans
4. Analyze performance bottlenecks

### Trace Attributes

Each span includes:
- Component name and operation
- Request data size
- Duration measurements
- Error information
- Custom attributes

## 🤖 Machine Learning (k-NN)

### Features

- **Automatic Training**: Model trains every 6 hours
- **Artificial Data**: Generates synthetic training data
- **Real-time Prediction**: Predicts metric patterns
- **Confidence Scoring**: Provides prediction confidence

### API Endpoints

```bash
# Make prediction
curl -X POST http://localhost:3000/api/ml/predict \
  -H 'Content-Type: application/json' \
  -d '{"features": [123, 456, 789], "k": 5}'

# Train model
curl -X POST http://localhost:3000/api/ml/train

# Generate artificial data
curl -X POST http://localhost:3000/api/metrics/generate-data \
  -H 'Content-Type: application/json' \
  -d '{"count": 1000}'
```

## 📡 API Reference

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Component Operations
```http
POST /api/components/operation
Content-Type: application/json

{
  "component": "selector-hierarchy",
  "operation": "initialize",
  "data": { "selector": "p", "depth": 3 }
}
```

#### Wave Animations
```http
POST /api/wave/animation
Content-Type: application/json

{
  "animationType": "wave",
  "duration": 2000,
  "intensity": "high"
}
```

#### Selector Generation
```http
POST /api/selector/generate
Content-Type: application/json

{
  "elementType": "div",
  "complexity": "medium",
  "attributes": {
    "id": "content",
    "className": "main article"
  }
}
```

#### Metrics Statistics
```http
GET /api/metrics/stats
```

#### System Metrics
```http
GET /api/system/metrics
```

### Response Format

```json
{
  "success": true,
  "data": {},
  "duration": 150,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "traceId": "abc123..."
}
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3000/health
```

### Component Operation
```bash
curl -X POST http://localhost:3000/api/components/operation \
  -H 'Content-Type: application/json' \
  -d '{
    "component": "test",
    "operation": "test",
    "data": {"test": true}
  }'
```

### Wave Animation
```bash
curl -X POST http://localhost:3000/api/wave/animation \
  -H 'Content-Type: application/json' \
  -d '{
    "animationType": "test",
    "duration": 1000,
    "intensity": "medium"
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Node environment |
| `PORT` | `3000` | Backend server port |
| `PROMETHEUS_PORT` | `9464` | Prometheus metrics port |
| `JAEGER_ENDPOINT` | `http://jaeger:14268/api/traces` | Jaeger collector endpoint |

### Docker Compose

Services can be configured in `docker-compose.yml`:
- Port mappings
- Volume mounts
- Environment variables
- Resource limits

## 📝 Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f wave-reader-backend

# Last 100 lines
docker-compose logs --tail=100 wave-reader-backend
```

### Log Locations
- Application logs: `./logs/`
- Docker logs: `docker-compose logs`
- Prometheus logs: `docker-compose logs prometheus`
- Jaeger logs: `docker-compose logs jaeger`

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Docker Services Not Starting**
   ```bash
   # Check Docker status
   docker info
   
   # Restart Docker
   sudo systemctl restart docker
   ```

3. **Metrics Not Showing**
   ```bash
   # Check Prometheus targets
   curl http://localhost:9090/api/v1/targets
   
   # Check backend metrics endpoint
   curl http://localhost:3000/metrics
   ```

4. **Traces Not Appearing**
   ```bash
   # Check Jaeger status
   curl http://localhost:16686/api/services
   
   # Verify backend is sending traces
   docker-compose logs wave-reader-backend | grep trace
   ```

### Debug Mode

Enable debug logging:
```bash
export DEBUG=*
node src/backend/server.js
```

## 🔄 Maintenance

### Scheduled Tasks

- **Hourly**: Generate artificial data
- **Every 6 hours**: Train k-NN model
- **Daily**: Clean up old metrics

### Data Retention

- **Metrics**: 7 days (configurable)
- **Traces**: 24 hours (Jaeger default)
- **Artificial Data**: 10,000 records max

### Backup

```bash
# Backup Prometheus data
docker run --rm -v wave-reader_prometheus_data:/data -v $(pwd):/backup alpine tar czf /backup/prometheus-backup.tar.gz -C /data .

# Backup Grafana data
docker run --rm -v wave-reader_grafana_data:/data -v $(pwd):/backup alpine tar czf /backup/grafana-backup.tar.gz -C /data .
```

## 📚 Additional Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Prometheus Query Language](https://prometheus.io/docs/prometheus/latest/querying/)
- [Grafana Dashboards](https://grafana.com/docs/grafana/latest/dashboards/)
- [Jaeger Tracing](https://www.jaegertracing.io/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
