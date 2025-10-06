/**
 * LoopDetector - Utility class for detecting loops, frequent events, and stuck states in state machines
 */
export class LoopDetector {
    private eventHistory: Array<{event: string, timestamp: number, state: string}> = [];
    private stateHistory: Array<{state: string, timestamp: number}> = [];
    private readonly maxHistorySize = 50;
    private readonly loopThreshold = 5; // events in 5 seconds
    private readonly frequencyThreshold = 10; // events in 10 seconds
    private readonly stuckStateThreshold = 30000; // 30 seconds
    
    /**
     * Log an event and its associated state
     */
    logEvent(event: string, state: string) {
        const now = Date.now();
        this.eventHistory.push({ event, timestamp: now, state });
        this.stateHistory.push({ state, timestamp: now });
        
        // Keep only recent history
        this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
        this.stateHistory = this.stateHistory.slice(-this.maxHistorySize);
        
        this.detectLoops(event, state, now);
    }
    
    /**
     * Log a state change
     */
    logStateChange(fromState: string, toState: string) {
        const now = Date.now();
        this.stateHistory.push({ state: toState, timestamp: now });
        
        // Keep only recent history
        this.stateHistory = this.stateHistory.slice(-this.maxHistorySize);
        
        this.detectStateLoops(toState, now);
    }
    
    private detectLoops(event: string, state: string, now: number) {
        // Detect rapid event repetition
        const recentEvents = this.eventHistory.filter(e => now - e.timestamp < 5000); // 5 seconds
        const eventCounts = recentEvents.reduce((acc, e) => {
            acc[e.event] = (acc[e.event] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        // Check for frequent events
        Object.entries(eventCounts).forEach(([eventName, count]) => {
            if (count >= this.loopThreshold) {
                console.warn(`🔄 LOOP DETECTED: Event '${eventName}' fired ${count} times in 5 seconds`);
                console.warn(`🔄 Recent event history:`, recentEvents.map(e => `${e.event}@${e.state}`).join(' → '));
                console.warn(`🔄 Current state: ${state}`);
            }
        });
        
        // Detect rapid state changes
        const recentStates = this.stateHistory.filter(s => now - s.timestamp < 10000); // 10 seconds
        const stateCounts = recentStates.reduce((acc, s) => {
            acc[s.state] = (acc[s.state] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        Object.entries(stateCounts).forEach(([stateName, count]) => {
            if (count >= this.frequencyThreshold) {
                console.warn(`🔄 FREQUENT STATE: '${stateName}' visited ${count} times in 10 seconds`);
            }
        });
        
        // Detect stuck states (same state for too long)
        const currentState = this.stateHistory[this.stateHistory.length - 1];
        if (currentState && now - currentState.timestamp > this.stuckStateThreshold) {
            console.warn(`🔄 STUCK STATE: '${currentState.state}' has been active for ${Math.round((now - currentState.timestamp) / 1000)} seconds`);
        }
    }
    
    private detectStateLoops(state: string, now: number) {
        // Detect state loops
        const recentStates = this.stateHistory.filter(s => now - s.timestamp < 10000); // 10 seconds
        const stateSequence = recentStates.map(s => s.state);
        
        // Check for state repetition patterns
        if (stateSequence.length >= 6) {
            const last6 = stateSequence.slice(-6);
            const pattern = last6.slice(0, 3);
            const repeat = last6.slice(3, 6);
            
            if (JSON.stringify(pattern) === JSON.stringify(repeat)) {
                console.warn(`🔄 STATE LOOP DETECTED: Pattern ${pattern.join(' → ')} repeated`);
                console.warn(`🔄 Full recent state history:`, stateSequence.join(' → '));
            }
        }
        
        // Detect ping-pong states (A -> B -> A -> B)
        if (stateSequence.length >= 4) {
            const last4 = stateSequence.slice(-4);
            if (last4[0] === last4[2] && last4[1] === last4[3] && last4[0] !== last4[1]) {
                console.warn(`🔄 PING-PONG STATE DETECTED: ${last4[0]} ↔ ${last4[1]} pattern detected`);
            }
        }
    }
    
    /**
     * Get current statistics about events and states
     */
    getStats() {
        const now = Date.now();
        const recentEvents = this.eventHistory.filter(e => now - e.timestamp < 10000);
        const recentStates = this.stateHistory.filter(s => now - s.timestamp < 10000);
        
        return {
            totalEvents: this.eventHistory.length,
            recentEvents: recentEvents.length,
            recentStates: recentStates.length,
            currentState: this.stateHistory[this.stateHistory.length - 1]?.state || 'unknown',
            eventFrequency: recentEvents.reduce((acc, e) => {
                acc[e.event] = (acc[e.event] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            stateFrequency: recentStates.reduce((acc, s) => {
                acc[s.state] = (acc[s.state] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        };
    }
    
    /**
     * Clear all history (useful for testing or resetting)
     */
    clear() {
        this.eventHistory = [];
        this.stateHistory = [];
    }
    
    /**
     * Get the last N events for debugging
     */
    getRecentEvents(count: number = 10) {
        return this.eventHistory.slice(-count);
    }
    
    /**
     * Get the last N state changes for debugging
     */
    getRecentStates(count: number = 10) {
        return this.stateHistory.slice(-count);
    }
}

/**
 * Middleware factory for adding loop detection to state machines
 */
export function createLoopDetectionMiddleware(loopDetector: LoopDetector) {
    return {
        // Intercept state changes
        onStateChange: (fromState: string, toState: string) => {
            loopDetector.logStateChange(fromState, toState);
        },
        
        // Intercept events
        onEvent: (event: string, state: string) => {
            loopDetector.logEvent(event, state);
        },
        
        // Get current stats
        getStats: () => loopDetector.getStats(),
        
        // Clear history
        clear: () => loopDetector.clear()
    };
}

// Create a default instance
export const defaultLoopDetector = new LoopDetector();
export const defaultLoopDetectionMiddleware = createLoopDetectionMiddleware(defaultLoopDetector);
