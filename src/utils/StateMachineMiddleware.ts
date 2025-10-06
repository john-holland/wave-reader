import { LoopDetector, createLoopDetectionMiddleware } from './LoopDetector';

/**
 * State machine middleware system for adding debugging, logging, and monitoring capabilities
 */
export interface StateMachineMiddleware {
    onStateChange?: (fromState: string, toState: string, context?: any) => void;
    onEvent?: (event: string, state: string, context?: any) => void;
    onAction?: (actionName: string, state: string, context?: any) => void;
    onError?: (error: Error, state: string, context?: any) => void;
    getStats?: () => any;
    clear?: () => void;
}

/**
 * Middleware manager for state machines
 */
export class StateMachineMiddlewareManager {
    private middlewares: StateMachineMiddleware[] = [];
    private loopDetector: LoopDetector;
    
    constructor(loopDetector?: LoopDetector) {
        this.loopDetector = loopDetector || new LoopDetector();
        this.addMiddleware(createLoopDetectionMiddleware(this.loopDetector));
    }
    
    /**
     * Add a middleware to the manager
     */
    addMiddleware(middleware: StateMachineMiddleware) {
        this.middlewares.push(middleware);
    }
    
    /**
     * Remove a middleware from the manager
     */
    removeMiddleware(middleware: StateMachineMiddleware) {
        const index = this.middlewares.indexOf(middleware);
        if (index > -1) {
            this.middlewares.splice(index, 1);
        }
    }
    
    /**
     * Notify all middlewares of a state change
     */
    notifyStateChange(fromState: string, toState: string, context?: any) {
        this.middlewares.forEach(middleware => {
            try {
                middleware.onStateChange?.(fromState, toState, context);
            } catch (error) {
                console.error('Error in state change middleware:', error);
            }
        });
    }
    
    /**
     * Notify all middlewares of an event
     */
    notifyEvent(event: string, state: string, context?: any) {
        this.middlewares.forEach(middleware => {
            try {
                middleware.onEvent?.(event, state, context);
            } catch (error) {
                console.error('Error in event middleware:', error);
            }
        });
    }
    
    /**
     * Notify all middlewares of an action
     */
    notifyAction(actionName: string, state: string, context?: any) {
        this.middlewares.forEach(middleware => {
            try {
                middleware.onAction?.(actionName, state, context);
            } catch (error) {
                console.error('Error in action middleware:', error);
            }
        });
    }
    
    /**
     * Notify all middlewares of an error
     */
    notifyError(error: Error, state: string, context?: any) {
        this.middlewares.forEach(middleware => {
            try {
                middleware.onError?.(error, state, context);
            } catch (err) {
                console.error('Error in error middleware:', err);
            }
        });
    }
    
    /**
     * Get aggregated stats from all middlewares
     */
    getStats() {
        const stats: any = {};
        this.middlewares.forEach((middleware, index) => {
            try {
                const middlewareStats = middleware.getStats?.();
                if (middlewareStats) {
                    stats[`middleware_${index}`] = middlewareStats;
                }
            } catch (error) {
                console.error('Error getting stats from middleware:', error);
            }
        });
        return stats;
    }
    
    /**
     * Clear all middleware data
     */
    clear() {
        this.middlewares.forEach(middleware => {
            try {
                middleware.clear?.();
            } catch (error) {
                console.error('Error clearing middleware:', error);
            }
        });
    }
    
    /**
     * Get the loop detector instance
     */
    getLoopDetector(): LoopDetector {
        return this.loopDetector;
    }
}

/**
 * Create a middleware manager with default loop detection
 */
export function createStateMachineMiddlewareManager(loopDetector?: LoopDetector): StateMachineMiddlewareManager {
    return new StateMachineMiddlewareManager(loopDetector);
}

/**
 * Enhanced logging middleware
 */
export function createLoggingMiddleware(prefix: string = '🌊'): StateMachineMiddleware {
    return {
        onStateChange: (fromState: string, toState: string, context?: any) => {
            console.log(`${prefix} State Change: ${fromState} → ${toState}`, context ? { context } : '');
        },
        onEvent: (event: string, state: string, context?: any) => {
            console.log(`${prefix} Event: ${event} in state ${state}`, context ? { context } : '');
        },
        onAction: (actionName: string, state: string, context?: any) => {
            console.log(`${prefix} Action: ${actionName} in state ${state}`, context ? { context } : '');
        },
        onError: (error: Error, state: string, context?: any) => {
            console.error(`${prefix} Error in state ${state}:`, error, context ? { context } : '');
        }
    };
}

/**
 * Performance monitoring middleware
 */
export function createPerformanceMiddleware(): StateMachineMiddleware {
    const performanceData: any = {
        stateChanges: 0,
        events: 0,
        actions: 0,
        errors: 0,
        startTime: Date.now()
    };
    
    return {
        onStateChange: () => {
            performanceData.stateChanges++;
        },
        onEvent: () => {
            performanceData.events++;
        },
        onAction: () => {
            performanceData.actions++;
        },
        onError: () => {
            performanceData.errors++;
        },
        getStats: () => {
            const now = Date.now();
            const runtime = now - performanceData.startTime;
            return {
                ...performanceData,
                runtime,
                eventsPerSecond: performanceData.events / (runtime / 1000),
                stateChangesPerSecond: performanceData.stateChanges / (runtime / 1000)
            };
        },
        clear: () => {
            performanceData.stateChanges = 0;
            performanceData.events = 0;
            performanceData.actions = 0;
            performanceData.errors = 0;
            performanceData.startTime = Date.now();
        }
    };
}
