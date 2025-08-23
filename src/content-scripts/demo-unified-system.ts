import LogViewUnifiedSystem from './log-view-system-unified';

// 🎯 DEMONSTRATION: How to use the unified system with structural system integration
// 🎯 IMPROVEMENT: Uses official createViewStateMachine from log-view-machine

console.log("🌊 Starting Unified System Demonstration...");

// Create the unified system
const unifiedSystem = new LogViewUnifiedSystem();

// Wait for initialization
setTimeout(async () => {
  console.log("🌊 Unified System Status:", unifiedSystem.getHealthStatus());
  
  // Demonstrate message processing
  console.log("\n🌊 Demonstrating message processing...");
  
  // Test content system messages
  const contentResult = await unifiedSystem.processMessage({
    name: 'START_READING',
    payload: { text: 'Hello World' }
  }, 'demo');
  console.log("🌊 Content System Result:", contentResult);
  
  // Test shadow system messages
  const shadowResult = await unifiedSystem.processMessage({
    name: 'START_TRACKING',
    payload: { enable: true }
  }, 'demo');
  console.log("🌊 Shadow System Result:", shadowResult);
  
  // Test coordination messages
  const coordinationResult = await unifiedSystem.processMessage({
    name: 'START_COORDINATION',
    payload: { systems: ['content', 'shadow'] }
  }, 'demo');
  console.log("🌊 Coordination Result:", coordinationResult);
  
  // Test wave reading
  const waveResult = await unifiedSystem.processMessage({
    name: 'WAVE_ANIMATION_START',
    payload: { duration: 5000 }
  }, 'demo');
  console.log("🌊 Wave Animation Result:", waveResult);
  
  // Test mouse tracking
  const mouseResult = await unifiedSystem.processMessage({
    name: 'MOUSE_MOVE',
    payload: { x: 100, y: 200 }
  }, 'demo');
  console.log("🌊 Mouse Move Result:", mouseResult);
  
  // Show final status
  console.log("\n🌊 Final System Status:", unifiedSystem.getHealthStatus());
  
  // Clean up
  console.log("\n🌊 Cleaning up...");
  unifiedSystem.destroy();
  
}, 2000);

// Export for use in other modules
export { unifiedSystem };
export default unifiedSystem;
