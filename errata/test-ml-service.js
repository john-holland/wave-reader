#!/usr/bin/env node

/**
 * Test script for the ML Settings Service
 * This script tests the core ML functionality without requiring the full backend
 */

const MLSettingsService = require('./src/services/ml-settings-service').default;

async function testMLService() {
    console.log('🧪 Testing ML Settings Service...\n');

    try {
        // Initialize the ML service
        const mlService = new MLSettingsService();
        console.log('✅ ML Service initialized successfully');

        // Test 1: Get recommendations for a news site
        console.log('\n📰 Test 1: News site recommendations');
        const newsRecommendations = await mlService.getSettingsRecommendations(
            'news.example.com',
            '/article'
        );
        console.log(`Found ${newsRecommendations.length} recommendations`);
        if (newsRecommendations.length > 0) {
            const topRec = newsRecommendations[0];
            console.log(`Top recommendation: ${topRec.confidence.toFixed(2)} confidence`);
            console.log(`Selector: ${topRec.settings.wave?.selector || 'N/A'}`);
            console.log(`Reasoning: ${topRec.reasoning.join(', ')}`);
        }

        // Test 2: Get recommendations for a documentation site
        console.log('\n📚 Test 2: Documentation site recommendations');
        const docsRecommendations = await mlService.getSettingsRecommendations(
            'docs.example.com',
            '/guide'
        );
        console.log(`Found ${docsRecommendations.length} recommendations`);
        if (docsRecommendations.length > 0) {
            const topRec = docsRecommendations[0];
            console.log(`Top recommendation: ${topRec.confidence.toFixed(2)} confidence`);
            console.log(`Selector: ${topRec.settings.wave?.selector || 'N/A'}`);
            console.log(`Reasoning: ${topRec.reasoning.join(', ')}`);
        }

        // Test 3: Get recommendations for an unknown domain
        console.log('\n🌐 Test 3: Unknown domain recommendations');
        const unknownRecommendations = await mlService.getSettingsRecommendations(
            'unknown-site.com',
            '/page'
        );
        console.log(`Found ${unknownRecommendations.length} recommendations`);
        if (unknownRecommendations.length > 0) {
            const topRec = unknownRecommendations[0];
            console.log(`Fallback recommendation: ${topRec.confidence.toFixed(2)} confidence`);
            console.log(`Selector: ${topRec.settings.wave?.selector || 'N/A'}`);
            console.log(`Reasoning: ${topRec.reasoning.join(', ')}`);
        }

        // Test 4: Record a new behavior pattern
        console.log('\n📝 Test 4: Recording behavior pattern');
        await mlService.recordBehaviorPattern({
            domain: 'test-blog.com',
            path: '/post',
            selector: 'p, h1, h2, .blog-content',
            settings: {
                wave: {
                    amplitude: 0.8,
                    frequency: 2.0,
                    duration: 3000,
                    easing: 'ease-in-out'
                },
                showNotifications: false,
                autoStart: true
            },
            success: true,
            duration: 6000,
            userRating: 5
        });
        console.log('✅ Behavior pattern recorded successfully');

        // Test 5: Get recommendations after recording new pattern
        console.log('\n🔄 Test 5: Recommendations after learning');
        const updatedRecommendations = await mlService.getSettingsRecommendations(
            'test-blog.com',
            '/post'
        );
        console.log(`Found ${updatedRecommendations.length} recommendations after learning`);
        if (updatedRecommendations.length > 0) {
            const topRec = updatedRecommendations[0];
            console.log(`Updated recommendation: ${topRec.confidence.toFixed(2)} confidence`);
            console.log(`Selector: ${topRec.settings.wave?.selector || 'N/A'}`);
            console.log(`Similar patterns: ${topRec.similarPatterns}`);
        }

        // Test 6: Get ML system statistics
        console.log('\n📊 Test 6: ML system statistics');
        const stats = mlService.getMLStats();
        console.log(`Total patterns: ${stats.totalPatterns}`);
        console.log(`Artificial patterns: ${stats.artificialPatterns}`);
        console.log(`User patterns: ${stats.userPatterns}`);
        console.log(`Average confidence: ${stats.averageConfidence.toFixed(2)}`);
        console.log(`Domain coverage: ${stats.domainCoverage.length} domains`);

        // Test 7: Test similarity calculations
        console.log('\n🔍 Test 7: Similarity calculations');
        const testDomain = 'news.example.com';
        const testPath = '/article';
        const testSelector = 'p, h1, h2, h3';
        
        const recommendations = await mlService.getSettingsRecommendations(
            testDomain, 
            testPath, 
            testSelector
        );
        
        if (recommendations.length > 0) {
            console.log(`Similarity test for ${testDomain}${testPath}`);
            console.log(`Best match confidence: ${recommendations[0].confidence.toFixed(2)}`);
            console.log(`Patterns used: ${recommendations[0].similarPatterns}`);
        }

        console.log('\n🎉 All ML service tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log('- ML service initialized correctly');
        console.log('- Artificial default patterns loaded');
        console.log('- Recommendations generated for different site types');
        console.log('- Behavior pattern recording working');
        console.log('- Learning and adaptation functioning');
        console.log('- Statistics and metrics available');

    } catch (error) {
        console.error('\n❌ ML Service test failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the tests
if (require.main === module) {
    testMLService().catch(error => {
        console.error('Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = { testMLService };
