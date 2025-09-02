/**
 * Content System Message Service
 * 
 * Manages message handling for the content system including:
 * - Message routing between popup, background, and content scripts
 * - Message validation and transformation
 * - Message history and logging
 */

import { MessageUtility } from '../models/messages/simplified-messages';
import { MessageFactory } from '../models/messages/simplified-messages';

export interface MessageData {
  name: string;
  from: string;
  source?: string;
  target?: string;
  payload?: any;
  timestamp: number;
  sessionId?: string;
}

export interface MessageRoute {
  source: string;
  target: string;
  message: any;
  sessionId: string;
}

export interface MessageHandler {
  name: string;
  handler: (message: any, route: any) => Promise<void> | void;
  priority: number;
}

export interface MessageHistoryEntry {
  timestamp: number;
  type: string;
  message: string;
  data?: any;
  sessionId: string;
  url: string;
  state?: string;
}

export class ContentSystemMessageService {
  private messageHistory: MessageHistoryEntry[] = [];
  private messageHandlers: Map<string, MessageHandler> = new Map();
  private sessionId: string;
  private isInitialized: boolean = false;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  /**
   * Initialize the message service
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.warn("🌊 ContentSystemMessageService: Already initialized");
      return;
    }

    try {
      this.setupMessageListeners();
      this.isInitialized = true;
      console.log("🌊 ContentSystemMessageService: Initialized successfully");
    } catch (error) {
      console.error("🌊 ContentSystemMessageService: Initialization failed:", error);
      throw error;
    }
  }

  /**
   * Set up message listeners for extension and popup messages
   */
  private setupMessageListeners(): void {
    // Listen for messages from the extension
    window.addEventListener('message', (event) => {
      if (event.source !== window) return;
      if (event.data?.source !== 'wave-reader-extension') return;

      const messageData = event.data.message;
      this.handleExtensionMessage(messageData);
    });

    // Listen for messages from the popup
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        this.handlePopupMessage(message, sender, sendResponse);
        return true; // Keep message channel open
      });
    }
  }

  /**
   * Handle extension messages
   */
  private handleExtensionMessage(messageData: any): void {
    console.log("🌊 ContentSystemMessageService: Received extension message:", messageData);
    
    try {
      // Create a proper message using our factory
      const message = MessageFactory.createMessage(messageData.name, messageData.from, messageData);
      
      // Log the message
      this.logMessage('extension-message', `Received ${messageData.name} from ${messageData.from}`);
      
      // Route the message through our message system
      const route = MessageUtility.routeMessage(
        messageData.from, 
        'content-script', 
        message, 
        this.sessionId
      );
      
      // Process the message
      this.processMessage(message, route);
    } catch (error) {
      console.error("🌊 ContentSystemMessageService: Error handling extension message:", error);
      this.logMessage('message-error', `Error handling extension message: ${error}`);
    }
  }

  /**
   * Handle popup messages
   */
  private handlePopupMessage(message: any, sender: any, sendResponse: any): void {
    console.log("🌊 ContentSystemMessageService: Received popup message:", message);
    
    try {
      // Create a proper message using our factory
      const popupMessage = MessageFactory.createMessage(message.name, message.from, message);
      
      // Log the message
      this.logMessage('popup-message', `Received ${message.name} from popup`);
      
      // Route the message through our message system
      const route = MessageUtility.routeMessage(
        'popup', 
        'content-script', 
        popupMessage, 
        this.sessionId
      );
      
      // Process the message
      this.processMessage(popupMessage, route);
      
      // Send response back to popup
      sendResponse({ success: true, sessionId: this.sessionId });
    } catch (error) {
      console.error("🌊 ContentSystemMessageService: Error handling popup message:", error);
      this.logMessage('message-error', `Error handling popup message: ${error}`);
      sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Process a message using registered handlers
   */
  private processMessage(message: any, route: any): void {
    const messageName = message.name;
    
    try {
      // Find and execute the appropriate handler
      const handler = this.messageHandlers.get(messageName);
      if (handler) {
        handler.handler(message, route);
      } else {
        console.log(`🌊 ContentSystemMessageService: No handler found for message type: ${messageName}`);
        this.logMessage('unknown-message', `Unknown message type: ${messageName}`);
      }
    } catch (error) {
      console.error(`🌊 ContentSystemMessageService: Error processing message ${messageName}:`, error);
      this.logMessage('message-error', `Error processing ${messageName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Register a message handler
   */
  public registerHandler(handler: MessageHandler): void {
    if (this.messageHandlers.has(handler.name)) {
      console.warn(`🌊 ContentSystemMessageService: Handler for ${handler.name} already exists, overwriting`);
    }
    
    this.messageHandlers.set(handler.name, handler);
    console.log(`🌊 ContentSystemMessageService: Registered handler for ${handler.name}`);
  }

  /**
   * Unregister a message handler
   */
  public unregisterHandler(name: string): boolean {
    const removed = this.messageHandlers.delete(name);
    if (removed) {
      console.log(`🌊 ContentSystemMessageService: Unregistered handler for ${name}`);
    } else {
      console.warn(`🌊 ContentSystemMessageService: No handler found for ${name}`);
    }
    return removed;
  }

  /**
   * Get all registered handlers
   */
  public getHandlers(): Map<string, MessageHandler> {
    return new Map(this.messageHandlers);
  }

  /**
   * Check if a handler exists for a message type
   */
  public hasHandler(name: string): boolean {
    return this.messageHandlers.has(name);
  }

  /**
   * Send a message to the tome system
   */
  public sendToTome(message: any, tome: any): void {
    // Map message names to tome events
    const messageToTomeEvent: { [key: string]: string } = {
      'start': 'START',
      'stop': 'STOP',
      'toggle-wave-reader': 'TOGGLE',
      'selection-made': 'SELECTION-MADE',
      'ml-recommendation': 'ML-RECOMMENDATION',
      'settings-reset': 'SETTINGS-RESET',
      'wave-reader-start': 'WAVE-READER-START',
      'wave-reader-stop': 'WAVE-READER-STOP',
      'analytics': 'ANALYTICS',
      'health-check': 'HEALTH-CHECK'
    };

    const tomeEvent = messageToTomeEvent[message.name];
    if (tomeEvent && tome) {
      tome.send({ type: tomeEvent, payload: message }).then(() => {
        console.log(`🌊 ContentSystemMessageService: Tome received event: ${tomeEvent}`);
      }).catch((error: any) => {
        console.error(`🌊 ContentSystemMessageService: Tome event failed: ${tomeEvent}`, error);
      });
    }
  }

  /**
   * Log a message to the history
   */
  public logMessage(type: string, message: string, data?: any, state?: string): void {
    const logEntry: MessageHistoryEntry = {
      timestamp: Date.now(),
      type,
      message,
      data,
      sessionId: this.sessionId,
      url: window.location.href,
      state
    };
    
    this.messageHistory.push(logEntry);
    
    // Keep only last 1000 messages
    if (this.messageHistory.length > 1000) {
      this.messageHistory = this.messageHistory.slice(-1000);
    }
    
    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`🌊 ContentSystemMessageService [${type}]:`, message, data || '');
    }
  }

  /**
   * Get message history
   */
  public getMessageHistory(): MessageHistoryEntry[] {
    return [...this.messageHistory];
  }

  /**
   * Get message history by type
   */
  public getMessageHistoryByType(type: string): MessageHistoryEntry[] {
    return this.messageHistory.filter(entry => entry.type === type);
  }

  /**
   * Clear message history
   */
  public clearMessageHistory(): void {
    this.messageHistory = [];
    console.log("🌊 ContentSystemMessageService: Message history cleared");
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Check if service is initialized
   */
  public getInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Clean up the message service
   */
  public cleanup(): void {
    try {
      // Remove event listeners
      window.removeEventListener('message', this.handleExtensionMessage.bind(this));
      
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.onMessage.removeListener(this.handlePopupMessage.bind(this));
      }
      
      // Clear handlers and history
      this.messageHandlers.clear();
      this.messageHistory = [];
      
      this.isInitialized = false;
      console.log("🌊 ContentSystemMessageService: Cleanup completed");
    } catch (error) {
      console.error("🌊 ContentSystemMessageService: Cleanup failed:", error);
      throw error;
    }
  }

  /**
   * Reset service to initial state
   */
  public reset(): void {
    this.cleanup();
    this.sessionId = `content-system-message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default ContentSystemMessageService;
