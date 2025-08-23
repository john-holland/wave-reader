const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');

// OpenTelemetry Configuration
class OpenTelemetryManager {
  constructor(config = {}) {
    this.config = {
      serviceName: 'wave-reader-backend',
      serviceVersion: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
      prometheusPort: process.env.PROMETHEUS_PORT || 9464,
      ...config
    };
    
    this.sdk = null;
    this.meterProvider = null;
    this.prometheusExporter = null;
    this.jaegerExporter = null;
  }

  // Initialize OpenTelemetry
  async initialize() {
    try {
      console.log('🔧 Initializing OpenTelemetry...');
      
      // Create resource
      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: this.config.serviceName,
        [SemanticResourceAttributes.SERVICE_VERSION]: this.config.serviceVersion,
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: this.config.environment,
      });

      // Create Jaeger exporter for traces
      this.jaegerExporter = new JaegerExporter({
        endpoint: this.config.jaegerEndpoint,
        serviceName: this.config.serviceName,
      });

      // Create Prometheus exporter for metrics
      this.prometheusExporter = new PrometheusExporter({
        port: this.config.prometheusPort,
        endpoint: '/metrics',
        appendTimestamp: true,
      });

      // Create meter provider
      this.meterProvider = new MeterProvider({
        resource: resource,
      });

      // Register meter provider
      this.meterProvider.addMetricReader(this.prometheusExporter);

      // Create SDK
      this.sdk = new NodeSDK({
        resource: resource,
        spanProcessor: new BatchSpanProcessor(this.jaegerExporter),
        metricReader: this.prometheusExporter,
        instrumentations: [
          getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-http': {
              ignoreIncomingPaths: ['/health', '/metrics'],
            },
            '@opentelemetry/instrumentation-express': {
              enabled: true,
            },
          }),
        ],
      });

      // Initialize SDK
      await this.sdk.start();
      
      // Register instrumentations
      registerInstrumentations({
        instrumentations: [
          getNodeAutoInstrumentations(),
        ],
        meterProvider: this.meterProvider,
      });

      console.log('✅ OpenTelemetry initialized successfully');
      console.log(`📊 Metrics available at http://localhost:${this.config.prometheusPort}/metrics`);
      console.log(`🔍 Traces sent to ${this.config.jaegerEndpoint}`);
      
      return this;
      
    } catch (error) {
      console.error('❌ Failed to initialize OpenTelemetry:', error);
      throw error;
    }
  }

  // Graceful shutdown
  async shutdown() {
    try {
      console.log('🔄 Shutting down OpenTelemetry...');
      
      if (this.sdk) {
        await this.sdk.shutdown();
      }
      
      console.log('✅ OpenTelemetry shutdown complete');
      
    } catch (error) {
      console.error('❌ Error during OpenTelemetry shutdown:', error);
    }
  }

  // Get meter for custom metrics
  getMeter(name, version) {
    return this.meterProvider.getMeter(name, version);
  }

  // Get tracer for custom tracing
  getTracer(name, version) {
    const { trace } = require('@opentelemetry/api');
    return trace.getTracer(name, version);
  }

  // Create custom span
  createSpan(name, options = {}) {
    const { trace } = require('@opentelemetry/api');
    const tracer = trace.getTracer(this.config.serviceName, this.config.serviceVersion);
    return tracer.startSpan(name, options);
  }

  // Add custom attributes to span
  addSpanAttributes(span, attributes) {
    if (span && attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        span.setAttribute(key, value);
      });
    }
  }

  // Record custom metric
  recordMetric(name, value, attributes = {}) {
    try {
      const meter = this.getMeter(this.config.serviceName, this.config.serviceVersion);
      const counter = meter.createCounter(name, {
        description: `Custom metric: ${name}`,
      });
      
      counter.add(value, attributes);
      
    } catch (error) {
      console.warn('Failed to record metric:', error);
    }
  }

  // Create histogram metric
  createHistogram(name, description = '') {
    try {
      const meter = this.getMeter(this.config.serviceName, this.config.serviceVersion);
      return meter.createHistogram(name, {
        description: description || `Histogram metric: ${name}`,
        unit: 'ms',
        boundaries: [0.1, 0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500, 1000],
      });
    } catch (error) {
      console.warn('Failed to create histogram:', error);
      return null;
    }
  }

  // Record histogram value
  recordHistogram(histogram, value, attributes = {}) {
    try {
      if (histogram) {
        histogram.record(value, attributes);
      }
    } catch (error) {
      console.warn('Failed to record histogram:', error);
    }
  }

  // Get metrics endpoint
  getMetricsEndpoint() {
    return this.prometheusExporter;
  }

  // Get health status
  getHealthStatus() {
    return {
      status: 'healthy',
      service: this.config.serviceName,
      version: this.config.serviceVersion,
      environment: this.config.environment,
      telemetry: {
        traces: !!this.jaegerExporter,
        metrics: !!this.prometheusExporter,
        sdk: !!this.sdk,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// Create singleton instance
const telemetryManager = new OpenTelemetryManager();

// Export singleton and class
module.exports = {
  OpenTelemetryManager,
  telemetryManager,
};
