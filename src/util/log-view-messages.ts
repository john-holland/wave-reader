import { MessageFactory } from '../models/messages/log-view-messages';
import { validateVentureName, getVenturesByCategory } from './venture-states';
import Message from '../models/message';

/**
 * Enhanced message utility for the log-view-machine model
 * Provides proper message routing, validation, and factory methods
 */

export interface MessageRoute {
    from: string;
    to: string;
    message: Message<any>;
    timestamp: number;
    sessionId?: string;
}

export interface MessageValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export class LogViewMessageUtility {
    private static instance: LogViewMessageUtility;
    private messageHistory: MessageRoute[] = [];
    private maxHistorySize = 1000;

    private constructor() {}

    static getInstance(): LogViewMessageUtility {
        if (!LogViewMessageUtility.instance) {
            LogViewMessageUtility.instance = new LogViewMessageUtility();
        }
        return LogViewMessageUtility.instance;
    }

    /**
     * Create a message using the factory with proper validation
     */
    static createMessage(name: string, from: string, data?: any): Message<any> {
        try {
            // Validate the message name against venture states
            if (!validateVentureName(name)) {
                console.warn(`Message name "${name}" is not in the venture states list`);
            }

            return MessageFactory.createMessage(name, from, data);
        } catch (error) {
            console.error(`Failed to create message "${name}":`, error);
            throw error;
        }
    }

    /**
     * Validate a message against the log-view-machine model
     */
    static validateMessage(message: Message<any>): MessageValidationResult {
        const result: MessageValidationResult = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // Check if message name is valid
        if (!validateVentureName(message.getName())) {
            result.isValid = false;
            result.errors.push(`Message name "${message.getName()}" is not a valid venture`);
        }

        // Check if message has required properties
        if (!message.getFrom()) {
            result.isValid = false;
            result.errors.push('Message must have a "from" property');
        }

        if (!message.getName()) {
            result.isValid = false;
            result.errors.push('Message must have a "name" property');
        }

        // Check if clientId is missing (warning only)
        if (!message.getClientId() || message.getClientId() === 'no-id') {
            result.warnings.push('Message is missing a clientId');
        }

        return result;
    }

    /**
     * Route a message between components
     */
    static routeMessage(
        from: string, 
        to: string, 
        message: Message<any>, 
        sessionId?: string
    ): MessageRoute {
        const route: MessageRoute = {
            from,
            to,
            message,
            timestamp: Date.now(),
            sessionId
        };

        // Add to history
        const utility = LogViewMessageUtility.getInstance();
        utility.messageHistory.push(route);

        // Maintain history size
        if (utility.messageHistory.length > utility.maxHistorySize) {
            utility.messageHistory.shift();
        }

        return route;
    }

    /**
     * Get message history
     */
    static getMessageHistory(): MessageRoute[] {
        return LogViewMessageUtility.getInstance().messageHistory;
    }

    /**
     * Get messages by venture category
     */
    static getMessagesByCategory(category: string): MessageRoute[] {
        const utility = LogViewMessageUtility.getInstance();
        const categoryVentures = getVenturesByCategory(category);
        
        return utility.messageHistory.filter(route => 
            categoryVentures.includes(route.message.getName())
        );
    }

    /**
     * Get messages by component
     */
    static getMessagesByComponent(componentName: string): MessageRoute[] {
        const utility = LogViewMessageUtility.getInstance();
        
        return utility.messageHistory.filter(route => 
            route.from === componentName || route.to === componentName
        );
    }

    /**
     * Get messages by session
     */
    static getMessagesBySession(sessionId: string): MessageRoute[] {
        const utility = LogViewMessageUtility.getInstance();
        
        return utility.messageHistory.filter(route => 
            route.sessionId === sessionId
        );
    }

    /**
     * Clear message history
     */
    static clearMessageHistory(): void {
        const utility = LogViewMessageUtility.getInstance();
        utility.messageHistory = [];
    }

    /**
     * Get message statistics
     */
    static getMessageStats(): {
        totalMessages: number;
        messagesByVenture: Record<string, number>;
        messagesByComponent: Record<string, number>;
        messagesBySession: Record<string, number>;
        averageMessagesPerMinute: number;
    } {
        const utility = LogViewMessageUtility.getInstance();
        const now = Date.now();
        const oneMinuteAgo = now - (60 * 1000);

        // Count messages by venture
        const messagesByVenture: Record<string, number> = {};
        const messagesByComponent: Record<string, number> = {};
        const messagesBySession: Record<string, number> = {};
        let recentMessages = 0;

        utility.messageHistory.forEach(route => {
            // Count by venture
            const ventureName = route.message.getName();
            messagesByVenture[ventureName] = (messagesByVenture[ventureName] || 0) + 1;

            // Count by component
            messagesByComponent[route.from] = (messagesByComponent[route.from] || 0) + 1;
            messagesByComponent[route.to] = (messagesByComponent[route.to] || 0) + 1;

            // Count by session
            if (route.sessionId) {
                messagesBySession[route.sessionId] = (messagesBySession[route.sessionId] || 0) + 1;
            }

            // Count recent messages
            if (route.timestamp > oneMinuteAgo) {
                recentMessages++;
            }
        });

        return {
            totalMessages: utility.messageHistory.length,
            messagesByVenture,
            messagesByComponent,
            messagesBySession,
            averageMessagesPerMinute: recentMessages
        };
    }

    /**
     * Create a system message (from system component)
     */
    static createSystemMessage(name: string, data?: any): Message<any> {
        return this.createMessage(name, 'system', data);
    }

    /**
     * Create a popup message (from popup component)
     */
    static createPopupMessage(name: string, data?: any): Message<any> {
        return this.createMessage(name, 'popup', data);
    }

    /**
     * Create a content message (from content script)
     */
    static createContentMessage(name: string, data?: any): Message<any> {
        return this.createMessage(name, 'content', data);
    }

    /**
     * Create an ML service message
     */
    static createMLMessage(name: string, data?: any): Message<any> {
        return this.createMessage(name, 'ml-service', data);
    }

    /**
     * Create a background message (from background script)
     */
    static createBackgroundMessage(name: string, data?: any): Message<any> {
        return this.createMessage(name, 'background', data);
    }

    /**
     * Check if a message type is allowed in a specific state
     */
    static isMessageAllowedInState(messageName: string, stateName: string): boolean {
        // This would need to be implemented based on your state machine logic
        // For now, return true for all valid venture names
        return validateVentureName(messageName);
    }

    /**
     * Get all valid message names
     */
    static getValidMessageNames(): string[] {
        return MessageFactory.getMessageNames();
    }

    /**
     * Get legacy message names (for backward compatibility)
     */
    static getLegacyMessageNames(): string[] {
        return MessageFactory.getLegacyMessageNames();
    }

    /**
     * Convert a legacy message to a new format
     */
    static convertLegacyMessage(legacyMessage: any): Message<any> {
        // This would need to be implemented based on your legacy message format
        // For now, return the message as-is
        return legacyMessage;
    }
}

// Export convenience functions
export const createMessage = LogViewMessageUtility.createMessage;
export const validateMessage = LogViewMessageUtility.validateMessage;
export const routeMessage = LogViewMessageUtility.routeMessage;
export const getMessageHistory = LogViewMessageUtility.getMessageHistory;
export const getMessageStats = LogViewMessageUtility.getMessageStats;
export const createSystemMessage = LogViewMessageUtility.createSystemMessage;
export const createPopupMessage = LogViewMessageUtility.createPopupMessage;
export const createContentMessage = LogViewMessageUtility.createContentMessage;
export const createMLMessage = LogViewMessageUtility.createMLMessage;
export const createBackgroundMessage = LogViewMessageUtility.createBackgroundMessage;

export default LogViewMessageUtility;
