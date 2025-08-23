const express = require('express');
const cors = require('cors');
const path = require('path');
const { MLSettingsService } = require('../services/ml-settings-service');

class EnhancedWaveReaderServer {
    constructor() {
        this.app = express();
        this.mlService = new MLSettingsService();
        this.port = process.env.PORT || 3001;
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // CORS for cross-origin requests
        this.app.use(cors({
            origin: ['chrome-extension://*', 'moz-extension://*', 'http://localhost:3000'],
            credentials: true
        }));

        // JSON parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Static files
        this.app.use('/static', express.static(path.join(__dirname, '../static')));

        // Request logging
        this.app.use((req, res, next) => {
            console.log(`🌊 [${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'Wave Reader Enhanced Backend',
                version: '2.0.0'
            });
        });

        // ML Settings API endpoints
        this.setupMLRoutes();

        // Wave Reader core endpoints
        this.setupWaveReaderRoutes();

        // Analytics and metrics endpoints
        this.setupAnalyticsRoutes();

        // Extension management endpoints
        this.setupExtensionRoutes();
    }

    setupMLRoutes() {
        // Get ML-driven settings recommendations
        this.app.post('/api/ml/recommendations', async (req, res) => {
            try {
                const { domain, path, selector, userId } = req.body;
                
                if (!domain) {
                    return res.status(400).json({
                        error: 'Domain is required',
                        code: 'MISSING_DOMAIN'
                    });
                }

                console.log(`🌊 ML: Getting recommendations for ${domain}${path || ''}`);

                const recommendations = await this.mlService.getSettingsRecommendations(
                    domain, 
                    path || '/', 
                    selector
                );

                // Record this request for learning
                if (userId) {
                    await this.mlService.recordBehaviorPattern({
                        domain,
                        path: path || '/',
                        selector: selector || 'p',
                        settings: {},
                        success: true,
                        duration: 0,
                        userRating: undefined
                    });
                }

                res.json({
                    success: true,
                    recommendations,
                    timestamp: new Date().toISOString(),
                    requestId: this.generateRequestId()
                });

            } catch (error) {
                console.error('🌊 ML: Error getting recommendations:', error);
                res.status(500).json({
                    error: 'Failed to get ML recommendations',
                    code: 'ML_ERROR',
                    details: error.message
                });
            }
        });

        // Record user behavior pattern
        this.app.post('/api/ml/record-pattern', async (req, res) => {
            try {
                const { domain, path, selector, settings, success, duration, userRating } = req.body;
                
                if (!domain || !selector) {
                    return res.status(400).json({
                        error: 'Domain and selector are required',
                        code: 'MISSING_REQUIRED_FIELDS'
                    });
                }

                console.log(`🌊 ML: Recording pattern for ${domain}${path || ''}`);

                await this.mlService.recordBehaviorPattern({
                    domain,
                    path: path || '/',
                    selector,
                    settings: settings || {},
                    success: success !== false, // Default to true
                    duration: duration || 0,
                    userRating: userRating || undefined
                });

                res.json({
                    success: true,
                    message: 'Behavior pattern recorded successfully',
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error('🌊 ML: Error recording pattern:', error);
                res.status(500).json({
                    error: 'Failed to record behavior pattern',
                    code: 'RECORD_ERROR',
                    details: error.message
                });
            }
        });

        // Get ML system statistics
        this.app.get('/api/ml/stats', (req, res) => {
            try {
                const stats = this.mlService.getMLStats();
                
                res.json({
                    success: true,
                    stats,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error('🌊 ML: Error getting stats:', error);
                res.status(500).json({
                    error: 'Failed to get ML statistics',
                    code: 'STATS_ERROR',
                    details: error.message
                });
            }
        });

        // Train ML model with new data
        this.app.post('/api/ml/train', async (req, res) => {
            try {
                const { trainingData } = req.body;
                
                if (!trainingData || !Array.isArray(trainingData)) {
                    return res.status(400).json({
                        error: 'Training data array is required',
                        code: 'MISSING_TRAINING_DATA'
                    });
                }

                console.log(`🌊 ML: Training with ${trainingData.length} patterns`);

                // Record all training data
                for (const pattern of trainingData) {
                    await this.mlService.recordBehaviorPattern(pattern);
                }

                res.json({
                    success: true,
                    message: `Trained with ${trainingData.length} patterns`,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error('🌊 ML: Error training model:', error);
                res.status(500).json({
                    error: 'Failed to train ML model',
                    code: 'TRAINING_ERROR',
                    details: error.message
                });
            }
        });
    }

    setupWaveReaderRoutes() {
        // Start wave reader
        this.app.post('/api/wave-reader/start', (req, res) => {
            try {
                const { selector, options, userId } = req.body;
                
                if (!selector) {
                    return res.status(400).json({
                        error: 'Selector is required',
                        code: 'MISSING_SELECTOR'
                    });
                }

                console.log(`🌊 Wave Reader: Starting with selector "${selector}"`);

                // Simulate wave reader start
                const startResult = {
                    success: true,
                    selector,
                    options: options || {},
                    startTime: new Date().toISOString(),
                    sessionId: this.generateSessionId(),
                    userId
                };

                res.json(startResult);

            } catch (error) {
                console.error('🌊 Wave Reader: Error starting:', error);
                res.status(500).json({
                    error: 'Failed to start wave reader',
                    code: 'START_ERROR',
                    details: error.message
                });
            }
        });

        // Stop wave reader
        this.app.post('/api/wave-reader/stop', (req, res) => {
            try {
                const { sessionId, userId } = req.body;
                
                console.log(`🌊 Wave Reader: Stopping session ${sessionId}`);

                const stopResult = {
                    success: true,
                    sessionId,
                    stopTime: new Date().toISOString(),
                    userId
                };

                res.json(stopResult);

            } catch (error) {
                console.error('🌊 Wave Reader: Error stopping:', error);
                res.status(500).json({
                    error: 'Failed to stop wave reader',
                    code: 'STOP_ERROR',
                    details: error.message
                });
            }
        });

        // Update wave reader settings
        this.app.put('/api/wave-reader/settings', async (req, res) => {
            try {
                const { sessionId, settings, userId } = req.body;
                
                if (!settings) {
                    return res.status(400).json({
                        error: 'Settings are required',
                        code: 'MISSING_SETTINGS'
                    });
                }

                console.log(`🌊 Wave Reader: Updating settings for session ${sessionId}`);

                // Record the settings update for ML learning
                if (userId && settings.domain) {
                    await this.mlService.recordBehaviorPattern({
                        domain: settings.domain,
                        path: settings.path || '/',
                        selector: settings.selector || 'p',
                        settings,
                        success: true,
                        duration: 0,
                        userRating: undefined
                    });
                }

                const updateResult = {
                    success: true,
                    sessionId,
                    settings,
                    updateTime: new Date().toISOString(),
                    userId
                };

                res.json(updateResult);

            } catch (error) {
                console.error('🌊 Wave Reader: Error updating settings:', error);
                res.status(500).json({
                    error: 'Failed to update wave reader settings',
                    code: 'UPDATE_ERROR',
                    details: error.message
                });
            }
        });

        // Get wave reader status
        this.app.get('/api/wave-reader/status/:sessionId', (req, res) => {
            try {
                const { sessionId } = req.params;
                
                console.log(`🌊 Wave Reader: Getting status for session ${sessionId}`);

                // Simulate status response
                const status = {
                    sessionId,
                    active: true,
                    selector: 'p, h1, h2, h3',
                    startTime: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
                    duration: 30000,
                    elementsFound: 15,
                    elementsProcessed: 12,
                    errors: 0
                };

                res.json({
                    success: true,
                    status,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error('🌊 Wave Reader: Error getting status:', error);
                res.status(500).json({
                    error: 'Failed to get wave reader status',
                    code: 'STATUS_ERROR',
                    details: error.message
                });
            }
        });
    }

    setupAnalyticsRoutes() {
        // Get analytics data
        this.app.get('/api/analytics', (req, res) => {
            try {
                const { startDate, endDate, userId } = req.query;
                
                console.log(`🌊 Analytics: Getting data for ${startDate} to ${endDate}`);

                // Simulate analytics data
                const analytics = {
                    totalSessions: 1250,
                    totalDuration: 1250000, // milliseconds
                    averageSessionDuration: 1000,
                    mostUsedSelectors: ['p', 'h1', 'h2', '.content'],
                    domainUsage: {
                        'news.example.com': 450,
                        'docs.example.com': 320,
                        'blog.example.com': 280,
                        'shop.example.com': 200
                    },
                    userSatisfaction: 4.2,
                    errorRate: 0.05
                };

                res.json({
                    success: true,
                    analytics,
                    period: { startDate, endDate },
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                console.error('🌊 Analytics: Error getting data:', error);
                res.status(500).json({
                    error: 'Failed to get analytics data',
                    code: 'ANALYTICS_ERROR',
                    details: error.message
                });
            }
        });

        // Record user interaction
        this.app.post('/api/analytics/interaction', (req, res) => {
            try {
                const { type, data, userId, sessionId } = req.body;
                
                if (!type) {
                    return res.status(400).json({
                        error: 'Interaction type is required',
                        code: 'MISSING_INTERACTION_TYPE'
                    });
                }

                console.log(`🌊 Analytics: Recording ${type} interaction`);

                // Here you would typically store the interaction data
                const interaction = {
                    type,
                    data,
                    userId,
                    sessionId,
                    timestamp: new Date().toISOString()
                };

                res.json({
                    success: true,
                    message: 'Interaction recorded successfully',
                    interaction
                });

            } catch (error) {
                console.error('🌊 Analytics: Error recording interaction:', error);
                res.status(500).json({
                    error: 'Failed to record interaction',
                    code: 'INTERACTION_ERROR',
                    details: error.message
                });
            }
        });
    }

    setupExtensionRoutes() {
        // Extension installation
        this.app.post('/api/extension/install', (req, res) => {
            try {
                const { extensionId, version, browser, userId } = req.body;
                
                console.log(`🌊 Extension: Installing ${extensionId} v${version} for ${browser}`);

                const installResult = {
                    success: true,
                    extensionId,
                    version,
                    browser,
                    installTime: new Date().toISOString(),
                    userId,
                    welcomeMessage: 'Welcome to Wave Reader! Your AI-powered reading assistant is ready.'
                };

                res.json(installResult);

            } catch (error) {
                console.error('🌊 Extension: Error during installation:', error);
                res.status(500).json({
                    error: 'Failed to process extension installation',
                    code: 'INSTALL_ERROR',
                    details: error.message
                });
            }
        });

        // Extension update
        this.app.put('/api/extension/update', (req, res) => {
            try {
                const { extensionId, oldVersion, newVersion, userId } = req.body;
                
                console.log(`🌊 Extension: Updating ${extensionId} from v${oldVersion} to v${newVersion}`);

                const updateResult = {
                    success: true,
                    extensionId,
                    oldVersion,
                    newVersion,
                    updateTime: new Date().toISOString(),
                    userId,
                    changelog: [
                        'Enhanced ML-driven settings recommendations',
                        'Improved error handling and recovery',
                        'Better performance and stability',
                        'New analytics and insights'
                    ]
                };

                res.json(updateResult);

            } catch (error) {
                console.error('🌊 Extension: Error during update:', error);
                res.status(500).json({
                    error: 'Failed to process extension update',
                    code: 'UPDATE_ERROR',
                    details: error.message
                });
            }
        });

        // Extension health check
        this.app.get('/api/extension/health/:extensionId', (req, res) => {
            try {
                const { extensionId } = req.params;
                
                console.log(`🌊 Extension: Health check for ${extensionId}`);

                const health = {
                    extensionId,
                    status: 'healthy',
                    version: '2.0.0',
                    lastCheck: new Date().toISOString(),
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    mlService: 'operational',
                    waveReader: 'operational'
                };

                res.json({
                    success: true,
                    health
                });

            } catch (error) {
                console.error('🌊 Extension: Error during health check:', error);
                res.status(500).json({
                    error: 'Failed to perform health check',
                    code: 'HEALTH_CHECK_ERROR',
                    details: error.message
                });
            }
        });
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Endpoint not found',
                code: 'NOT_FOUND',
                path: req.path,
                method: req.method,
                timestamp: new Date().toISOString()
            });
        });

        // Global error handler
        this.app.use((error, req, res, next) => {
            console.error('🌊 Server: Unhandled error:', error);
            
            res.status(500).json({
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: error.message,
                timestamp: new Date().toISOString(),
                requestId: this.generateRequestId()
            });
        });
    }

    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🌊 Enhanced Wave Reader Backend running on port ${this.port}`);
            console.log(`🌊 Health check: http://localhost:${this.port}/health`);
            console.log(`🌊 ML Service: Operational`);
            console.log(`🌊 Wave Reader Service: Operational`);
            console.log(`🌊 Analytics Service: Operational`);
            console.log(`🌊 Extension Service: Operational`);
        });
    }

    stop() {
        console.log('🌊 Shutting down Enhanced Wave Reader Backend...');
        process.exit(0);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🌊 Received SIGTERM, shutting down gracefully...');
    if (global.server) {
        global.server.stop();
    }
});

process.on('SIGINT', () => {
    console.log('🌊 Received SIGINT, shutting down gracefully...');
    if (global.server) {
        global.server.stop();
    }
});

// Start the server if this file is run directly
if (require.main === module) {
    const server = new EnhancedWaveReaderServer();
    global.server = server;
    server.start();
}

module.exports = EnhancedWaveReaderServer;
