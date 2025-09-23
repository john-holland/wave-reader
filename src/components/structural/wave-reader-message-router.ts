import { StructuralSystem } from 'log-view-machine';
import WaveReaderStructuralConfig from './wave-reader-structural-config';

/**
 * Wave Reader Message Router
 * 
 * This service handles message routing between components using the structural system.
 * It provides priority-based routing, error handling, and performance monitoring.
 */

export interface WaveReaderMessage {
  id: string;
  type: string;
  source: string;
  target: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  data?: any;
  timestamp: number;
  traceId?: string;
  retryCount?: number;
}

export interface MessageRoutingResult {
  success: boolean;
  targetComponent: string;
  processingTime: number;
  error?: string;
  response?: any;
  messageId?: string;
  timestamp?: number;
  retryCount?: number;
}

export class WaveReaderMessageRouter {
  private structuralSystem: StructuralSystem;
  private messageQueue: Map<string, WaveReaderMessage[]> = new Map();
  private processingMessages: Set<string> = new Set();
  private messageHistory: WaveReaderMessage[] = [];
  private errorCount: Map<string, number> = new Map();
  private performanceMetrics: Map<string, number[]> = new Map();

  constructor() {
    this.structuralSystem = new StructuralSystem(WaveReaderStructuralConfig);
    this.initializeMessageQueues();
  }

  /**
   * Initialize message queues for each priority level
   */
  private initializeMessageQueues(): void {
    const priorities = ['critical', 'high', 'normal', 'low'];
    priorities.forEach(priority => {
      this.messageQueue.set(priority, []);
    });
  }

  /**
   * Send a message to a specific component
   */
  async sendMessage(message: Omit<WaveReaderMessage, 'id' | 'timestamp'>): Promise<MessageRoutingResult> {
    const fullMessage: WaveReaderMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: Date.now()
    };

    console.log(`🌊 Message Router: Sending message ${fullMessage.type} from ${fullMessage.source} to ${fullMessage.target}`);

    try {
      // Add message to appropriate queue
      this.addToQueue(fullMessage);

      // Process message based on priority
      const result = await this.processMessage(fullMessage);

      // Record performance metrics
      this.recordPerformanceMetrics(fullMessage.target, result.processingTime);

      // Add to message history
      this.addToHistory(fullMessage);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`🌊 Message Router: Error processing message ${fullMessage.id}:`, errorMessage);
      
      // Record error
      this.recordError(fullMessage.target);
      
      return {
        success: false,
        targetComponent: fullMessage.target,
        processingTime: 0,
        error: errorMessage,
        messageId: fullMessage.id,
        timestamp: fullMessage.timestamp,
        retryCount: fullMessage.retryCount || 0
      };
    }
  }

  /**
   * Route a message based on the structural system configuration
   */
  public async routeMessage(type: string, target: string, data?: any, priority: WaveReaderMessage['priority'] = 'normal'): Promise<MessageRoutingResult> {
    const message: WaveReaderMessage = {
      id: this.generateMessageId(),
      type,
      source: 'message-router',
      target,
      priority,
      data,
      timestamp: Date.now()
    };

    return await this.processMessage(message);
  }

  /**
   * Internal route resolution method
   */
  private async resolveRoute(message: WaveReaderMessage): Promise<string> {
    const { type, source } = message;
    
    // Simple routing based on message type
    if (type.includes('WAVE_READER')) {
      return 'wave-reader';
    } else if (type.includes('TAB')) {
      return 'wave-tabs';
    } else if (type.includes('SETTING')) {
      return 'settings';
    } else if (type.includes('SELECTOR')) {
      return 'selector-input';
    } else if (type.includes('BUTTON')) {
      return 'go-button';
    }

    // Fallback to main app
    return 'main-app';
  }

  /**
   * Process a message through the structural system
   */
  private async processMessage(message: WaveReaderMessage): Promise<MessageRoutingResult> {
    const startTime = Date.now();
    
    try {
      // Route the message to the appropriate component
      const targetComponent = await this.resolveRoute(message);
      
      // Get the target machine from the structural system
      const targetMachine = this.structuralSystem.getMachine(targetComponent);
      
      if (!targetMachine) {
        throw new Error(`Target machine not found for component: ${targetComponent}`);
      }

      // Send the message to the target machine
      const response = await targetMachine.send({
        type: message.type,
        ...message.data,
        source: message.source,
        priority: message.priority,
        traceId: message.traceId
      });

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        targetComponent,
        processingTime,
        response,
        messageId: message.id,
        timestamp: message.timestamp,
        retryCount: message.retryCount || 0
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      throw error;
    }
  }

  /**
   * Add message to priority queue
   */
  private addToQueue(message: WaveReaderMessage): void {
    const queue = this.messageQueue.get(message.priority);
    if (queue) {
      queue.push(message);
      
      // Sort queue by priority and timestamp
      queue.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.timestamp - b.timestamp;
      });
    }
  }

  /**
   * Process all queued messages
   */
  async processQueuedMessages(): Promise<void> {
    const priorities = ['critical', 'high', 'normal', 'low'];
    
    for (const priority of priorities) {
      const queue = this.messageQueue.get(priority);
      if (!queue || queue.length === 0) continue;

      const message = queue.shift();
      if (message && !this.processingMessages.has(message.id)) {
        this.processingMessages.add(message.id);
        
        try {
          await this.processMessage(message);
        } finally {
          this.processingMessages.delete(message.id);
        }
      }
    }
  }

  /**
   * Broadcast message to multiple components
   */
  async broadcastMessage(message: Omit<WaveReaderMessage, 'id' | 'timestamp' | 'target'>, targets: string[]): Promise<MessageRoutingResult[]> {
    const results: MessageRoutingResult[] = [];
    
    for (const target of targets) {
      const result = await this.sendMessage({
        ...message,
        target
      });
      results.push(result);
    }
    
    return results;
  }

  /**
   * Send message with retry logic
   */
  async sendMessageWithRetry(message: Omit<WaveReaderMessage, 'id' | 'timestamp'>, maxRetries: number = 3): Promise<MessageRoutingResult> {
    let lastError: string | undefined;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.sendMessage({
          ...message,
          retryCount: attempt
        });
        
        if (result.success) {
          return result;
        }
        
        lastError = result.error;
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
      }
    }
    
    throw new Error(`Message failed after ${maxRetries} retries. Last error: ${lastError}`);
  }

  /**
   * Get message statistics
   */
  getMessageStats(): {
    totalMessages: number;
    successRate: number;
    averageProcessingTime: number;
    errorCount: number;
    queueSizes: Record<string, number>;
    successfulMessages: number;
    failedMessages: number;
    priorityDistribution: Record<string, number>;
  } {
    const totalMessages = this.messageHistory.length;
    const successfulMessages = this.messageHistory.filter(m => !this.processingMessages.has(m.id)).length;
    const failedMessages = totalMessages - successfulMessages;
    const successRate = totalMessages > 0 ? (successfulMessages / totalMessages) * 100 : 0;
    
    const allProcessingTimes = Array.from(this.performanceMetrics.values()).flat();
    const averageProcessingTime = allProcessingTimes.length > 0 
      ? allProcessingTimes.reduce((sum, time) => sum + time, 0) / allProcessingTimes.length 
      : 0;
    
    const errorCount = Array.from(this.errorCount.values()).reduce((sum, count) => sum + count, 0);
    
    const queueSizes: Record<string, number> = {};
    this.messageQueue.forEach((queue, priority) => {
      queueSizes[priority] = queue.length;
    });

    // Calculate priority distribution
    const priorityDistribution: Record<string, number> = {};
    this.messageHistory.forEach(message => {
      priorityDistribution[message.priority] = (priorityDistribution[message.priority] || 0) + 1;
    });

    return {
      totalMessages,
      successRate,
      averageProcessingTime,
      errorCount,
      queueSizes,
      successfulMessages,
      failedMessages,
      priorityDistribution
    };
  }

  /**
   * Get queue status information
   */
  getQueueStatus(): {
    messageQueueSize: number;
    retryQueueSize: number;
    isProcessing: boolean;
    processingCount: number;
  } {
    const totalQueued = Array.from(this.messageQueue.values()).reduce((sum, queue) => sum + queue.length, 0);
    const processingCount = this.processingMessages.size;
    
    return {
      messageQueueSize: totalQueued,
      retryQueueSize: 0, // We don't have a separate retry queue in this implementation
      isProcessing: processingCount > 0,
      processingCount
    };
  }

  /**
   * Clear message history and reset metrics
   */
  clearMetrics(): void {
    this.messageHistory = [];
    this.errorCount.clear();
    this.performanceMetrics.clear();
    this.processingMessages.clear();
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add message to history
   */
  private addToHistory(message: WaveReaderMessage): void {
    this.messageHistory.push(message);
    
    // Keep only last 1000 messages
    if (this.messageHistory.length > 1000) {
      this.messageHistory = this.messageHistory.slice(-1000);
    }
  }

  /**
   * Record performance metrics
   */
  private recordPerformanceMetrics(component: string, processingTime: number): void {
    if (!this.performanceMetrics.has(component)) {
      this.performanceMetrics.set(component, []);
    }
    
    const metrics = this.performanceMetrics.get(component)!;
    metrics.push(processingTime);
    
    // Keep only last 100 metrics per component
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
  }

  /**
   * Record error for component
   */
  private recordError(component: string): void {
    const currentCount = this.errorCount.get(component) || 0;
    this.errorCount.set(component, currentCount + 1);
  }

  /**
   * Get structural system instance
   */
  getStructuralSystem(): StructuralSystem {
    return this.structuralSystem;
  }

  /**
   * Health check for the message router
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    metrics: any;
    timestamp: number;
    error?: string;
  }> {
    const stats = this.getMessageStats();
    const queueSizes = Object.values(stats.queueSizes);
    const totalQueued = queueSizes.reduce((sum, size) => sum + size, 0);
    
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    let message = 'Message router is operating normally';
    let error: string | undefined;
    
    if (stats.errorCount > 10) {
      status = 'degraded';
      message = 'High error rate detected';
    }
    
    if (totalQueued > 100) {
      status = 'degraded';
      message = 'Message queue is backing up';
    }
    
    if (stats.successRate < 80) {
      status = 'unhealthy';
      message = 'Low success rate indicates system issues';
      error = 'System failure';
    }
    
    return {
      status,
      message,
      metrics: stats,
      timestamp: Date.now(),
      error
    };
  }
}

// Export singleton instance
export const waveReaderMessageRouter = new WaveReaderMessageRouter();

// Export the class for testing
export default WaveReaderMessageRouter;
