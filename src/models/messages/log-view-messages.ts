import Message from "../message";
import Options from "../options";

// Base Messages - align with BaseVentures
export class BaseMessage extends Message<BaseMessage> {
    constructor() {
        super('base', 'system');
    }
}

export class ErrorMessage extends Message<ErrorMessage> {
    error: string;
    
    constructor(attributes: Partial<ErrorMessage> = {}) {
        super('error', 'system', attributes);
        this.error = attributes.error || 'Unknown error occurred';
    }
}

// Start Messages - align with StartVentures
export class StartMessage extends Message<StartMessage> {
    options?: Options;

    constructor(attributes: Partial<StartMessage> = {
        options: new Options()
    }) {
        super('start', 'popup', attributes);
    }
}

export class WavingMessage extends Message<WavingMessage> {
    constructor() {
        super('waving', 'system');
    }
}

// Stop Messages - align with StopVentures
export class StopMessage extends Message<StopMessage> {
    constructor() {
        super('stop', 'popup');
    }
}

export class UpdateMessage extends Message<UpdateMessage> {
    data: any;
    
    constructor(attributes: Partial<UpdateMessage> = {}) {
        super('update', 'popup', attributes);
        this.data = attributes.data || {};
    }
}

export class ToggleStartMessage extends Message<ToggleStartMessage> {
    constructor() {
        super('toggle start', 'popup');
    }
}

export class StartMouseMessage extends Message<StartMouseMessage> {
    constructor() {
        super('start mouse', 'popup');
    }
}

// Waving Messages - align with WavingVentures
export class ToggleStopMessage extends Message<ToggleStopMessage> {
    constructor() {
        super('toggle stop', 'popup');
    }
}

export class StopMouseMessage extends Message<StopMouseMessage> {
    constructor() {
        super('stop mouse', 'popup');
    }
}

export class StartSelectionChooseMessage extends Message<StartSelectionChooseMessage> {
    selector?: string;
    
    constructor(attributes: Partial<StartSelectionChooseMessage> = {}) {
        super('start-selection-choose', 'popup', attributes);
    }
}

// Selection Messages - align with AllVentures
export class SelectionModeActivateMessage extends Message<SelectionModeActivateMessage> {
    constructor() {
        super('selection mode activate', 'popup');
    }
}

export class SelectionMadeMessage extends Message<SelectionMadeMessage> {
    selector?: string;
    
    constructor(attributes: Partial<SelectionMadeMessage> = {}) {
        super('selection made', 'content', attributes);
    }
}

export class SelectionModeDeactivateMessage extends Message<SelectionModeDeactivateMessage> {
    constructor() {
        super('selection mode deactivate', 'popup');
    }
}

// Additional Messages for ML and Enhanced Features
export class MLRecommendationMessage extends Message<MLRecommendationMessage> {
    domain: string;
    path: string;
    recommendations: any[];
    
    constructor(attributes: Partial<MLRecommendationMessage> = {}) {
        super('ml-recommendation', 'ml-service', attributes);
        this.domain = attributes.domain || '';
        this.path = attributes.path || '/';
        this.recommendations = attributes.recommendations || [];
    }
}

export class SettingsResetMessage extends Message<SettingsResetMessage> {
    domain: string;
    path: string;
    newDefaults: any;
    
    constructor(attributes: Partial<SettingsResetMessage> = {}) {
        super('settings-reset', 'popup', attributes);
        this.domain = attributes.domain || '';
        this.path = attributes.path || '/';
        this.newDefaults = attributes.newDefaults || {};
    }
}

export class BehaviorPatternMessage extends Message<BehaviorPatternMessage> {
    pattern: any;
    
    constructor(attributes: Partial<BehaviorPatternMessage> = {}) {
        super('behavior-pattern', 'content', attributes);
        this.pattern = attributes.pattern || {};
    }
}

export class WaveReaderStartMessage extends Message<WaveReaderStartMessage> {
    selector: string;
    options?: Options;
    
    constructor(attributes: Partial<WaveReaderStartMessage> = {}) {
        super('wave-reader-start', 'popup', attributes);
        this.selector = attributes.selector || 'p';
        this.options = attributes.options;
    }
}

export class WaveReaderStopMessage extends Message<WaveReaderStopMessage> {
    sessionId?: string;
    
    constructor(attributes: Partial<WaveReaderStopMessage> = {}) {
        super('wave-reader-stop', 'popup', attributes);
        this.sessionId = attributes.sessionId;
    }
}

export class WaveReaderUpdateMessage extends Message<WaveReaderUpdateMessage> {
    sessionId?: string;
    settings: any;
    
    constructor(attributes: Partial<WaveReaderUpdateMessage> = {}) {
        super('wave-reader-update', 'popup', attributes);
        this.sessionId = attributes.sessionId;
        this.settings = attributes.settings || {};
    }
}

export class AnalyticsMessage extends Message<AnalyticsMessage> {
    type: string;
    data: any;
    
    constructor(attributes: Partial<AnalyticsMessage> = {}) {
        super('analytics', 'system', attributes);
        this.type = attributes.type || 'interaction';
        this.data = attributes.data || {};
    }
}

export class ExtensionInstallMessage extends Message<ExtensionInstallMessage> {
    version: string;
    browser: string;
    
    constructor(attributes: Partial<ExtensionInstallMessage> = {}) {
        super('extension-install', 'system', attributes);
        this.version = attributes.version || '1.0.0';
        this.browser = attributes.browser || 'chrome';
    }
}

export class ExtensionUpdateMessage extends Message<ExtensionUpdateMessage> {
    oldVersion: string;
    newVersion: string;
    
    constructor(attributes: Partial<ExtensionUpdateMessage> = {}) {
        super('extension-update', 'system', attributes);
        this.oldVersion = attributes.oldVersion || '1.0.0';
        this.newVersion = attributes.newVersion || '1.0.0';
    }
}

export class HealthCheckMessage extends Message<HealthCheckMessage> {
    service: string;
    
    constructor(attributes: Partial<HealthCheckMessage> = {}) {
        super('health-check', 'system', attributes);
        this.service = attributes.service || 'unknown';
    }
}

// Legacy Message Aliases for Backward Compatibility
export class ToggleWaveReaderMessage extends Message<ToggleWaveReaderMessage> {
    constructor() {
        super('toggle-wave-reader', 'popup');
    }
}

export class BootstrapMessage extends Message<BootstrapMessage> {
    constructor() {
        super('bootstrap', 'system');
    }
}

export class BootstrapResultMessage extends Message<BootstrapResultMessage> {
    success: boolean;
    data?: any;
    
    constructor(attributes: Partial<BootstrapResultMessage> = {}) {
        super('bootstrap-result', 'system', attributes);
        this.success = attributes.success || false;
        this.data = attributes.data;
    }
}

export class HeartbeatResultMessage extends Message<HeartbeatResultMessage> {
    timestamp: number;
    status: string;
    
    constructor(attributes: Partial<HeartbeatResultMessage> = {}) {
        super('heartbeat-result', 'system', attributes);
        this.timestamp = attributes.timestamp || Date.now();
        this.status = attributes.status || 'healthy';
    }
}

export class PingMessage extends Message<PingMessage> {
    constructor() {
        super('ping', 'system');
    }
}

export class PongMessage extends Message<PongMessage> {
    timestamp: number;
    
    constructor(attributes: Partial<PongMessage> = {}) {
        super('pong', 'system', attributes);
        this.timestamp = attributes.timestamp || Date.now();
    }
}

export class UpdateGoingStateMessage extends Message<UpdateGoingStateMessage> {
    going: boolean;
    
    constructor(attributes: Partial<UpdateGoingStateMessage> = {}) {
        super('update-going-state', 'popup', attributes);
        this.going = attributes.going || false;
    }
}

export class UpdateWaveMessage extends Message<UpdateWaveMessage> {
    options: Options;
    
    constructor(attributes: Partial<UpdateWaveMessage> = {}) {
        super('update-wave', 'popup', attributes);
        this.options = attributes.options || new Options();
    }
}

export class SelectorUpdatedMessage extends Message<SelectorUpdatedMessage> {
    selector: string;
    
    constructor(attributes: Partial<SelectorUpdatedMessage> = {}) {
        super('selector-updated', 'content', attributes);
        this.selector = attributes.selector || 'p';
    }
}

export class StartAddSelectorMessage extends Message<StartAddSelectorMessage> {
    constructor() {
        super('start-add-selector', 'popup');
    }
}

export class AddSelectorMessage extends Message<AddSelectorMessage> {
    selector: string;
    
    constructor(attributes: Partial<AddSelectorMessage> = {}) {
        super('add-selector', 'content', attributes);
        this.selector = attributes.selector || 'p';
    }
}

export class CancelAddSelectorMessage extends Message<CancelAddSelectorMessage> {
    constructor() {
        super('cancel-add-selector', 'popup');
    }
}

export class RemoveSelectorMessage extends Message<RemoveSelectorMessage> {
    selector: string;
    
    constructor(attributes: Partial<RemoveSelectorMessage> = {}) {
        super('remove-selector', 'popup', attributes);
        this.selector = attributes.selector || 'p';
    }
}

export class EndSelectionChooseMessage extends Message<EndSelectionChooseMessage> {
    constructor() {
        super('end-selection-choose', 'popup');
    }
}

export class SelectionModeMessage extends Message<SelectionModeMessage> {
    active: boolean;
    
    constructor(attributes: Partial<SelectionModeMessage> = {}) {
        super('selection-mode', 'popup', attributes);
        this.active = attributes.active || false;
    }
}

export class StartMouseMoveMessage extends Message<StartMouseMoveMessage> {
    constructor() {
        super('start-mouse-move', 'popup');
    }
}

export class StopMouseMoveMessage extends Message<StopMouseMoveMessage> {
    constructor() {
        super('stop-mouse-move', 'popup');
    }
}

export class UpdateSelectorMessage extends Message<UpdateSelectorMessage> {
    selector: string;
    
    constructor(attributes: Partial<UpdateSelectorMessage> = {}) {
        super('update-selector', 'popup', attributes);
        this.selector = attributes.selector || 'p';
    }
}

// Message Factory for creating messages with consistent naming
export class MessageFactory {
    static createMessage(name: string, from: string, data?: any): Message<any> {
        const messageMap: Record<string, new (attributes?: any) => Message<any>> = {
            // Base messages
            'base': BaseMessage,
            'error': ErrorMessage,
            
            // Start messages
            'start': StartMessage,
            'waving': WavingMessage,
            
            // Stop messages
            'stop': StopMessage,
            'update': UpdateMessage,
            'toggle start': ToggleStartMessage,
            'start mouse': StartMouseMessage,
            
            // Waving messages
            'toggle stop': ToggleStopMessage,
            'stop mouse': StopMouseMessage,
            'start-selection-choose': StartSelectionChooseMessage,
            
            // Selection messages
            'selection mode activate': SelectionModeActivateMessage,
            'selection made': SelectionMadeMessage,
            'selection mode deactivate': SelectionModeDeactivateMessage,
            
            // ML and enhanced messages
            'ml-recommendation': MLRecommendationMessage,
            'settings-reset': SettingsResetMessage,
            'behavior-pattern': BehaviorPatternMessage,
            'wave-reader-start': WaveReaderStartMessage,
            'wave-reader-stop': WaveReaderStopMessage,
            'wave-reader-update': WaveReaderUpdateMessage,
            'analytics': AnalyticsMessage,
            'extension-install': ExtensionInstallMessage,
            'extension-update': ExtensionUpdateMessage,
            'health-check': HealthCheckMessage,
            
            // Legacy messages
            'toggle-wave-reader': ToggleWaveReaderMessage,
            'bootstrap': BootstrapMessage,
            'bootstrap-result': BootstrapResultMessage,
            'heartbeat-result': HeartbeatResultMessage,
            'ping': PingMessage,
            'pong': PongMessage,
            'update-going-state': UpdateGoingStateMessage,
            'update-wave': UpdateWaveMessage,
            'selector-updated': SelectorUpdatedMessage,
            'start-add-selector': StartAddSelectorMessage,
            'add-selector': AddSelectorMessage,
            'cancel-add-selector': CancelAddSelectorMessage,
            'remove-selector': RemoveSelectorMessage,
            'end-selection-choose': EndSelectionChooseMessage,
            'selection-mode': SelectionModeMessage,
            'start-mouse-move': StartMouseMoveMessage,
            'stop-mouse-move': StopMouseMoveMessage,
            'update-selector': UpdateSelectorMessage
        };
        
        const MessageClass = messageMap[name];
        if (!MessageClass) {
            throw new Error(`Unknown message type: ${name}`);
        }
        
        return new MessageClass(data ? { ...data, name, from } : { name, from });
    }
    
    static getMessageNames(): string[] {
        return [
            'base', 'error',
            'start', 'waving',
            'stop', 'update', 'toggle start', 'start mouse',
            'toggle stop', 'stop mouse', 'start-selection-choose',
            'selection mode activate', 'selection made', 'selection mode deactivate',
            'ml-recommendation', 'settings-reset', 'behavior-pattern',
            'wave-reader-start', 'wave-reader-stop', 'wave-reader-update',
            'analytics', 'extension-install', 'extension-update', 'health-check'
        ];
    }
    
    static getLegacyMessageNames(): string[] {
        return [
            'toggle-wave-reader', 'bootstrap', 'bootstrap-result',
            'heartbeat-result', 'ping', 'pong', 'update-going-state',
            'update-wave', 'selector-updated', 'start-add-selector',
            'add-selector', 'cancel-add-selector', 'remove-selector',
            'end-selection-choose', 'selection-mode', 'start-mouse-move',
            'stop-mouse-move', 'update-selector'
        ];
    }
}

export default MessageFactory;
