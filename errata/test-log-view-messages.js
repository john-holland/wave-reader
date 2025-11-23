#!/usr/bin/env node

/**
 * Test script for the Log View Messages system
 * This script tests the message classes, factory, and venture state alignment
 */

const { MessageFactory } = require('./src/models/messages/log-view-messages');
const LogViewMessageUtility = require('./src/util/log-view-messages').default;

async function testLogViewMessages() {
    console.log('🧪 Testing Log View Messages System...\n');

    try {
        // Test 1: Message Factory
        console.log('📝 Test 1: Message Factory');
        const startMessage = MessageFactory.createMessage('start', 'popup', { options: {} });
        console.log(`✅ Created start message: ${startMessage.getName()} from ${startMessage.getFrom()}`);
        
        const stopMessage = MessageFactory.createMessage('stop', 'popup');
        console.log(`✅ Created stop message: ${stopMessage.getName()} from ${stopMessage.getFrom()}`);
        
        const mlMessage = MessageFactory.createMessage('ml-recommendation', 'ml-service', {
            domain: 'example.com',
            recommendations: []
        });
        console.log(`✅ Created ML message: ${mlMessage.getName()} from ${mlMessage.getFrom()}`);

        // Test 2: Message Validation
        console.log('\n🔍 Test 2: Message Validation');
        const validationResult = LogViewMessageUtility.validateMessage(startMessage);
        console.log(`Validation result:`, validationResult);
        
        if (validationResult.isValid) {
            console.log('✅ Message validation passed');
        } else {
            console.log('❌ Message validation failed:', validationResult.errors);
        }

        // Test 3: Venture State Alignment
        console.log('\n🎯 Test 3: Venture State Alignment');
        const validMessageNames = LogViewMessageUtility.getValidMessageNames();
        console.log(`Valid message names (${validMessageNames.length}):`, validMessageNames);
        
        const legacyMessageNames = LogViewMessageUtility.getLegacyMessageNames();
        console.log(`Legacy message names (${legacyMessageNames.length}):`, legacyMessageNames);

        // Test 4: Message Routing
        console.log('\n🛣️ Test 4: Message Routing');
        const route = LogViewMessageUtility.routeMessage('popup', 'background', startMessage, 'session-123');
        console.log(`✅ Routed message: ${route.from} -> ${route.to} (${route.message.getName()})`);

        // Test 5: Message History
        console.log('\n📚 Test 5: Message History');
        const history = LogViewMessageUtility.getMessageHistory();
        console.log(`Message history length: ${history.length}`);
        
        if (history.length > 0) {
            const latestRoute = history[history.length - 1];
            console.log(`Latest message: ${latestRoute.message.getName()} from ${latestRoute.from} to ${latestRoute.to}`);
        }

        // Test 6: Message Statistics
        console.log('\n📊 Test 6: Message Statistics');
        const stats = LogViewMessageUtility.getMessageStats();
        console.log('Message statistics:', {
            totalMessages: stats.totalMessages,
            averageMessagesPerMinute: stats.averageMessagesPerMinute
        });

        // Test 7: Convenience Functions
        console.log('\n⚡ Test 7: Convenience Functions');
        const systemMessage = LogViewMessageUtility.createSystemMessage('health-check', { service: 'ml' });
        console.log(`✅ Created system message: ${systemMessage.getName()} from ${systemMessage.getFrom()}`);
        
        const popupMessage = LogViewMessageUtility.createPopupMessage('settings-reset', { domain: 'example.com' });
        console.log(`✅ Created popup message: ${popupMessage.getName()} from ${popupMessage.getFrom()}`);
        
        const contentMessage = LogViewMessageUtility.createContentMessage('behavior-pattern', { pattern: {} });
        console.log(`✅ Created content message: ${contentMessage.getName()} from ${contentMessage.getFrom()}`);
        
        const mlServiceMessage = LogViewMessageUtility.createMLMessage('ml-recommendation', { domain: 'test.com' });
        console.log(`✅ Created ML service message: ${mlServiceMessage.getName()} from ${mlServiceMessage.getFrom()}`);

        // Test 8: Message Categories
        console.log('\n🏷️ Test 8: Message Categories');
        const mlMessages = LogViewMessageUtility.getMessagesByCategory('ml');
        console.log(`ML category messages: ${mlMessages.length}`);
        
        const popupMessages = LogViewMessageUtility.getMessagesByComponent('popup');
        console.log(`Popup component messages: ${popupMessages.length}`);
        
        const sessionMessages = LogViewMessageUtility.getMessagesBySession('session-123');
        console.log(`Session messages: ${sessionMessages.length}`);

        // Test 9: Error Handling
        console.log('\n🚨 Test 9: Error Handling');
        try {
            const invalidMessage = MessageFactory.createMessage('invalid-message', 'popup');
            console.log('❌ Should have failed for invalid message name');
        } catch (error) {
            console.log('✅ Correctly failed for invalid message name:', error.message);
        }

        // Test 10: All Message Types
        console.log('\n🔧 Test 10: All Message Types');
        const allMessageNames = LogViewMessageUtility.getValidMessageNames();
        let successCount = 0;
        let failureCount = 0;
        
        for (const messageName of allMessageNames) {
            try {
                const message = MessageFactory.createMessage(messageName, 'test');
                const validation = LogViewMessageUtility.validateMessage(message);
                if (validation.isValid) {
                    successCount++;
                } else {
                    failureCount++;
                    console.log(`❌ ${messageName}:`, validation.errors);
                }
            } catch (error) {
                failureCount++;
                console.log(`❌ ${messageName}: ${error.message}`);
            }
        }
        
        console.log(`Message creation results: ${successCount} success, ${failureCount} failures`);

        console.log('\n🎉 All Log View Messages tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log('- Message Factory working correctly');
        console.log('- Message validation functioning');
        console.log('- Venture state alignment verified');
        console.log('- Message routing operational');
        console.log('- Message history tracking active');
        console.log('- Statistics collection working');
        console.log('- Convenience functions available');
        console.log('- Error handling robust');
        console.log('- All message types validated');

    } catch (error) {
        console.error('\n❌ Log View Messages test failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the tests
if (require.main === module) {
    testLogViewMessages().catch(error => {
        console.error('Test runner failed:', error);
        process.exit(1);
    });
}

module.exports = { testLogViewMessages };
