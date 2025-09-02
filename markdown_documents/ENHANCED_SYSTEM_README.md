# 🌊 Wave Reader Enhanced System

## Overview

Wave Reader Enhanced is a sophisticated browser extension that combines traditional wave reading functionality with **Machine Learning-driven intelligent defaults** and **k-nearest neighbors approximation** for optimal user experience across different websites and content types.

## 🚀 Key Features

### ✨ ML-Powered Settings Recommendations
- **Intelligent Defaults**: Automatically suggests optimal settings based on website type and content
- **K-Nearest Neighbors**: Uses ML algorithms to find similar successful patterns
- **Heavily Weighted Artificial Defaults**: Strong baseline recommendations for common website types
- **Continuous Learning**: Improves recommendations based on user behavior and feedback

### 🛡️ Enhanced Error Handling
- **Error Boundaries**: Comprehensive error catching and recovery throughout the app
- **Graceful Degradation**: Continues functioning even when components fail
- **User-Friendly Error Messages**: Clear communication about issues and solutions

### 🔧 Advanced Backend Services
- **ML Settings Service**: Intelligent pattern recognition and recommendation engine
- **Enhanced API**: RESTful endpoints for all major functionality
- **Analytics Engine**: Comprehensive usage tracking and insights
- **Extension Management**: Installation, updates, and health monitoring

## 🏗️ Architecture

### Frontend Components
```
src/
├── components/
│   ├── error-boundary.tsx          # Error boundary wrapper
│   ├── app.tsx                     # Main app with error boundaries
│   ├── app-tomes.tsx              # Enhanced Tomes-based app
│   └── ...                        # Other components
├── services/
│   ├── ml-settings-service.ts     # ML-driven settings service
│   └── ...                        # Other services
└── ...
```

### Backend Services
```
src/backend/
├── enhanced-server.js              # Main enhanced server
├── package.json                    # Backend dependencies
└── ...
```

## 🧠 ML System Details

### K-Nearest Neighbors Algorithm
The ML system uses k-nearest neighbors (k=5) to find similar user behavior patterns:

1. **Pattern Collection**: Records user interactions, settings, and outcomes
2. **Similarity Calculation**: 
   - Domain similarity (50% weight)
   - Path similarity (30% weight) 
   - Selector similarity (20% weight)
3. **Confidence Scoring**: Based on user ratings, recency, and duration
4. **Recommendation Generation**: Averages similar patterns for optimal settings

### Artificial Default Patterns
Heavily weighted artificial patterns provide strong baseline recommendations:

- **News/Content Sites**: `p, h1, h2, h3, .content, .article-body`
- **Documentation**: `.doc-content, .markdown-body, pre, code`
- **Social Media**: `.post-content, .tweet-text, .status-content`
- **E-commerce**: `.product-description, .product-title, .price, .reviews`
- **Blogs**: `.blog-post, .entry-content, .post-body`

### Pattern Weighting
- **Artificial Patterns**: 3x multiplier for strong baseline influence
- **User Patterns**: 1x multiplier, learned from actual usage
- **Recency Decay**: Patterns older than 30 days lose weight
- **Success Duration**: Longer successful sessions get higher weight

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Chrome/Firefox browser

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/wave-reader/wave-reader.git
   cd wave-reader
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd src/backend
   npm install
   cd ../..
   ```

4. **Start the enhanced backend**:
   ```bash
   ./start-enhanced-backend.sh
   ```

5. **Build the extension**:
   ```bash
   npm run build
   ```

### Development Mode

1. **Start backend in development**:
   ```bash
   cd src/backend
   npm run dev
   ```

2. **Start frontend in development**:
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### ML Service
- `POST /api/ml/recommendations` - Get ML-driven settings recommendations
- `POST /api/ml/record-pattern` - Record user behavior pattern
- `GET /api/ml/stats` - Get ML system statistics
- `POST /api/ml/train` - Train ML model with new data

### Wave Reader
- `POST /api/wave-reader/start` - Start wave reader session
- `POST /api/wave-reader/stop` - Stop wave reader session
- `PUT /api/wave-reader/settings` - Update wave reader settings
- `GET /api/wave-reader/status/:sessionId` - Get session status

### Analytics
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics/interaction` - Record user interaction

### Extension Management
- `POST /api/extension/install` - Process extension installation
- `PUT /api/extension/update` - Process extension update
- `GET /api/extension/health/:extensionId` - Extension health check

## 📊 ML System Usage

### Getting Recommendations
```typescript
import MLSettingsService from './services/ml-settings-service';

const mlService = new MLSettingsService();

// Get recommendations for a specific domain
const recommendations = await mlService.getSettingsRecommendations(
    'news.example.com',
    '/article',
    'p, h1, h2, h3'
);

console.log('Top recommendation:', recommendations[0]);
```

### Recording Behavior Patterns
```typescript
// Record a successful user interaction
await mlService.recordBehaviorPattern({
    domain: 'news.example.com',
    path: '/article',
    selector: 'p, h1, h2, h3',
    settings: { /* user settings */ },
    success: true,
    duration: 5000,
    userRating: 5
});
```

### Getting ML Statistics
```typescript
const stats = mlService.getMLStats();
console.log('Total patterns:', stats.totalPatterns);
console.log('Average confidence:', stats.averageConfidence);
console.log('Domain coverage:', stats.domainCoverage);
```

## 🧪 Testing

### Run Tests
```bash
# Frontend tests
npm test

# Backend tests
cd src/backend
npm test
```

### Test ML Service
```bash
# Test ML recommendations
curl -X POST http://localhost:3001/api/ml/recommendations \
  -H "Content-Type: application/json" \
  -d '{"domain": "news.example.com", "path": "/article"}'
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend configuration
NODE_ENV=development
PORT=3001

# ML system configuration
ML_K_NEIGHBORS=5
ML_MIN_CONFIDENCE=0.7
ML_ARTIFICIAL_WEIGHT=3.0
```

### ML System Tuning
```typescript
// Adjust ML parameters
const mlService = new MLSettingsService();

// Customize k-nearest neighbors
mlService.kNeighbors = 7;

// Adjust confidence threshold
mlService.minConfidence = 0.8;

// Modify artificial pattern weighting
mlService.artificialWeightMultiplier = 4.0;
```

## 📈 Performance & Monitoring

### Health Checks
- **Backend Health**: `GET /health`
- **ML Service**: `GET /api/ml/stats`
- **Extension Health**: `GET /api/extension/health/:id`

### Metrics
- **Pattern Recognition Accuracy**: Tracks ML recommendation success
- **User Satisfaction**: Monitors user ratings and feedback
- **System Performance**: Response times and error rates
- **Domain Coverage**: Tracks website types and success rates

## 🚨 Error Handling

### Error Boundary Implementation
```typescript
import { ErrorBoundary } from './components/error-boundary';

// Wrap components with error boundaries
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Error Recovery
- **Automatic Fallbacks**: Uses intelligent defaults when ML fails
- **Graceful Degradation**: Continues core functionality
- **User Feedback**: Clear error messages and recovery options

## 🔮 Future Enhancements

### Planned ML Improvements
- **Deep Learning Models**: Neural networks for better pattern recognition
- **Real-time Learning**: Continuous model updates during usage
- **Multi-modal Patterns**: Audio, visual, and interaction pattern recognition
- **Personalization**: User-specific ML models and preferences

### System Enhancements
- **Microservices Architecture**: Scalable backend services
- **Real-time Analytics**: Live usage monitoring and insights
- **Advanced Caching**: Redis-based pattern and recommendation caching
- **A/B Testing**: ML model comparison and optimization

## 🤝 Contributing

### Development Guidelines
1. **Error Handling**: Always wrap components with error boundaries
2. **ML Integration**: Use the ML service for intelligent defaults
3. **Testing**: Comprehensive test coverage for all ML functionality
4. **Documentation**: Clear documentation for ML algorithms and APIs

### Code Style
- **TypeScript**: Strict typing for ML service interfaces
- **Error Boundaries**: Consistent error handling patterns
- **ML Patterns**: Follow established ML service patterns
- **API Design**: RESTful endpoints with clear error codes

## 📚 Additional Resources

### Documentation
- [ML Service API Reference](./src/services/ml-settings-service.ts)
- [Error Boundary Usage](./src/components/error-boundary.tsx)
- [Backend API Documentation](./src/backend/enhanced-server.js)

### Examples
- [ML Integration Examples](./examples/ml-integration.md)
- [Error Handling Patterns](./examples/error-handling.md)
- [Backend Setup Guide](./examples/backend-setup.md)

## 🆘 Support

### Common Issues
1. **ML Service Not Responding**: Check backend health endpoint
2. **Recommendations Not Working**: Verify pattern data and ML stats
3. **Error Boundaries Triggering**: Check component error logs
4. **Backend Connection Issues**: Verify CORS and network configuration

### Getting Help
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive guides and examples
- **Community**: Join our developer community
- **Support**: Direct support for enterprise users

---

**Wave Reader Enhanced** - Where AI meets accessibility, creating the future of intelligent reading assistance. 🌊✨
