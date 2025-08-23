const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('winston');
const { telemetryManager } = require('../telemetry/opentelemetry');
const { metricsService } = require('../services/metrics-service');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenTelemetry
async function initializeTelemetry() {
  try {
    await telemetryManager.initialize();
    console.log('✅ OpenTelemetry initialized');
  } catch (error) {
    console.error('❌ Failed to initialize OpenTelemetry:', error);
  }
}

// Initialize Metrics Service
function initializeMetrics() {
  try {
    // Generate initial artificial data
    metricsService.generateArtificialData(2000);
    
    // Train initial k-NN model
    setTimeout(async () => {
      await metricsService.trainKNNModel();
    }, 5000);
    
    console.log('✅ Metrics service initialized');
  } catch (error) {
    console.error('❌ Failed to initialize metrics service:', error);
  }
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Record request start
  metricsService.incrementCounter('http_requests_total', 1, {
    method: req.method,
    path: req.path,
    userAgent: req.get('User-Agent') || 'unknown',
  });
  
  // Add response listener
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Record request duration
    metricsService.recordHistogram('http_request_duration', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });
    
    // Record status code
    metricsService.incrementCounter('http_requests_by_status', 1, {
      status: res.statusCode,
      method: req.method,
    });
    
    // Record method
    metricsService.incrementCounter('http_requests_by_method', 1, {
      method: req.method,
      path: req.path,
    });
  });
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    telemetry: telemetryManager.getHealthStatus(),
    metrics: metricsService.getHealthStatus(),
  };
  
  res.status(200).json(healthStatus);
});

// Metrics endpoint (Prometheus format)
app.get('/metrics', async (req, res) => {
  try {
    const metricsEndpoint = telemetryManager.getMetricsEndpoint();
    if (metricsEndpoint) {
      const metrics = await metricsEndpoint.getMetricsRequestHandler()(req, res);
      return metrics;
    } else {
      res.status(503).json({ error: 'Metrics not available' });
    }
  } catch (error) {
    console.error('Error serving metrics:', error);
    res.status(500).json({ error: 'Failed to serve metrics' });
  }
});

// API Routes

// Component operations
app.post('/api/components/operation', async (req, res) => {
  const span = telemetryManager.createSpan('component_operation');
  
  try {
    const { component, operation, data } = req.body;
    const startTime = Date.now();
    
    // Add span attributes
    telemetryManager.addSpanAttributes(span, {
      component,
      operation,
      dataSize: JSON.stringify(data).length,
    });
    
    // Record component operation
    metricsService.incrementCounter('component_operations_total', 1, {
      component,
      operation,
    });
    
    // Simulate operation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
    
    const duration = Date.now() - startTime;
    
    // Record operation duration
    metricsService.recordHistogram('component_operation_duration', duration, {
      component,
      operation,
    });
    
    // Update active connections gauge
    metricsService.setGauge('active_connections', Math.floor(Math.random() * 100));
    
    const result = {
      success: true,
      component,
      operation,
      duration,
      timestamp: new Date().toISOString(),
      traceId: span.spanContext().traceId,
    };
    
    span.setStatus({ code: 1 }); // OK
    res.status(200).json(result);
    
  } catch (error) {
    span.setStatus({ code: 2, message: error.message }); // Error
    metricsService.incrementCounter('component_errors_total', 1, {
      component: req.body?.component || 'unknown',
      operation: req.body?.operation || 'unknown',
    });
    
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
});

// Wave animation operations
app.post('/api/wave/animation', async (req, res) => {
  const span = telemetryManager.createSpan('wave_animation');
  
  try {
    const { animationType, duration, intensity } = req.body;
    const startTime = Date.now();
    
    // Add span attributes
    telemetryManager.addSpanAttributes(span, {
      animationType,
      duration,
      intensity,
    });
    
    // Record wave animation
    metricsService.incrementCounter('wave_animations_total', 1, {
      animationType,
      intensity: intensity || 'medium',
    });
    
    // Simulate animation
    await new Promise(resolve => setTimeout(resolve, duration || 1000));
    
    const actualDuration = Date.now() - startTime;
    
    // Record animation duration
    metricsService.recordHistogram('wave_animation_duration', actualDuration, {
      animationType,
      intensity: intensity || 'medium',
    });
    
    // Update active animations gauge
    const currentActive = Math.floor(Math.random() * 10);
    metricsService.setGauge('active_wave_animations', currentActive);
    
    const result = {
      success: true,
      animationType,
      duration: actualDuration,
      activeAnimations: currentActive,
      timestamp: new Date().toISOString(),
      traceId: span.spanContext().traceId,
    };
    
    span.setStatus({ code: 1 }); // OK
    res.status(200).json(result);
    
  } catch (error) {
    span.setStatus({ code: 2, message: error.message }); // Error
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
});

// Selector operations
app.post('/api/selector/generate', async (req, res) => {
  const span = telemetryManager.createSpan('selector_generation');
  
  try {
    const { elementType, complexity, attributes } = req.body;
    const startTime = Date.now();
    
    // Add span attributes
    telemetryManager.addSpanAttributes(span, {
      elementType,
      complexity,
      attributesCount: Object.keys(attributes || {}).length,
    });
    
    // Record selector operation
    metricsService.incrementCounter('selector_operations_total', 1, {
      elementType,
      complexity: complexity || 'medium',
    });
    
    // Simulate selector generation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
    
    const duration = Date.now() - startTime;
    
    // Record generation duration
    metricsService.recordHistogram('selector_generation_duration', duration, {
      elementType,
      complexity: complexity || 'medium',
    });
    
    // Generate mock selector
    const selector = `${elementType || 'div'}${attributes?.id ? '#' + attributes.id : ''}${attributes?.className ? '.' + attributes.className.split(' ').join('.') : ''}`;
    
    const result = {
      success: true,
      selector,
      duration,
      complexity: complexity || 'medium',
      timestamp: new Date().toISOString(),
      traceId: span.spanContext().traceId,
    };
    
    span.setStatus({ code: 1 }); // OK
    res.status(200).json(result);
    
  } catch (error) {
    span.setStatus({ code: 2, message: error.message }); // Error
    metricsService.incrementCounter('selector_validation_errors', 1, {
      elementType: req.body?.elementType || 'unknown',
    });
    
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
});

// k-NN prediction endpoint
app.post('/api/ml/predict', async (req, res) => {
  const span = telemetryManager.createSpan('knn_prediction');
  
  try {
    const { features, k = 5 } = req.body;
    
    // Add span attributes
    telemetryManager.addSpanAttributes(span, {
      featuresCount: features?.length || 0,
      k,
    });
    
    if (!features || !Array.isArray(features)) {
      throw new Error('Features must be an array');
    }
    
    // Make prediction
    const prediction = metricsService.predict(features, k);
    
    if (!prediction) {
      throw new Error('k-NN model not trained yet');
    }
    
    const result = {
      success: true,
      prediction: prediction.prediction,
      confidence: prediction.confidence,
      kNearest: prediction.kNearest,
      k: prediction.k,
      timestamp: new Date().toISOString(),
      traceId: span.spanContext().traceId,
    };
    
    span.setStatus({ code: 1 }); // OK
    res.status(200).json(result);
    
  } catch (error) {
    span.setStatus({ code: 2, message: error.message }); // Error
    res.status(500).json({ error: error.message });
  } finally {
    span.end();
  }
});

// Metrics statistics endpoint
app.get('/api/metrics/stats', (req, res) => {
  try {
    const stats = metricsService.getMetricStatistics();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate artificial data endpoint
app.post('/api/metrics/generate-data', (req, res) => {
  try {
    const { count = 1000 } = req.body;
    const artificialData = metricsService.generateArtificialData(count);
    
    res.status(200).json({
      success: true,
      generated: artificialData.length,
      total: metricsService.artificialData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Train k-NN model endpoint
app.post('/api/ml/train', async (req, res) => {
  try {
    const model = await metricsService.trainKNNModel();
    
    if (model) {
      res.status(200).json({
        success: true,
        trained: true,
        samples: model.trainingData.length,
        lastTrained: model.lastTrained,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(500).json({ error: 'Failed to train model' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System metrics endpoint
app.get('/api/system/metrics', (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Update system metrics
    metricsService.setGauge('memory_usage_bytes', memoryUsage.heapUsed);
    metricsService.setGauge('cpu_usage_percent', Math.random() * 100);
    
    const systemMetrics = {
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        rss: memoryUsage.rss,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: process.uptime(),
      pid: process.pid,
      version: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    };
    
    res.status(200).json(systemMetrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Record error metric
  metricsService.incrementCounter('component_errors_total', 1, {
    component: 'server',
    operation: 'unhandled_error',
  });
  
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  
  try {
    await telemetryManager.shutdown();
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  
  try {
    await telemetryManager.shutdown();
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
async function startServer() {
  try {
    // Initialize telemetry first
    await initializeTelemetry();
    
    // Initialize metrics service
    initializeMetrics();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Wave Reader Backend Server running on port ${PORT}`);
      console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`🔍 API: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
