import AttributeConstructor from "../util/attribute-constructor";
import {Named} from "../util/state";

export interface MessageTrackingConfig {
    enabled: boolean;
    maxCollisions: number;
    maxHistorySize: number;
    trackTimestamps: boolean;
    trackAttributes: boolean;
    maxLoopDepth: number;  // Maximum depth for loop detection
}

export const DefaultTrackingConfig: MessageTrackingConfig = {
    enabled: true,
    maxCollisions: 100,
    maxHistorySize: 1000,
    trackTimestamps: true,
    trackAttributes: true,
    maxLoopDepth: 10
};

export interface MessageInterface {
    getName(): string;
    getFrom(): string;
    getClientId(): string;
    getHash(): Promise<string>;
    getTimestamp(): number;
}

export default abstract class Message<T> extends AttributeConstructor<T> implements MessageInterface, Named {
    name: string;
    from: string;
    clientId?: string;
    private _hash?: string;
    private _timestamp: number;
    private static _hashCollisions: Map<string, string[]> = new Map();
    private static _config: MessageTrackingConfig = DefaultTrackingConfig;
    private static _messageHistory: Array<{hash: string, timestamp: number, attributes: any}> = [];
    private static _messageLoops: Map<string, number> = new Map();  // Tracks message depth in loops

    protected constructor(name: string, from: string, attributes?: Partial<T>, requireAllAssigned: boolean = true, clientId = undefined) {
        super(attributes, requireAllAssigned)

        this.name = name;
        this.from = from;
        this.clientId = clientId;
        this._timestamp = Date.now();
    }

    static configure(config: Partial<MessageTrackingConfig>): void {
        Message._config = { ...DefaultTrackingConfig, ...config };
        if (!Message._config.enabled) {
            Message.clearTracking();
        }
    }

    static getConfig(): MessageTrackingConfig {
        return { ...Message._config };
    }

    /**
     * Returns clientId
     */
    getFrom(): string {
        return this.from
    }

    getName(): string {
        return this.name;
    }

    getClientId(): string {
        if (!this.clientId) console.log("clientId is missing from message: " + this.name + ", from, " + this.from)
        return this.clientId || "no-id";
    }

    getTimestamp(): number {
        return this._timestamp;
    }

    async getHash(): Promise<string> {
        if (!this._hash) {
            // Create a deterministic hash based on message properties
            const hashInput = JSON.stringify({
                name: this.name,
                from: this.from,
                clientId: this.clientId,
                timestamp: this._timestamp,
                attributes: this.getAttributes()
            });
            this._hash = await this.generateHash(hashInput);
            if (Message._config.enabled) {
                this.trackMessage(this._hash);
            }
        }
        return this._hash;
    }

    protected getAttributes(): Partial<T> {
        // Get all non-message properties
        const { name, from, clientId, _hash, _timestamp, ...attributes } = this as any;
        return attributes;
    }

    private async generateHash(input: string): Promise<string> {
        // Use SubtleCrypto for secure hashing in the browser
        const msgBuffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private trackMessage(hash: string): void {
        if (!Message._config.enabled) return;

        // Track in history
        if (Message._config.trackTimestamps || Message._config.trackAttributes) {
            const entry = {
                hash,
                timestamp: this._timestamp,
                attributes: Message._config.trackAttributes ? this.getAttributes() : undefined
            };
            Message._messageHistory.push(entry);
            
            // Maintain history size limit
            if (Message._messageHistory.length > Message._config.maxHistorySize) {
                Message._messageHistory.shift();
            }
        }

        // Track collisions (different messages with same hash)
        if (!Message._hashCollisions.has(hash)) {
            Message._hashCollisions.set(hash, [JSON.stringify(this.getAttributes())]);
        } else {
            const existing = Message._hashCollisions.get(hash)!;
            if (!existing.includes(JSON.stringify(this.getAttributes()))) {
                if (existing.length < Message._config.maxCollisions) {
                    existing.push(JSON.stringify(this.getAttributes()));
                    console.warn(`Hash collision detected for hash ${hash}. This could indicate a problem with message uniqueness.`);
                    console.warn('Colliding messages:', existing);
                } else {
                    console.warn(`Maximum collision tracking limit (${Message._config.maxCollisions}) reached for hash ${hash}`);
                }
            }
        }

        // Track message loops (same message being processed multiple times)
        const currentDepth = (Message._messageLoops.get(hash) || 0) + 1;
        Message._messageLoops.set(hash, currentDepth);
        
        if (currentDepth > Message._config.maxLoopDepth) {
            console.error(`Message loop detected! Message ${this.name} from ${this.from} has been processed ${currentDepth} times.`);
            console.error('Message details:', this.getAttributes());
            // You might want to throw an error or take other action here
        }
    }

    async equals(other: Message<T>): Promise<boolean> {
        const [thisHash, otherHash] = await Promise.all([this.getHash(), other.getHash()]);
        if (thisHash === otherHash) {
            // Even if hashes match, verify the actual content
            return JSON.stringify(this.getAttributes()) === JSON.stringify(other.getAttributes());
        }
        return false;
    }

    static getMessageHistory(): Array<{hash: string, timestamp: number, attributes?: any}> {
        return [...Message._messageHistory];
    }

    static getHashCollisions(): Map<string, string[]> {
        return new Map(Message._hashCollisions);
    }

    static getMessageLoops(): Map<string, number> {
        return new Map(Message._messageLoops);
    }

    static clearTracking(): void {
        Message._hashCollisions.clear();
        Message._messageHistory = [];
        Message._messageLoops.clear();
    }

    static getMemoryUsage(): { collisions: number, history: number, loops: number } {
        return {
            collisions: Message._hashCollisions.size,
            history: Message._messageHistory.length,
            loops: Message._messageLoops.size
        };
    }
}
