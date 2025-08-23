const { telemetryManager } = require('../telemetry/opentelemetry');
const cron = require('node-cron');

// Metrics Collection Service
class MetricsService {
  constructor() {
    this.metrics = new Map();
    this.histograms = new Map();
    this.counters = new Map();
    this.gauges = new Map();
    this.metricHistory = [];
    this.maxHistorySize = 10000;
    this.knnModel = null;
    this.artificialData = [];
    
    this.initializeMetrics();
    this.setupScheduledTasks();
  }

  // Initialize default metrics
  initializeMetrics() {
    try {
      // Request metrics
      this.createHistogram('http_request_duration', 'HTTP request duration in milliseconds');
      this.createCounter('http_requests_total', 'Total HTTP requests');
      this.createCounter('http_requests_by_status', 'HTTP requests by status code');
      this.createCounter('http_requests_by_method', 'HTTP requests by method');
      
      // Component metrics
      this.createCounter('component_operations_total', 'Total component operations');
      this.createCounter('component_errors_total', 'Total component errors');
      this.createHistogram('component_operation_duration', 'Component operation duration');
      
      // Wave animation metrics
      this.createCounter('wave_animations_total', 'Total wave animations');
      this.createHistogram('wave_animation_duration', 'Wave animation duration');
      this.createGauge('active_wave_animations', 'Currently active wave animations');
      
      // Selector metrics
      this.createCounter('selector_operations_total', 'Total selector operations');
      this.createHistogram('selector_generation_duration', 'Selector generation duration');
      this.createCounter('selector_validation_errors', 'Selector validation errors');
      
      // Memory and performance metrics
      this.createGauge('memory_usage_bytes', 'Memory usage in bytes');
      this.createGauge('cpu_usage_percent', 'CPU usage percentage');
      this.createGauge('active_connections', 'Active connections');
      
      console.log('✅ Metrics service initialized with default metrics');
      
    } catch (error) {
      console.error('❌ Failed to initialize metrics:', error);
    }
  }

  // Create histogram metric
  createHistogram(name, description) {
    try {
      const histogram = telemetryManager.createHistogram(name, description);
      if (histogram) {
        this.histograms.set(name, histogram);
        this.metrics.set(name, { type: 'histogram', description, metric: histogram });
      }
    } catch (error) {
      console.warn(`Failed to create histogram ${name}:`, error);
    }
  }

  // Create counter metric
  createCounter(name, description) {
    try {
      const meter = telemetryManager.getMeter('wave-reader-metrics', '1.0.0');
      const counter = meter.createCounter(name, { description });
      this.counters.set(name, counter);
      this.metrics.set(name, { type: 'counter', description, metric: counter });
    } catch (error) {
      console.warn(`Failed to create counter ${name}:`, error);
    }
  }

  // Create gauge metric
  createGauge(name, description) {
    try {
      const meter = telemetryManager.getMeter('wave-reader-metrics', '1.0.0');
      const observableGauge = meter.createObservableGauge(name, { description });
      
      // Store gauge configuration
      this.gauges.set(name, { observableGauge, description });
      this.metrics.set(name, { type: 'gauge', description, metric: observableGauge });
      
    } catch (error) {
      console.warn(`Failed to create gauge ${name}:`, error);
    }
  }

  // Record histogram value
  recordHistogram(name, value, attributes = {}) {
    try {
      const histogram = this.histograms.get(name);
      if (histogram) {
        telemetryManager.recordHistogram(histogram, value, attributes);
        this.recordMetricHistory(name, 'histogram', value, attributes);
      }
    } catch (error) {
      console.warn(`Failed to record histogram ${name}:`, error);
    }
  }

  // Increment counter
  incrementCounter(name, value = 1, attributes = {}) {
    try {
      const counter = this.counters.get(name);
      if (counter) {
        counter.add(value, attributes);
        this.recordMetricHistory(name, 'counter', value, attributes);
      }
    } catch (error) {
      console.warn(`Failed to increment counter ${name}:`, error);
    }
  }

  // Set gauge value
  setGauge(name, value, attributes = {}) {
    try {
      const gauge = this.gauges.get(name);
      if (gauge) {
        // For observable gauges, we need to update the callback
        this.updateGaugeValue(name, value, attributes);
        this.recordMetricHistory(name, 'gauge', value, attributes);
      }
    } catch (error) {
      console.warn(`Failed to set gauge ${name}:`, error);
    }
  }

  // Update gauge value (for observable gauges)
  updateGaugeValue(name, value, attributes = {}) {
    try {
      const gauge = this.gauges.get(name);
      if (gauge) {
        // Store the current value for the gauge
        gauge.currentValue = value;
        gauge.currentAttributes = attributes;
      }
    } catch (error) {
      console.warn(`Failed to update gauge ${name}:`, error);
    }
  }

  // Record metric in history
  recordMetricHistory(name, type, value, attributes = {}) {
    try {
      const metricRecord = {
        name,
        type,
        value,
        attributes,
        timestamp: new Date().toISOString(),
        traceId: this.getCurrentTraceId(),
      };

      this.metricHistory.push(metricRecord);

      // Limit history size
      if (this.metricHistory.length > this.maxHistorySize) {
        this.metricHistory = this.metricHistory.slice(-this.maxHistorySize);
      }

      // Add to artificial data for k-NN
      this.addToArtificialData(metricRecord);

    } catch (error) {
      console.warn('Failed to record metric history:', error);
    }
  }

  // Get current trace ID
  getCurrentTraceId() {
    try {
      const { trace } = require('@opentelemetry/api');
      const span = trace.getActiveSpan();
      return span ? span.spanContext().traceId : null;
    } catch (error) {
      return null;
    }
  }

  // Add metric to artificial data for k-NN
  addToArtificialData(metricRecord) {
    try {
      // Create feature vector for k-NN
      const features = this.extractFeatures(metricRecord);
      
      if (features) {
        this.artificialData.push({
          features,
          label: this.classifyMetric(metricRecord),
          timestamp: metricRecord.timestamp,
          original: metricRecord,
        });
      }

      // Limit artificial data size
      if (this.artificialData.length > 10000) {
        this.artificialData = this.artificialData.slice(-10000);
      }

    } catch (error) {
      console.warn('Failed to add to artificial data:', error);
    }
  }

  // Extract features from metric record
  extractFeatures(metricRecord) {
    try {
      const { name, type, value, attributes } = metricRecord;
      
      // Convert metric name to numeric features
      const nameHash = this.hashString(name);
      const typeHash = this.hashString(type);
      
      // Extract numeric attributes
      const numericAttributes = {};
      Object.entries(attributes).forEach(([key, val]) => {
        if (typeof val === 'number') {
          numericAttributes[key] = val;
        } else if (typeof val === 'string') {
          numericAttributes[`${key}_hash`] = this.hashString(val);
        }
      });

      // Create feature vector
      const features = [
        nameHash,
        typeHash,
        typeof value === 'number' ? value : 0,
        Object.keys(attributes).length,
        ...Object.values(numericAttributes),
      ];

      return features;

    } catch (error) {
      console.warn('Failed to extract features:', error);
      return null;
    }
  }

  // Hash string to numeric value
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Classify metric for labeling
  classifyMetric(metricRecord) {
    try {
      const { name, type, value } = metricRecord;
      
      // Simple classification based on metric name and value
      if (name.includes('error') || name.includes('failure')) {
        return 'error';
      } else if (name.includes('duration') || name.includes('latency')) {
        return value > 1000 ? 'slow' : value > 100 ? 'medium' : 'fast';
      } else if (name.includes('total') || name.includes('count')) {
        return value > 1000 ? 'high' : value > 100 ? 'medium' : 'low';
      } else {
        return 'normal';
      }

    } catch (error) {
      return 'unknown';
    }
  }

  // Generate artificial data for k-NN training
  generateArtificialData(count = 1000) {
    try {
      console.log(`🎲 Generating ${count} artificial metric records...`);
      
      const artificialRecords = [];
      const metricNames = [
        'http_request_duration',
        'component_operation_duration',
        'wave_animation_duration',
        'selector_generation_duration',
        'memory_usage_bytes',
        'cpu_usage_percent',
      ];

      const metricTypes = ['histogram', 'counter', 'gauge'];
      const labels = ['normal', 'slow', 'fast', 'high', 'low', 'error'];

      for (let i = 0; i < count; i++) {
        const name = metricNames[Math.floor(Math.random() * metricNames.length)];
        const type = metricTypes[Math.floor(Math.random() * metricTypes.length)];
        const value = Math.random() * 1000;
        const label = labels[Math.floor(Math.random() * labels.length)];

        const metricRecord = {
          name,
          type,
          value,
          attributes: {
            endpoint: `/api/${Math.floor(Math.random() * 10)}`,
            method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
            status: [200, 201, 400, 401, 404, 500][Math.floor(Math.random() * 6)],
          },
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Last 24 hours
        };

        const features = this.extractFeatures(metricRecord);
        if (features) {
          artificialRecords.push({
            features,
            label,
            timestamp: metricRecord.timestamp,
            original: metricRecord,
          });
        }
      }

      // Add to existing artificial data
      this.artificialData.push(...artificialRecords);
      
      console.log(`✅ Generated ${artificialRecords.length} artificial records`);
      console.log(`📊 Total artificial data: ${this.artificialData.length} records`);
      
      return artificialRecords;

    } catch (error) {
      console.error('❌ Failed to generate artificial data:', error);
      return [];
    }
  }

  // Train k-NN model
  async trainKNNModel() {
    try {
      console.log('🧠 Training k-NN model...');
      
      // Ensure we have enough data
      if (this.artificialData.length < 100) {
        console.log('📊 Insufficient data, generating more artificial records...');
        this.generateArtificialData(1000);
      }

      // Prepare training data
      const trainingData = this.artificialData.map(item => item.features);
      const trainingLabels = this.artificialData.map(item => item.label);

      // Train k-NN model (simplified for now)
      this.knnModel = {
        trainingData,
        trainingLabels,
        k: 5,
        trained: true,
        lastTrained: new Date().toISOString(),
      };

      console.log(`✅ k-NN model trained with ${trainingData.length} samples`);
      return this.knnModel;

    } catch (error) {
      console.error('❌ Failed to train k-NN model:', error);
      return null;
    }
  }

  // Predict using k-NN
  predict(features, k = 5) {
    try {
      if (!this.knnModel || !this.knnModel.trained) {
        console.warn('k-NN model not trained yet');
        return null;
      }

      // Simple k-NN implementation
      const distances = this.knnModel.trainingData.map((trainingFeatures, index) => ({
        distance: this.calculateDistance(features, trainingFeatures),
        label: this.knnModel.trainingLabels[index],
      }));

      // Sort by distance and get k nearest neighbors
      distances.sort((a, b) => a.distance - b.distance);
      const kNearest = distances.slice(0, k);

      // Count labels
      const labelCounts = {};
      kNearest.forEach(item => {
        labelCounts[item.label] = (labelCounts[item.label] || 0) + 1;
      });

      // Return most common label
      const prediction = Object.entries(labelCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      return {
        prediction,
        confidence: labelCounts[prediction] / k,
        kNearest: kNearest.map(item => ({
          label: item.label,
          distance: item.distance,
        })),
        k,
      };

    } catch (error) {
      console.error('❌ Failed to predict with k-NN:', error);
      return null;
    }
  }

  // Calculate Euclidean distance between feature vectors
  calculateDistance(features1, features2) {
    try {
      if (features1.length !== features2.length) {
        return Infinity;
      }

      let sum = 0;
      for (let i = 0; i < features1.length; i++) {
        sum += Math.pow(features1[i] - features2[i], 2);
      }

      return Math.sqrt(sum);

    } catch (error) {
      return Infinity;
    }
  }

  // Get metric statistics
  getMetricStatistics() {
    try {
      const stats = {
        totalMetrics: this.metrics.size,
        totalHistory: this.metricHistory.length,
        totalArtificialData: this.artificialData.length,
        knnModelStatus: this.knnModel ? 'trained' : 'not_trained',
        lastTrained: this.knnModel?.lastTrained || null,
        metricsByType: {},
        recentMetrics: this.metricHistory.slice(-100),
      };

      // Count metrics by type
      this.metrics.forEach((metric, name) => {
        const type = metric.type;
        stats.metricsByType[type] = (stats.metricsByType[type] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('❌ Failed to get metric statistics:', error);
      return null;
    }
  }

  // Setup scheduled tasks
  setupScheduledTasks() {
    try {
      // Generate artificial data every hour
      cron.schedule('0 * * * *', () => {
        console.log('🕐 Scheduled task: Generating artificial data...');
        this.generateArtificialData(100);
      });

      // Train k-NN model every 6 hours
      cron.schedule('0 */6 * * *', async () => {
        console.log('🕐 Scheduled task: Training k-NN model...');
        await this.trainKNNModel();
      });

      // Clean up old metrics every day
      cron.schedule('0 0 * * *', () => {
        console.log('🕐 Scheduled task: Cleaning up old metrics...');
        this.cleanupOldMetrics();
      });

      console.log('✅ Scheduled tasks configured');

    } catch (error) {
      console.error('❌ Failed to setup scheduled tasks:', error);
    }
  }

  // Clean up old metrics
  cleanupOldMetrics() {
    try {
      const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
      
      const beforeCleanup = this.metricHistory.length;
      
      this.metricHistory = this.metricHistory.filter(record => 
        new Date(record.timestamp) > cutoffDate
      );
      
      const afterCleanup = this.metricHistory.length;
      const cleaned = beforeCleanup - afterCleanup;
      
      console.log(`🧹 Cleaned up ${cleaned} old metric records`);
      
    } catch (error) {
      console.error('❌ Failed to cleanup old metrics:', error);
    }
  }

  // Get health status
  getHealthStatus() {
    return {
      status: 'healthy',
      service: 'metrics-service',
      metrics: this.metrics.size,
      history: this.metricHistory.length,
      artificialData: this.artificialData.length,
      knnModel: this.knnModel ? 'trained' : 'not_trained',
      timestamp: new Date().toISOString(),
    };
  }
}

// Create singleton instance
const metricsService = new MetricsService();

// Export singleton and class
module.exports = {
  MetricsService,
  metricsService,
};
